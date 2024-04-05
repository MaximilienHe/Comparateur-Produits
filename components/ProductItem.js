import React from 'react';
import moment from 'moment';
import Link from 'next/link';

import styles from './ProductItem.module.css';

const ProductItem = ({ product }) => {
  const slug = product.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/\+/g, '-plus')
    .toLowerCase();

  // Supposons que le nom de fichier de l'image est le même que celui utilisé par le script de téléchargement
  // et stocké dans /public/Images.
  // Vous pourriez avoir besoin d'ajuster le chemin ou le nom du fichier selon vos besoins.
  const localImagePath = `https://droidsoft.fr/images_smartphones/${encodeURIComponent(product.img.split('/').pop())}`;

  return (
    <div className={styles.container}>
      <img className={styles.image} src={localImagePath} alt={product.title} />
      <div className={styles.details}>
        <h2 className={styles.name}>{product.title}</h2>
        <p className={styles.date}>
          {moment(product.announced_date).format('DD/MM/YYYY')}
        </p>
      </div>
      {product.technical_sheet_written === 1 && (
        <a href={`https://droidsoft.fr/fiche-technique-${slug}`} target="_blank" rel="noopener noreferrer" className={styles.button}>En savoir plus
        </a>
      )}
    </div>
  );
};

export default ProductItem;
