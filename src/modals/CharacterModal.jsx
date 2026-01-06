/* eslint-disable react/prop-types */
import React from 'react';

const CharacterModal = ({ isOpen, onClose, iconMap, handleInvokeCharacter }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg">
      <div className="modal-body p-4 material-modal">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>Seleccionar Personaje</h3>
        <div className="material-buttons">
          {['arquero', 'obrero', 'mago'].map(character => (
            <button key={character} onClick={() => handleInvokeCharacter(character)}>
              {React.createElement(iconMap[character], { size: 30 })}
              {character}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;