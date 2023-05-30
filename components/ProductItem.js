import React from 'react'
import moment from 'moment'
import Link from 'next/link'

import styles from './ProductItem.module.css'

const ProductItem = ({ product }) => {
  return (
    <div className={styles.container}>
      <img className={styles.image} src={product.img} alt={product.title} />
      <div className={styles.details}>
        <h2 className={styles.name}>{product.title}</h2>
        <p className={styles.date}>
          {moment(product.announced_date).format('DD/MM/YYYY')}
        </p>
      </div>
      <Link
        href={`/products/${encodeURIComponent(product.title)}`}
        legacyBehavior
      >
        <a className={styles.button}>En savoir plus</a>
      </Link>
    </div>
  )
}

export default ProductItem
