import React from 'react'
import styles from './NoResult.module.css'

const NoResult = ({}) => {

  return (
    <div className={styles.noResult}>
      <div className={styles.mainContainer}>
        <div className={styles.messageContainer}>
          <h1>Il semblerait qu&apos;il n&apos;y ait aucun résultat</h1>
          <p>Essayez de supprimer des filtres</p>
        </div>
      </div>
    </div>
  )
}

export default NoResult
