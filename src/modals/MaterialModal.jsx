/* eslint-disable react/prop-types */
import React from 'react';

const MaterialModal = ({ isOpen, onClose, playerInventory, iconMap, colorMap, handleSelectMaterial }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal-body p-4 material-modal">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Seleccionar Materia Prima</h3>
        <div className="material-buttons">
          {['madera', 'hierro', 'piedra', 'algodon'].map(material => (
            <button key={material} onClick={() => handleSelectMaterial(material)} disabled={playerInventory[material] <= 0}>
              {React.createElement(iconMap[material], { size: 30, color: colorMap[material] || 'white' })}
              {material} ({playerInventory[material]})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;