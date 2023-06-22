import db from '../../../../utils/database'
import { validateApiKeyAndPermissions } from '../../../../utils/auth'

export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key']
  const { method } = req

  const { isValid, message } = await validateApiKeyAndPermissions(
    apiKey,
    method,
  )

  if (!isValid) {
    return res.status(403).json({ message })
  }

  switch (req.method) {
    case 'GET':
      const filters = req.query
      const page = filters.page ? parseInt(filters.page) : 1
      const limit = filters.limit ? parseInt(filters.limit) : 25
      const offset = (page - 1) * limit
      delete filters.page
      delete filters.limit
      const devices = await getFilteredDevices(filters, offset, limit)
      res.status(200).json(devices)
      break
    default:
      res.status(400).json({
        message: 'Invalid method',
      })
      break
  }
}

async function getFilteredDevices(filters, offset, limit) {
  let query = `
    SELECT category_name, name, value, COUNT(*) AS count
    FROM specs 
    INNER JOIN (
        SELECT DISTINCT title 
        FROM devices 
        WHERE 1 = 1 
  `
  let ramAndStorageFilters = { RAM: [], Stockage: [] }

  for (const filter in filters) {
    let value = filters[filter]
    let range = false
    if (typeof value === 'string' && value.includes('||')) {
      value = value.split('||')
      range = true
    }

    if (filter === 'RAM' || filter === 'Stockage') {
      ramAndStorageFilters[filter].push(value)
      continue // Skip the rest of the loop as we've stored the values for later
    }

    switch (filter) {
      // les autres cas restent inchangés
      case 'DAS':
      case 'Taille Ecran (en pouces)':
      case 'Taille Batterie (en mAh)':
      case 'Poids (en g)':
      case 'Prix (en Euros)':
      case 'Puissance de charge (en W)':
        if (range) {
          query += `
            AND title IN (
                SELECT device_title 
                FROM specs 
                WHERE name = '${filter}' AND CAST(value AS DECIMAL(10,2)) BETWEEN '${value[0]}' AND '${value[1]}'
            )
        `
        } else {
          query += `
            AND title IN (
                SELECT device_title 
                FROM specs 
                WHERE name = '${filter}' AND value = '${value}'
            )
        `
        }
        break
      case '4G':
      case '5G':
      case 'Carte SD':
      case 'Definition Ecran':
      case 'Marque':
      case 'Matériau Arrière':
      case 'Puissance de charge (en W)':
      case 'Rafraichissement Ecran (en Hz)':
      case 'Ratio Ecran':
      case 'SoC':
      case 'Technologie Ecran':
      case 'Type':
        query += `
                    AND title IN (
                        SELECT device_title 
                        FROM specs 
                        WHERE name = '${filter}' AND value = '${value}'
                    )
                `
        break
      case 'Nombre de capteurs (camera)':
      case 'Nombre de capteurs (selfie)':
        switch (value) {
          case 'Single':
          case 'Dual':
          case 'Triple':
          case 'Quad':
          case 'Five':
            query += `
                            AND title IN (
                                SELECT device_title 
                                FROM specs 
                                WHERE name = '${value}' AND category_name = '${filter}'
                            )
                        `
            break
          default:
            break
        }
        break
      default:
        break
    }
  }

  for (const filter in ramAndStorageFilters) {
    if (ramAndStorageFilters[filter].length > 0) {
      let filterConditions = ramAndStorageFilters[filter]
        .map((val) =>
          val.split(',').map(
            (v) => `
            AND title IN (
                SELECT device_title 
                FROM specs 
                WHERE name = '${filter}' AND value = '${v.trim()}'
            )
        `,
          ),
        )
        .flat()
        .join(' ')

      query += filterConditions
    }
  }

  query += `
        ) AS filtered_devices ON specs.device_title = filtered_devices.title
        WHERE specs.name IN (
            "4G", "5G", "Carte SD", "DAS", "Definition Ecran", "Taille Batterie (en mAh)", "Nombre de capteurs (camera)", "Prix (en Euros)", "Marque", "Matériau Arrière", "Puissance de charge (en W)", "Rafraichissement Ecran (en Hz)", "RAM", "Ratio Ecran", "Nombre de capteurs (selfie)", "SoC", "Stockage", "Taille Ecran (en pouces)", "Technologie Ecran", "Type", "Poids (en g)"
        ) AND specs.category_name = "AddedData"
        GROUP BY specs.category_name, specs.name, specs.value;
    `
  const devices = await db.query(query)

  const structuredData = [
    {
      name: 'Marque',
      values: [],
    },
    {
      name: 'Type',
      values: [],
    },
    {
      name: 'Prix (en Euros)',
      values: [],
    },
    {
      name: 'DAS',
      values: [],
    },
    {
      name: 'Taille Ecran (en pouces)',
      values: [],
    },
    {
      name: 'Rafraichissement Ecran (en Hz)',
      values: [],
    },
    {
      name: 'Definition Ecran',
      values: [],
    },
    {
      name: 'Technologie Ecran',
      values: [],
    },
    {
      name: 'Ratio Ecran',
      values: [],
    },
    {
      name: 'Taille Batterie (en mAh)',
      values: [],
    },
    {
      name: 'Puissance de charge (en W)',
      values: [],
    },
    {
      name: 'Nombre de capteurs (camera)',
      values: [],
    },
    {
      name: 'Nombre de capteurs (selfie)',
      values: [],
    },
    {
      name: 'RAM',
      values: [],
    },
    {
      name: 'Stockage',
      values: [],
    },
    {
      name: 'SoC',
      values: [],
    },
    {
      name: 'Poids (en g)',
      values: [],
    },
    {
      name: 'Matériau Arrière',
      values: [],
    },
  ]

  // Parcours des résultats de la requête et ajout des données structurées
  for (const device of devices) {
    if (['Carte SD', '4G', '5G'].includes(device.name)) {
      const featuresFilter = structuredData.find(
        (filter) => filter.name === 'Fonctionnalités',
      )
      if (!featuresFilter) {
        structuredData.push({
          name: 'Fonctionnalités',
          values: [
            {
              value: device.name, // ici on met le nom du filtre en tant que valeur
              count: device.count,
            },
          ],
        })
      } else {
        const existingFeature = featuresFilter.values.find(
          (value) => value.value === device.name,
        )
        if (existingFeature) {
          existingFeature.count += device.count
        } else {
          featuresFilter.values.push({
            value: device.name,
            count: device.count,
          })
        }
      }
    } else {
      const filter = structuredData.find(
        (filter) => filter.name === device.name,
      )
      if (filter) {
        filter.values.push({
          value: device.value,
          count: device.count,
        })
      }
    }
  }

  return structuredData
}
