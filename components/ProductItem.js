import React from 'react'
import moment from 'moment'
import Link from 'next/link'

import styles from './ProductItem.module.css'

const ProductItem = ({ product }) => {

  // convert product title to slug for url, remove accents and place a dash between words
  const slug = product.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()

  return (
    (
      <div className={styles.container}>
        <img className={styles.image} src={product.img} alt={product.title} />
        <div className={styles.details}>
          <h2 className={styles.name}>{product.title}</h2>
          <p className={styles.date}>
            {moment(product.announced_date).format('DD/MM/YYYY')}
          </p>
        </div>
        {/* if technical_sheet_written = 1, then show link. The link has to open in an other tab*/}
        {product.technical_sheet_written === 1 && (
          // Link to the product page on DroidSoft.fr open in a new tab
          <a href={`https://droidsoft.fr/fiche-technique-${slug}`} target="_blank" rel="noopener noreferrer"className={styles.button}>En savoir plus
          </a>
        )}
      </div>
    )
  )
}

export default ProductItem
