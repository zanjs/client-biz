import React from 'react';

export const BoxHeader = ({title, selections, onSelect, selectionCount}) => (
  <div className="header">
    <p className="title">{title}</p>
    <select onChange={onSelect} className="styled-select slate">
      {
        selections.map(((selection, index) => <option
          value={index}
          key={index}>
          {selection}&nbsp;&nbsp;{selectionCount(index) || 0}
        </option>))
      }
    </select>
  </div>
);