import db from '../../../../../utils/database'
import { validateApiKeyAndPermissions } from '../../../../../utils/auth'

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

  // extraire le paramètre de la requête HTTP
  const deviceName = decodeURIComponent(req.query.device_title)
  // exécuter la requête SQL pour récupérer les caractéristiques d'un produit
  try {
    const results = await getDeviceSpecs(deviceName)
    if (results.length === 0) {
      return res.status(404).json({
        error: 'Not Found',
      })
    }
    res.status(200).json(results)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

async function getDeviceSpecs(deviceName) {
  const sql = `
    SELECT * 
    FROM devices s1
    WHERE s1.title = ?
  `
  const results = await db.query(sql, [deviceName])
  return results
}
