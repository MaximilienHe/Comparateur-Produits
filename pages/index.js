import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Filter from '../components/Filter'
import ProductItem from '../components/ProductItem'
import styles from '../styles/Home.module.css'
import Spinner from '../components/Spinner'
import FilterTag from '../components/FilterTag'
import NoResult from '../components/NoResult'

export default function Home({ specs, devices, query, sliderFilterExtremes }) {
  const [filters, setFilters] = useState([])
  const [productList, setProductList] = useState(devices)
  const [loadingDevices, setLoadingDevices] = useState(false)
  const [loadingSpecs, setLoadingSpecs] = useState(false)
  const [page, setPage] = useState(1)
  const [filtersValues, setFiltersValues] = useState(query)
  const [scrollY, setScrollY] = useState(0)
  const [hasMoreResults, setHasMoreResults] = useState(true)
  const [loadingMoreDevices, setLoadingMoreDevices] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterButtonClick = () => {
    setShowFilters(!showFilters)
  }

  const handleFilterChange = (
    filterName,
    filterValue,
    isRemoving,
    callback,
  ) => {
    let searchParams = new URL(window.location.href).searchParams

    if (filterName === 'Fonctionnalités') {
      if (isRemoving) {
        searchParams.delete(filterValue) // ici, on supprime le paramètre en utilisant sa valeur
      } else {
        searchParams.set(filterValue, 'Oui') // on ajoute le paramètre avec la valeur "Oui"
      }
    } else {
      if (isRemoving || filterValue !== '') {
        if (filterName === 'RAM' || filterName === 'Stockage') {
          // Pour les filtres RAM et Stockage, nous gérons les options multiples
          if (isRemoving) {
            let values = searchParams.getAll(filterName)
            let index = values.indexOf(filterValue)
            if (index !== -1) {
              values.splice(index, 1)
              searchParams.delete(filterName)
              values.forEach((v) => searchParams.append(filterName, v))
            }
          } else {
            // Before adding the new value, we check if it's not already in the list
            let existingValues = searchParams.getAll(filterName)
            if (!existingValues.includes(filterValue)) {
              searchParams.append(filterName, filterValue)
            }
          }
        } else {
          if (isRemoving) {
            searchParams.delete(filterName)
          } else {
            searchParams.set(filterName, filterValue)
          }
        }
      }
    }

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`
    window.history.replaceState({}, '', newUrl)

    // Update newFiltersValues with the updated searchParams
    const newFiltersValues = {}
    for (const key of searchParams.keys()) {
      newFiltersValues[key] = searchParams.getAll(key)
    }

    setFiltersValues(newFiltersValues)
    setPage(1)

    // Start fetchSpecs and fetchDevices here
    setLoadingSpecs(true)
    fetchSpecs(newFiltersValues).then((data) => {
      setFilters(Object.entries(data))
      setLoadingSpecs(false)
    })

    setLoadingDevices(true)
    fetchDevices(newFiltersValues, 1).then((data) => {
      setProductList(data)
      setLoadingDevices(false)
      if (callback) {
        callback()
      }
    })
  }

  useEffect(() => {
    if (specs) {
      setFilters(Object.entries(specs))
    }
  }, [specs])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (
      !loadingDevices &&
      productList.length >= 10 &&
      scrollY + window.innerHeight >=
        document.documentElement.scrollHeight -
          document.documentElement.scrollHeight * 0.15 &&
      hasMoreResults
    ) {
      setLoadingMoreDevices(true)
      setLoadingDevices(true)
      setPage(page + 1)
    }
  }, [scrollY])

  useEffect(() => {
    if (page > 1) {
      fetchDevices(filtersValues, page).then((data) => {
        setLoadingDevices(false)
        setLoadingMoreDevices(false)
        if (data.length > 0) {
          const newProducts = data.filter(
            (product) => !productList.some((p) => p.id === product.id),
          )
          setProductList((prevList) => [...prevList, ...newProducts])
        } else {
          setHasMoreResults(false)
        }
      })
    }
  }, [page])

  useEffect(() => {
    if (!loadingDevices && !loadingMoreDevices && productList.length === 0) {
      handleFilterButtonClick()
    }
  }, [productList.length, loadingDevices, loadingMoreDevices])

  const determineSelectedValue = (values, filtersValues) => {
    const searchParams = new URLSearchParams(window.location.search)

    for (let item of values.values) {
      if (
        ['4G', '5G', 'Carte SD'].includes(item.value) &&
        searchParams.has(item.value)
      ) {
        return item.value
      }
    }
    return filtersValues[values.name]
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <button
          onClick={handleFilterButtonClick}
          className={styles.filterButton}
        >
          Afficher les filtres
        </button>
        <div className={showFilters ? styles.show : styles.hide}>
          <div className={styles.left}>
            <div className={styles.filterContainer}>
              {loadingSpecs && filters.length === 0 ? (
                <div className={styles.loadingSpecs}>
                  <Spinner />
                </div>
              ) : (
                filters.map(([name, values]) => (
                  <Filter
                    key={name}
                    filter={{ name, values }}
                    onFilterChange={handleFilterChange}
                    sliderFilterExtremes={sliderFilterExtremes}
                    selectedValue={determineSelectedValue(
                      values,
                      filtersValues,
                    )}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.FilterTagContainer}>
            {Object.entries(filtersValues).flatMap(([name, value]) =>
              Array.isArray(value) ? (
                value.map((v, index) => (
                  <FilterTag
                    key={name + index}
                    name={name}
                    value={v}
                    onRemove={() => handleFilterChange(name, v, true)}
                  />
                ))
              ) : (
                <FilterTag
                  key={name}
                  name={name}
                  value={value}
                  onRemove={() => handleFilterChange(name, '', true)}
                />
              ),
            )}
          </div>

          {loadingDevices && hasMoreResults && (
            <div className={styles.spinnerContainer}>
              <Spinner />
            </div>
          )}
          {productList && productList.length > 0 ? (
            <div className={styles.productsContainer}>
              {productList.map((device) => (
                <ProductItem key={device.id} product={device} />
              ))}
              {loadingMoreDevices && <Spinner />}
            </div>
          ) : !loadingDevices && !loadingMoreDevices ? (
            <NoResult />
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const specsRes = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/filters/specs?${new URLSearchParams(query)}`,
    {
      headers: {
        'x-api-key': process.env.API_KEY_SECRET,
      },
    },
  )
  const specs = await specsRes.json()

  const devicesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/devices?${new URLSearchParams(
      query,
    )}`,
    {
      headers: {
        'x-api-key': process.env.API_KEY_SECRET,
      },
    },
  )
  const devices = await devicesRes.json()

  const allFiltersRes  = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/filters/specs`, {
    headers: {
      'x-api-key': process.env.API_KEY_SECRET,
    },
  });
  const allFilters = await allFiltersRes.json();

  let sliderFilterExtremes = {};
  const filterNames = [
    "Prix (en Euros)", "DAS", "Taille Ecran (en pouces)",
    "Taille Batterie (en mAh)", "Puissance de charge (en W)", "Poids (en g)"
  ];

  filterNames.forEach(filterName => {
    const filter = allFilters.find(f => f.name === filterName);
    if (filter) {
      const values = filter.values.map(v => parseFloat(v.value));
      const extremMin = Math.min(...values);
      const extremMax = Math.max(...values);
      sliderFilterExtremes[filterName] = { extremMin, extremMax };
    }
  });

  return { props: { specs, devices, query, sliderFilterExtremes } }
}

const fetchDevices = async (filtersValues, newPage) => {
  const query = new URLSearchParams({ ...filtersValues, page: newPage })

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/middleware/devices?${query.toString()}`)

  // Fetch, but with no cors
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/middleware/devices?${query.toString()}`,
    {},
  )

  const data = await res.json()
  return data
}

const fetchSpecs = async (filtersValues) => {
  const query = new URLSearchParams(filtersValues)

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/middleware/specs?${query.toString()}`)

  // Fetch, but with no cors
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_BASE_URL
    }/api/middleware/specs?${query.toString()}`,
    {},
  )

  const data = await res.json()
  return data
}
