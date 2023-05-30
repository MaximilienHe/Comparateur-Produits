import db from '../../../../utils/database'
import { validateApiKeyAndPermissions } from '../../../../utils/auth'

export default async function handler(req, res) {
  const validation = await validateApiKeyAndPermissions(
    req.headers['x-api-key'],
    req.method,
  )
  if (!validation.isValid) {
    return res.status(403).json({ message: validation.message })
  }

  if (req.method !== 'GET') {
    res.status(400).json({ message: 'Invalid method' })
    return
  }

  const searchTerm = req.query.s

  if (!searchTerm) {
    res.status(400).json({ message: 'Missing search term' })
    return
  }

  try {
    const devices = await db.query(
      `
      SELECT devices.id, devices.title, devices.brand_name, devices.img, devices.description, devices.announced_date
      FROM devices
      WHERE devices.title LIKE '${searchTerm}%'
    `,
    )

    res.status(200).json(devices)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
