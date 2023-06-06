import { useState } from 'react'
import CustomConsole from '../../components/CustomConsole'
import {
  insertBrandsIntoDatabase,
  fetchBrandsFromAPI,
} from '../../utils/dataFetcher'

const DataFetcher = () => {
  const [logs, setLogs] = useState([])

  const log = (...args) => {
    setLogs((prevLogs) => [...prevLogs, ...args])
  }

  const handleClick = async () => {
    const data = await fetchBrandsFromAPI(log)
    await insertBrandsIntoDatabase(data, null, log)
  }

  return (
    <div>
      <h1>Data Fetcher</h1>
      <button onClick={handleClick}>Fetch Data</button>
      <CustomConsole logs={logs} />
    </div>
  )
}

export default DataFetcher
