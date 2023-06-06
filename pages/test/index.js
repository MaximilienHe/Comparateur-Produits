import React, { useEffect, useState } from 'react'
import FiltersContainer from '../../components2/FiltersContainer'
import ProductsContainer from '../../components2/ProductsContainer'

const App = () => {
  const [filters, setFilters] = useState([])
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetch('/api/filters')
      .then((response) => response.json())
      .then((data) => setFilters(data))
  }, [])

  useEffect(() => {
    fetch('/api/devices')
      .then((response) => response.json())
      .then((data) => setProducts(data))
  }, [])

  return (
    <div className="app">
      <FiltersContainer filters={filters} />
      <ProductsContainer products={products} />
    </div>
  )
}

export default App
