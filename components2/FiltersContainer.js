import React from 'react'
import FiltreItem from './FiltreItem'

const FiltersContainer = ({ filters }) => {
  return (
    <div className="filters-container">
      <div className="filters-search">
        <input type="text" placeholder="Rechercher ..." />
        <img src="search-icon.svg" alt="Icône de recherche" />
      </div>
      <div className="filters-list">
        {filters.map((filter) => (
          <FiltreItem
            key={filter.name}
            name={filter.name}
            options={filter.values}
          />
        ))}
      </div>
    </div>
  )
}

export default FiltersContainer
