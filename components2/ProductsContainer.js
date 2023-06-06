import React from 'react'
import ProductItem from './ProductItem'

const ProductsContainer = ({ products }) => {
  return (
    <div className="products-container">
      {products.map((product) => (
        <ProductItem
          key={product.id}
          image={product.img}
          name={product.title}
          releaseDate={product.announced_date}
        />
      ))}
    </div>
  )
}

export default ProductsContainer
