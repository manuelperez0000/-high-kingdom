/* eslint-disable react/prop-types */
import React from 'react';
import spriteController from '../sprites/spriteController';
import gameConfig from '../store/config.json';
import useSound from '../hooks/useSound';

const CraftModal = ({ isOpen, onClose, onCraft }) => {
  const playSound = useSound();
  if (!isOpen) return null;

  const crafts = Object.entries(gameConfig.crafting).map(([id, data]) => ({
    id,
    ...data
  }));

  return (
    <div className="modal-bg medieval-modal-bg">
      <div className="medieval-modal">
        <div className="medieval-header">
          <span 
            className="medieval-close" 
            onClick={() => {
              playSound('click.mp3');
              onClose();
            }}
            onMouseEnter={() => playSound('hover.mp3')}
          >&times;</span>
          <h3 className="medieval-title">Artesanía</h3>
        </div>
        
        <div className="medieval-body">
          <div className="character-grid">
            {crafts.map(craft => (
              <div 
                key={craft.id} 
                className="character-card" 
                onClick={() => {
                  playSound('click.mp3');
                  onCraft(craft);
                }}
                onMouseEnter={() => playSound('hover.mp3')}
              >
                <div className="character-image-container">
                  <img src={spriteController[craft.sprite]} alt={craft.name} className="character-portrait" />
                </div>
                <div className="character-info">
                  <span className="character-name">{craft.name}</span>
                  <div className="craft-cost">
                    {Object.entries(craft.cost).map(([res, amount]) => (
                      <span key={res} className="cost-item">{amount} {res}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="medieval-footer">
          <p>Construid defensas inexpugnables.</p>
        </div>
      </div>
    </div>
  );
};

export default CraftModal;
