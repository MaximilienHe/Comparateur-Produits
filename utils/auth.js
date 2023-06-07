import db from './database'

export async function validateApiKeyAndPermissions(apiKey, method) {
  try {
    const sql = 'SELECT * FROM apikeys WHERE apiKey = ?'
    const result = await db.query(sql, apiKey)

    if (result.length === 0) {
      console.log('Invalid API key')
      return { isValid: false, message: 'Invalid API key' }
    }

    const keyData = result[0]

    if (!keyData.isActive) {
      console.log('API key is not active')
      return { isValid: false, message: 'API key is not active' }
    }

    const methodToPermission = {
      GET: keyData.canGet,
      POST: keyData.canPost,
      PUT: keyData.canPut,
      DELETE: keyData.canDelete,
    }

    const hasPermission = methodToPermission[method]

    if (!hasPermission) {
      console.log(`API key does not have permission to perform ${method} requests`)
      return {
        isValid: false,
        message: `API key does not have permission to perform ${method} requests`,
      }
    }
    console.log('API key is valid')
    return { isValid: true }
  } catch (error) {
    console.error(error)
    return { isValid: false, message: 'Internal error' }
  }
}
