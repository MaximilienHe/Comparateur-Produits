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

  switch (method) {
    case 'GET':
      return await getBrands(req, res)
    default:
      return res.status(400).json({ message: 'Invalid method' })
  }
}

async function getBrands(req, res) {
  try {
    const sql = `SELECT id, name FROM brands ORDER BY name`
    const results = await db.query(sql)

    if (results.length === 0) {
      return res.status(404).json({ error: 'Not Found' })
    }
    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur Interne' })
  }
}

async function createBrand(req, res) {
  // TODO: Ajoutez le code pour créer une nouvelle marque ici
}
