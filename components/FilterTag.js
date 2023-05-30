// components/FilterTag.js
import React from 'react'
import styles from './FilterTag.module.css'

const FilterTag = ({ name, value, onRemove }) => {
  return (
    <div className={styles.filterTag}>
      <span className={styles.filterName}>{name} :</span>
      <span className={styles.filterValue}>{value}</span>
      <button className={styles.removeFilterButton} onClick={onRemove}>
        &times;
      </button>
    </div>
  )
}

export default FilterTag
