import React from 'react'
import styles from './Spinner.module.css'
import Image from 'next/image'

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}>
        <Image
          src="/comparateur/logoDroidSoft.png"
          alt="Loading..."
          width={52}
          height={35}
          className={styles.image}
        />
      </div>
    </div>
  )
}

export default Spinner
