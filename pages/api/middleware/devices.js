// pages/api/devices.js
export default async function(req, res) {
    const query = new URLSearchParams(req.query)
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices?${query.toString()}`,
      {
        headers: {
          'x-api-key': process.env.API_KEY_SECRET,
        },
      }
    )
  
    const data = await response.json()
    res.status(200).json(data)
  }
  