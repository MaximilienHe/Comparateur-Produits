import db from '../../../utils/database'
import { validateApiKeyAndPermissions } from '../../../utils/auth'

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
      const filters = await getFilters()
      res.status(200).json(filters)
      break
    default:
      res.status(400).json({
        message: 'Invalid method',
      })
      break
  }
}

async function getFilters() {
  const filters = await db.query(`
      SELECT category_name AS filter_name, name AS value, COUNT(*) AS count
      FROM specs
      WHERE name IN (
        "4G", "5G", "Carte SD", "DAS", "Definition Ecran", "Taille Batterie (en mAh)", "Nombre de capteurs (camera)", "Marque", "Prix (en Euros)", "Matériau Arrière", "Puissance de charge (en W)", "Rafraichissement Ecran (en Hz)", "RAM", "Ratio Ecran", "Nombre de capteurs (selfie)", "SoC", "Stockage", "Taille Ecran (en pouces)", "Technologie Ecran", "Type", "Poids (en g)"
      ) AND category_name = "AddedData"
      GROUP BY category_name, name
    `)
  const filtersObj = {}
  filters.forEach(({ filter_name, value, count }) => {
    if (!filtersObj[filter_name]) {
      filtersObj[filter_name] = {
        name: filter_name,
        values: [],
      }
    }
    filtersObj[filter_name].values.push({
      name: value,
      count,
    })
  })
  return Object.values(filtersObj)
}
