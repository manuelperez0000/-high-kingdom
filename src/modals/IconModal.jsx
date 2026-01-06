/* eslint-disable react/prop-types */
import React from 'react';

const IconModal = ({ isOpen, onClose, crafteos, iconMap }) => {
    if (!isOpen) return null;

    /* useEffect(() => {
        console.log("crafteos");
        return () => {};
    }, []) */

    return (
        <div className="modal-bg">
            <div className="modal-body">
                <span className="close" onClick={onClose}>&times;</span>
                <h3>Iconos de Objetos y Materiales</h3>
                <div className="icons-grid">
                    {Object.keys(crafteos.recetas_base).map(key => (
                        <div key={key} className="icon-item">
                            {React.createElement(iconMap[key], { size: 40 })}
                            <p>{key}</p>
                        </div>
                    ))}
                    {Object.keys(crafteos.objetos).map(key => (
                        <div key={key} className="icon-item">
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