/* eslint-disable react/prop-types */
import React from 'react';

const MagoActionModal = ({ isOpen, onClose, onAction }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-bg medieval-modal-bg">
      <div className="medieval-modal">
        <div className="medieval-header">
          <span className="medieval-close" onClick={onClose}>&times;</span>
          <h3 className="medieval-title">Orden al Mago</h3>
        </div>
        
        <div className="medieval-body">
          <p className="medieval-text">¿Qué conjuro o movimiento debe realizar vuestro místico?</p>
          <div className="action-grid">
            <div className="character-card action-card" onClick={() => onAction('move')}>
              <div className="character-info">
                <span className="character-name">DESPLAZARSE</span>
                <p className="medieval-text-small">Moverse a una casilla cercana</p>
              </div>
            </div>
            <div className="character-card action-card" onClick={() => onAction('attack')}>
              <div className="character-info">
                <span className="character-name">LANZAR HECHIZO</span>
                <p className="medieval-text-small">Atacar en línea recta (4 casillas, ignora muros)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="medieval-footer">
          <p>La magia fluye a través de la voluntad.</p>
        </div>
      </div>
    </div>
  );
};

export default MagoActionModal;