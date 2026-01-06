
import React, { useState } from 'react';
import crafteos from '../assets/crafteos.json';
import { GiWoodStick, GiStoneBlock, GiMetalBar, GiCottonFlower, GiArrowDunk, GiAxeInStump, GiCrossbow, GiHammerBreak, GiPickOfDestiny, GiSewingNeedle, GiSpellBook, GiRam, GiStoneWall } from 'react-icons/gi';

const colorMap = {
  madera: 'brown',
  hierro: 'gray',
  piedra: 'lightgray',
  algodon: 'white',
  hilo: 'white',
  palo: 'brown',
  runa: 'blue', // Asumiendo azul como grimorio
};

const Game = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [boardState, setBoardState] = useState(Array(12 * 18).fill(null));

  const playerInventory = {
    madera: 10,
    hierro: 5,
    piedra: 8,
    algodon: 3,
    hilo: 2,
    palo: 4,
    runa: 1,
  };

  const iconMap = {
    algodon: GiCottonFlower,
    madera: GiWoodStick,
    piedra: GiStoneBlock,
    hierro: GiMetalBar,
    hilo: GiSewingNeedle,
    palo: GiWoodStick,
    runa: GiSpellBook,
    flecha_de_madera: GiArrowDunk,
    flecha_de_piedra: GiArrowDunk,
    flecha_de_hierro: GiArrowDunk,
    hacha_de_madera: GiAxeInStump,
    hacha_de_piedra: GiAxeInStump,
    hacha_de_hierro: GiAxeInStump,
    arco_de_madera: GiCrossbow,
    arco_de_hierro: GiCrossbow,
    martillo_de_madera: GiHammerBreak,
    martillo_de_piedra: GiHammerBreak,
    martillo_de_hierro: GiHammerBreak,
    pico_de_madera: GiPickOfDestiny,
    pico_de_piedra: GiPickOfDestiny,
    pico_de_hierro: GiPickOfDestiny,
    asada_de_madera: GiSewingNeedle,
    asada_de_piedra: GiSewingNeedle,
    asada_de_hierro: GiSewingNeedle,
    grimorio: GiSpellBook,
    ariete_de_madera: GiRam,
    ariete_de_piedra: GiRam,
    ariete_de_hierro: GiRam,
    muro_de_piedra: GiStoneWall,
  };

  const handleCellClick = (i) => {
    setSelectedCell(i);
    setShowMaterialModal(true);
  };

  const handleSelectMaterial = (material) => {
    if (playerInventory[material] > 0) {
      setBoardState(prev => prev.map((val, idx) => idx === selectedCell ? material : val));
      // Opcional: decrementar inventario, pero como es visual, quizás no.
    }
    setShowMaterialModal(false);
  };

  const exportTerrain = () => {
    const data = { boardState };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'terrain-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="game">
      <div className="game-left">
        <h2>Opciones de Juego</h2>
        <ul>
          <li>Acción 1</li>
          <li>Acción 2</li>
          <li>Menú</li>
        </ul>
        <button onClick={() => setShowModal(true)}>Ver Iconos</button>
        <button onClick={exportTerrain}>Exportar Terreno</button>
      </div>
      <div className="game-right">
        <div className="inventory-compact">
          {Object.keys(playerInventory).map(item => (
            <div key={item} className="inventory-compact-item">
              {React.createElement(iconMap[item], { size: 30, color: colorMap[item] || 'white' })}
              <span>{playerInventory[item]}</span>
            </div>
          ))}
        </div>
        <div className="board">
          {/* Placeholder para el tablero 12x18 */}
          <div className="board-grid">
            {Array.from({ length: 12 * 18 }, (_, i) => {
              const row = Math.floor(i / 18);
              const col = i % 18;
              const isColor1 = (row + col) % 2 === 0;
              const material = boardState[i];
              return (
                <div key={i} className={`cell ${isColor1 ? 'color1' : 'color2'}`} onClick={() => handleCellClick(i)}>
                   {material && React.createElement(iconMap[material], { size: 20, color: colorMap[material] || 'white', style: { pointerEvents: 'none' } })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
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
      )}
      {showMaterialModal && (
        <div className="modal">
          <div className="modal-content material-modal">
            <span className="close" onClick={() => setShowMaterialModal(false)}>&times;</span>
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
      )}
    </div>
  );
};

export default Game;