const fetchDevices = async (filtersValues, newPage) => {
  const query = new URLSearchParams({
    ...filtersValues,
    page: newPage,
  })
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices?${query.toString()}`,
    {
      headers: {
        'x-api-key': process.env.API_KEY_SECRET,
      },
    },
  )
  const data = await res.json()
  return data
}

const fetchSpecs = async (filtersValues) => {
  const query = new URLSearchParams(filtersValues)
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/filters/specs?${query.toString()}`,
    {
      headers: {
        'x-api-key': process.env.API_KEY_SECRET,
      },
    },
  )
  const data = await res.json()
  return data
}

export default {
  fetchDevices,
  fetchSpecs,
}
