import React from 'react'

const ProductItem = ({ image, name, releaseDate }) => {
  return (
    <div className="product-item">
      <img src={image} alt={name} />
      <div className="product-name">{name}</div>
      <div className="product-release-date">{releaseDate}</div>
      <button className="product-details-button">En savoir plus</button>
    </div>
  )
}

export default ProductItem
