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
    case 'POST':
      return await createSpec(req, res)
    default:
      return res.status(400).json({ message: 'Invalid method' })
  }
}

async function createSpec(req, res) {
  const { device_title, category_name, name, value } = req.body

  if (!device_title || !category_name || !name || !value) {
    return res.status(400).json({ error: 'Tous les champs sont requis' })
  }

  try {
    const sql = `INSERT INTO specs (device_title, category_name, name, value) VALUES (?, ?, ?, ?)`
    await db.query(sql, [device_title, category_name, name, value])
    res.status(201).json({ message: 'Spec créé avec succès' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur Interne' })
  }
}
