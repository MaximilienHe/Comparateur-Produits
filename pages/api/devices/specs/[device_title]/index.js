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

    // Regrouper les résultats par category_name
    const groupedResults = groupByCategory(results)
    res.status(200).json(groupedResults)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal Server Error',
    })
  }
}

async function getDeviceSpecs(deviceName) {
  const sql = `
    SELECT s1.category_name, s1.name, s1.value
    FROM specs s1
    WHERE s1.device_title = ? AND s1.category_name != "AddedData"
  `
  const results = await db.query(sql, [deviceName])
  return results
}

// Fonction pour regrouper les spécifications par category_name
function groupByCategory(specs) {
  const groupedSpecs = {}

  for (const spec of specs) {
    const { category_name, name, value } = spec

    if (!groupedSpecs[category_name]) {
      groupedSpecs[category_name] = []
    }

    groupedSpecs[category_name].push({
      name,
      value,
    })
  }

  return groupedSpecs
}
