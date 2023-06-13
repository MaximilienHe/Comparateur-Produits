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
    case 'PUT':
      return await updateSpec(req, res) // Ajoutez cette ligne
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

async function updateSpec(req, res) {
  const { spec_id, device_title, category_name, name, value } = req.body // Ajoutez spec_id

  if (!spec_id || !device_title || !category_name || !name || !value) {
    return res.status(400).json({ error: 'Tous les champs sont requis' })
  }

  try {
    const sql = `
      UPDATE specs 
      SET device_title = ?, category_name = ?, name = ?, value = ? 
      WHERE id = ?
    `
    await db.query(sql, [device_title, category_name, name, value, spec_id]) // Ajoutez spec_id
    res.status(200).json({ message: 'Spec mis à jour avec succès' }) // Code de statut modifié à 200
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur Interne' })
  }
}
