/* eslint-disable react/prop-types */
import React from 'react';
import useSound from '../hooks/useSound';

const ArqueroActionModal = ({ isOpen, onClose, onAction }) => {
  const playSound = useSound();
  if (!isOpen) return null;

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
          <h3 className="medieval-title">Orden al Arquero</h3>
        </div>
        
        <div className="medieval-body">
          <p className="medieval-text">¿Qué disposición debe tomar vuestro tirador?</p>
          <div className="action-grid">
            <div 
              className="character-card action-card" 
              onClick={() => {
                playSound('click.mp3');
                onAction('move');
              }}
              onMouseEnter={() => playSound('hover.mp3')}
            >
              <div className="character-info">
                <span className="character-name">DESPLAZARSE</span>
                <p className="medieval-text-small">Moverse a una casilla cercana</p>
              </div>
            </div>
            <div 
              className="character-card action-card" 
              onClick={() => {
                playSound('click.mp3');
                onAction('attack');
              }}
              onMouseEnter={() => playSound('hover.mp3')}
            >
              <div className="character-info">
                <span className="character-name">DISPARAR</span>
                <p className="medieval-text-small">Atacar a distancia (3 casillas)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="medieval-footer">
          <p>Una flecha certera puede cambiar el destino.</p>
        </div>
      </div>
    </div>
  );
};

export default ArqueroActionModal;
