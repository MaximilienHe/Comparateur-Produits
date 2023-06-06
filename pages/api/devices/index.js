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
    SELECT DISTINCT D.id, D.brand_name, D.title, D.img, D.description, D.description_french, D.announced_date  
    FROM devices AS D
    INNER JOIN specs ON D.title = specs.device_title
    WHERE 1 = 1
  `

  for (const filter in filters) {
    let value = filters[filter]
    let range = false
    if (typeof value === 'string' && value.includes('||')) {
      value = value.split('||')
      range = true
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
      case 'RAM':
      case 'Ratio Ecran':
      case 'SoC':
      case 'Stockage':
      case 'Technologie Ecran':
      case 'Type':
        query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${filter}' AND \`S${filter}\`.value = '${value}')`
        break
      case 'Nombre de capteurs (camera)':
      case 'Nombre de capteurs (selfie)':
        query += ` AND EXISTS (SELECT 1 FROM specs AS \`S${filter}\` WHERE \`S${filter}\`.device_title = D.title AND \`S${filter}\`.name = '${value}' AND \`S${filter}\`.category_name = '${filter}')`
        break
      default:
        break
    }
  }

  query += `
    ORDER BY D.announced_date DESC, D.id DESC
    LIMIT ${limit} OFFSET ${offset};
  `
  const devices = await db.query(query)
  return devices
}
