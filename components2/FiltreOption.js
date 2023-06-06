import React from 'react'

const FiltreOption = ({ name, count, checked, onChange }) => {
  return (
    <div className="filter-option">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="filter-option-name">{name}</span>
      <span className="filter-option-count">{count}</span>
    </div>
  )
}

export default FiltreOption
