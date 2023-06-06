import React, { useState } from 'react'
import FiltreOption from './FiltreOption'

const FiltreItem = ({ name, options }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleIsOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className="filtre-item">
      <div className="filtre-header" onClick={toggleIsOpen}>
        <img src={isOpen ? 'arrow-up.svg' : 'arrow-down.svg'} alt="Arrow" />
        <span>{name}</span>
      </div>
      {isOpen && (
        <div className="filtre-options">
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchTermChange}
              placeholder="Rechercher ..."
            />
            <img src="loupe.svg" alt="Loupe" />
          </div>
          {options.map((option) => (
            <FiltreOption
              key={option.name}
              name={option.name}
              count={option.count}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FiltreItem
