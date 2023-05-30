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

  // Extraire le paramètre de la requête HTTP
  const deviceId = req.query.device_id

  // Exécuter la requête SQL pour récupérer l'historique des prix d'un produit
  try {
    const results = await db.query(
      `
      SELECT *
      FROM prices
      WHERE device_id = ?
      ORDER BY date_recorded DESC
      `,
      [deviceId],
    )

    if (results.length === 0) {
      return res.status(404).json({ error: 'Not Found' })
    }

    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
