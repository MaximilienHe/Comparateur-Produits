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

  return (
    <div className={styles.filter}>
      <div className={styles.filterHeader} onClick={handleOpen}>
        <span className={styles.filterName}>{filter.name}</span>
        <Image
          src="/minimalist_white_arrow.png"
          width={14}
          height={8}
          alt="arrow"
          className={open ? styles.arrowDown : styles.arrowRight}
        />
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
              {sortedOptions().map((value, index) => (
                <div
                  key={index}
                  className={`${styles.filterOption} ${
                    value.value.toLowerCase().includes(searchTerm.toLowerCase())
                      ? ''
                      : styles.filterOptionHide
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(
                      selectedValue && value.value === selectedValue,
                    )}
                    onChange={() => handleOptionChange(value.value)}
                  />
                  <span className={styles.filterOptionName}>{value.value}</span>
                  <span className={styles.filterOptionCount}>
                    {value.count}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {loading && <Spinner />}
    </div>
  )
}
