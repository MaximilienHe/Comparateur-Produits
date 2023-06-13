import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import styles from '../../../styles/ProductPage.module.css'
import Article from '../../../components/Article'

const ProductPage = () => {
  const router = useRouter()
  const { device_title } = router.query

  const [productData, setProductData] = useState(null)
  const [specData, setSpecData] = useState(null)
  const [articles, setArticles] = useState([])

  useEffect(() => {
    if (device_title) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices/details/${device_title}`,
        {
          headers: {
            'x-api-key': process.env.API_KEY_SECRET,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => setProductData(data[0]))

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices/specs/${device_title}`,
        {
          headers: {
            'x-api-key': process.env.API_KEY_SECRET,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => setSpecData(data))

      fetch(
        `https://droidsoft.fr/wp-json/wp/v2/search?search=${encodeURIComponent(
          device_title,
        )}`,
      )
        .then((response) => response.json())
        .then((data) => setArticles(data.slice(0, 5)))
    }
  }, [device_title])

  if (!productData || !specData) {
    return <div>Chargement des données ...</div>
  }

  const translate = (text) => {
    // Ajoutez vos traductions ici
    const translations = {
      Network: 'Réseau',
      Battery: 'Batterie',
      Display: 'Écran',
      Camera: 'Appareil photo',
      Launch: 'Lancement',
      Body: 'Design',
      Platform: 'Plateforme',
      Memory: 'Mémoire',
      'Main Camera': 'Appareil photo principal',
      'Selfie camera': 'Appareil photo frontal',
      Sound: 'Son',
      Comms: 'Communications',
      Features: 'Fonctionnalités',
      Misc: 'Divers',
      Technology: 'Technologie',
      '2G bands': 'Bandes 2G',
      '3G bands': 'Bandes 3G',
      '4G bands': 'Bandes 4G',
      '5G bands': 'Bandes 5G',
      Speed: 'Vitesse',
      Announced: 'Annoncé',
      Status: 'Statut',
      Dimensions: 'Dimensions',
      Weight: 'Poids',
      Build: 'Construction',
      SIM: 'SIM',
      Type: 'Type',
      Size: 'Taille',
      Resolution: 'Résolution',
      Protection: 'Protection',
      Ratio: 'Ratio',
      OS: "Système d'exploitation",
      Chipset: 'Chipset',
      CPU: 'Processeur',
      GPU: 'Processeur graphique',
      'Card slot': 'Emplacement carte mémoire',
      Internal: 'Mémoire interne',
      Single: 'Simple',
      Dual: 'Double',
      Triple: 'Triple',
      Quad: 'Quadruple',
      Five: 'Quintuple',
      Features: 'Fonctionnalités',
      Video: 'Vidéo',
      Loudspeaker: 'Haut-parleur',
      '3.5mm jack': 'Prise jack 3.5mm',
      WLAN: 'Wi-Fi',
      Bluetooth: 'Bluetooth',
      GPS: 'GPS',
      Positionning: 'Positionnement',
      NFC: 'NFC',
      Radio: 'Radio',
      USB: 'USB',
      Sensors: 'Capteurs',
      Charging: 'Charge',
      Models: 'Modèles',
      Price: 'Prix',
      Colors: 'Couleurs',
      SAR: 'DAS',
      'SAR EU': 'DAS UE',
    }
    return translations[text] || text
  }

  return (
    <div className={styles.container}>
      <div className={styles.ArticlesContainer}>
        <h2 className={styles.articlesTitle}>Articles</h2>
        <ul className={styles.articlesList}>
          {articles.map((article) => (
            <Article key={article.id} article={article} />
          ))}
        </ul>
      </div>
      <div className={styles.techSpecsContainer}>
        <h1 className={styles.title}>{productData.title}</h1>
        <img
          src={productData.img}
          alt={productData.title}
          className={styles.image}
        />
        <p className={styles.description}>{productData.description}</p>
        {Object.entries(specData).map(([category, specs]) => (
          <div key={category} className={styles.specsSection}>
            <h2 className={styles.specsTitle}>{translate(category)}</h2>
            <ul className={styles.specsList}>
              {specs.map(({ name, value }) => (
                <li key={name} className={styles.specsItem}>
                  <span>{translate(name)}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductPage
