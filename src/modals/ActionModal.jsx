/* eslint-disable react/prop-types */
import React from 'react';
import useSound from '../hooks/useSound';

const ActionModal = ({ isOpen, onClose, onAction, obreroIndex }) => {
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
          <h3 className="medieval-title">Acción de Obrero</h3>
        </div>
        
        <div className="medieval-body">
          <p className="medieval-text">¿Qué labor debe realizar vuestro siervo en esta jornada?</p>
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
                <span className="character-name">MOVER</span>
              </div>
            </div>
            <div 
              className="character-card action-card" 
              onClick={() => {
                playSound('click.mp3');
                onAction('craft');
              }}
              onMouseEnter={() => playSound('hover.mp3')}
            >
              <div className="character-info">
                <span className="character-name">CRAFTEAR</span>
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
                <span className="character-name">ATACAR</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="medieval-footer">
          <p>El tiempo es oro en el campo de batalla.</p>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
