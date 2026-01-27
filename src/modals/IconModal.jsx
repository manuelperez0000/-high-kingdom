/* eslint-disable react/prop-types */
import React from 'react';
import useSound from '../hooks/useSound';

const IconModal = ({ isOpen, onClose, crafteos, iconMap }) => {
    const playSound = useSound();
    if (!isOpen) return null;

    return (
        <div className="modal-bg">
            <div className="modal-body">
                <span 
                    className="close" 
                    onClick={() => {
                        playSound('click.mp3');
                        onClose();
                    }}
                    onMouseEnter={() => playSound('hover.mp3')}
                >&times;</span>
                <h3>Iconos de Objetos y Materiales</h3>
                <div className="icons-grid">
                    {Object.keys(crafteos.recetas_base).map(key => (
                        <div 
                            key={key} 
                            className="icon-item"
                            onMouseEnter={() => playSound('hover.mp3')}
                        >
                            {React.createElement(iconMap[key], { size: 40 })}
                            <p>{key}</p>
                        </div>
                    ))}
                    {Object.keys(crafteos.objetos).map(key => (
                        <div 
                            key={key} 
                            className="icon-item"
                            onMouseEnter={() => playSound('hover.mp3')}
                        >
                            {React.createElement(iconMap[key], { size: 40 })}
                            <p>{key}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IconModal;