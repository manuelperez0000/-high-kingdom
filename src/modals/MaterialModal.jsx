/* eslint-disable react/prop-types */
import React from 'react';
import useSound from '../hooks/useSound';

const MaterialModal = ({ isOpen, onClose, playerInventory, iconMap, colorMap, handleSelectMaterial }) => {
  const playSound = useSound();
  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal-body p-4 material-modal">
        <span 
          className="close" 
          onClick={() => {
            playSound('click.mp3');
            onClose();
          }}
          onMouseEnter={() => playSound('hover.mp3')}
        >&times;</span>
        <h3>Seleccionar Materia Prima</h3>
        <div className="material-buttons">
          {['madera', 'hierro', 'piedra', 'algodon'].map(material => (
            <button 
              key={material} 
              onClick={() => {
                playSound('click.mp3');
                handleSelectMaterial(material);
              }} 
              onMouseEnter={() => playSound('hover.mp3')}
              disabled={playerInventory[material] <= 0}
            >
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