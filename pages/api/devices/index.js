import db from '../../../utils/database'
import { validateApiKeyAndPermissions } from '../../../utils/auth'

export default async function handler(req, res) {
  const validation = await validateApiKeyAndPermissions(
    req.headers['x-api-key'],
    req.method,
  )
  if (!validation.isValid) {
    return res.status(403).json({
      message: validation.message,
    })
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
      return res.status(400).json({
        message: 'Invalid method',
      })
  }
}

async function getFilteredDevices(filters, offset, limit) {
  let query = `
    SELECT DISTINCT D.id, D.brand_name, D.title, D.img, D.description, D.description_french, D.announced_date, D.technical_sheet_written
    FROM devices AS D
    WHERE 1 = 1
  `
  let ramAndStorageFilters = { RAM: [], Stockage: [] }

  for (const filter in filters) {
    let value = filters[filter]
    let range = false
    if (typeof value === 'string') {
      if (value.includes('||')) {
        value = value.split('||')
        range = true
      } else {
        let valuesArray = value.split(',')
        if (filter === 'RAM' || filter === 'Stockage') {
          ramAndStorageFilters[filter].push(...valuesArray)
        } else {
          valuesArray.forEach((val) => {
            query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${filter}' AND \`S${filter}\`.value = '${val}')`
          })
        }
      }
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
          query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${filter}' AND CAST(\`S${filter}\`.value AS DECIMAL(10,2)) BETWEEN '${value[0]}' AND '${value[1]}')`
        } else {
          query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${filter}' AND \`S${filter}\`.value = '${value}')`
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
        query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${filter}' AND \`S${filter}\`.value = '${value}')`
        break
      case 'Nombre de capteurs (camera)':
      case 'Nombre de capteurs (selfie)':
        query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${value}' AND \`S${filter}\`.value = '${filter}')`
        break
      default:
        break
    }
  }

  // Now add the RAM and Stockage filters
  for (const filter in ramAndStorageFilters) {
    if (ramAndStorageFilters[filter].length > 0) {
      let vals = ramAndStorageFilters[filter].map((v) => `'${v}'`).join(',')
      query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${filter}' AND \`S${filter}\`.value IN (${vals}))`
    }
  }

  query += `
    ORDER BY D.announced_date DESC, D.id DESC
    LIMIT ${limit} OFFSET ${offset};
  `

  const devices = await db.query(query)
  return devices
}
