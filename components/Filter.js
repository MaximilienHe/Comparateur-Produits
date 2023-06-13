import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from './Filter.module.css'
import Spinner from './Spinner'
import Slider from '@mui/material/Slider'

export default function Filter({ filter, onFilterChange, selectedValue }) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  filter = filter.values

  const minRef = useRef()
  const maxRef = useRef()

  const [value, setValue] = useState([null, null])

  useEffect(() => {
    minRef.current = Math.min(...filter.values.map((o) => parseFloat(o.value)))
    maxRef.current = Math.max(...filter.values.map((o) => parseFloat(o.value)))

    setValue([minRef.current, maxRef.current])
  }, [])

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const getSliderStep = () => {
    switch (filter.name) {
      case 'DAS':
      case 'Taille Ecran (en pouces)':
        return 0.1
      default:
        return 1
    }
  }

  const sortedOptions = () => {
    let options = [...filter.values]
    switch (filter.name) {
      case 'Poids (en g)':
      case 'Taille Ecran (en pouces)':
      case 'Rafraichissement Ecran (en Hz)':
      case 'Puissance de charge (en W)':
      case 'Taille Batterie (en mAh)':
      case 'Prix (en Euros)':
      case 'DAS':
        options = options.sort(
          (a, b) => parseFloat(a.value) - parseFloat(b.value),
        )
        break
      case 'RAM':
        options = options.sort((a, b) => {
          const [aSize, aUnit] = a.value.split(' ')
          const [bSize, bUnit] = b.value.split(' ')
          const sizes = { MB: 1, GB: 1024, TB: 1024 * 1024 }
          return (
            parseFloat(bSize) * sizes[bUnit] - parseFloat(aSize) * sizes[aUnit]
          )
        })
        break
      case 'Stockage':
        options = options.sort((a, b) => {
          const [aSize, aUnit] = a.value.split(' ')
          const [bSize, bUnit] = b.value.split(' ')
          const sizes = { MB: 1, GB: 1024, TB: 1024 * 1024 }
          return (
            parseFloat(bSize) * sizes[bUnit] - parseFloat(aSize) * sizes[aUnit]
          )
        })
        break
      default:
        break
    }

    options = options.filter((option) => option.value !== 'ND')

    return options
  }

  const handleOptionChange = (optionValue) => {
    setLoading(true)
    const urlParams = new URLSearchParams(window.location.search)
    let selectedValueInUrl
    let isRemovingFilter

    // Ajoutez cette condition
    if (
      filter.name === 'Fonctionnalités' &&
      ['4G', '5G', 'Carte SD'].includes(optionValue)
    ) {
      selectedValueInUrl = urlParams.get(optionValue)
      isRemovingFilter = selectedValueInUrl === 'Oui'
      if (!isRemovingFilter) {
        urlParams.set(optionValue, 'Oui')
      } else {
        urlParams.delete(optionValue)
      }
    } else {
      selectedValueInUrl = urlParams.get(filter.name)
      isRemovingFilter = selectedValueInUrl === optionValue
      if (!isRemovingFilter) {
        urlParams.set(filter.name, optionValue)
      } else {
        urlParams.delete(filter.name)
      }
    }

    const newUrl = window.location.pathname + '?' + urlParams.toString()

    // Réinitialiser searchTerm après la modification de l'URL
    setSearchTerm('')

    onFilterChange(filter.name, optionValue, isRemovingFilter, () => {
      setLoading(false)
    })
  }

  const getCheckedFeatures = () => {
    if (filter.name !== 'Fonctionnalités') {
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const features = ['4G', '5G', 'Carte SD']

    return features.reduce((result, feature) => {
      result[feature] = urlParams.get(feature) === 'Oui'
      return result
    }, {})
  }

  const rangeSlider = () => {
    const handleChange = (event, newValue) => {
      setValue(newValue)
    }

    const handleChangeCommitted = (event, newValue) => {
      handleOptionChange(`${newValue[0]}||${newValue[1]}`)
    }

    return (
      <Slider
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        min={minRef.current}
        max={maxRef.current}
        step={getSliderStep()}
        valueLabelDisplay="on"
        getAriaLabel={() => `${filter.name} range`}
        sx={{
          color: '#31AD6E',
          height: '5px',
          width: '80%',
          marginLeft: '10%',
          marginRight: '5%',
          marginBottom: '20px',
          marginTop: '20%',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      />
    )
  }

  let filterName = filter.name

  if (!filterName.startsWith('Nombre de capteurs')) {
    filterName = filterName.replace(/\(.*?\)\s?/g, '')
  }

  // Créez un objet avec les correspondances entre les noms de filtres et les URLs
  const filterLinks = {
    SoC: 'https://droidsoft.fr/2023/06/05/comment-comparer-les-performances-de-son-smartphone/#soc-le-coeur-et-lesprit-de-votre-smartphone',
    RAM: 'https://droidsoft.fr/2023/06/05/comment-comparer-les-performances-de-son-smartphone/#ram-memoire-vive-fluidite-et-multitache',
    Stockage:
      'https://droidsoft.fr/2023/06/05/comment-comparer-les-performances-de-son-smartphone/#stockage-un-espace-pour-votre-vie-numerique',
    'Definition Ecran':
      'https://droidsoft.fr/2023/05/24/comment-comparer-lecran-dun-smartphone/#definition-decran-voir-le-monde-en-haute-definition',
    'Taille Ecran (en pouces)':
      'https://droidsoft.fr/2023/05/24/comment-comparer-lecran-dun-smartphone/#taille-decran-plus-grand-estil-toujours-mieux',
    'Rafraichissement Ecran (en Hz)':
      'https://droidsoft.fr/2023/05/24/comment-comparer-lecran-dun-smartphone/#taux-de-rafraichissement-la-fluidite-en-question',
    'Technologie Ecran':
      'https://droidsoft.fr/2023/05/24/comment-comparer-lecran-dun-smartphone/#technologie-decran-oled-amoled-ou-lcd',
    'Ratio Ecran':
      'https://droidsoft.fr/2023/05/24/comment-comparer-lecran-dun-smartphone/#ratio-decran-lequilibre-parfait',
  }

  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader} onClick={handleOpen}>
        <span className={styles.filterName}>{filterName}</span>
        <div className={styles.iconContainer}>
          {filterLinks[filter.name] && (
            <a
              href={filterLinks[filter.name]}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.infoButton}
            >
              i
            </a>
          )}
          <Image
            src="/minimalist_white_arrow.png"
            width={14}
            height={8}
            alt="arrow"
            className={open ? styles.arrowDown : styles.arrowRight}
          />
        </div>
      </div>
      {open && (
        <div className={styles.filterOptions}>
          {[
            'DAS',
            'Taille Ecran (en pouces)',
            'Taille Batterie (en mAh)',
            'Poids (en g)',
            'Prix (en Euros)',
            'Puissance de charge (en W)',
          ].includes(filter.name) ? (
            rangeSlider()
          ) : (
            <>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {sortedOptions().map((value, index) => {
                const checkedFeatures = getCheckedFeatures()
                const shouldCheck =
                  checkedFeatures && checkedFeatures[value.value] !== undefined
                    ? checkedFeatures[value.value]
                    : selectedValue && value.value === selectedValue
                return (
                  <div
                    key={index}
                    className={`${styles.filterOption} ${
                      value.value
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                        ? ''
                        : styles.filterOptionHide
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(shouldCheck)}
                      onChange={() => handleOptionChange(value.value)}
                    />
                    <span className={styles.filterOptionName}>
                      {value.value}
                    </span>
                    <span className={styles.filterOptionCount}>
                      {value.count}
                    </span>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}
      {loading && <Spinner />}
    </div>
  )
}
