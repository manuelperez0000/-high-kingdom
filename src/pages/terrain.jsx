
import React from 'react';
import { useTerrain } from '../hooks/useTerrain';
import IconModal from '../modals/IconModal';
import MaterialModal from '../modals/MaterialModal';
import CharacterModal from '../modals/CharacterModal';
import ironImg from '../assets/materials/iron.png';
import maderaImg from '../assets/materials/madera.jpg';
import piedraImg from '../assets/materials/piedra.jpg';
import algodonImg from '../assets/materials/algodon.jpg';

const colorMap = {
  madera: 'brown',
  hierro: 'gray',
  piedra: 'lightgray',
  algodon: 'white',
  hilo: 'white',
  palo: 'brown',
  runa: 'blue', // Asumiendo azul como grimorio
};

const tamano = 45;

const imageMap = {
  hierro: ironImg,
  madera: maderaImg,
  piedra: piedraImg,
  algodon: algodonImg,
};

const isAdjacent = (a, b) => {
  const rowA = Math.floor(a / 18), colA = a % 18;
  const rowB = Math.floor(b / 18), colB = b % 18;
  const dr = Math.abs(rowA - rowB);
  const dc = Math.abs(colA - colB);
  return (dr <= 1 && dc <= 1) && !(dr === 0 && dc === 0);
};

const isBlocked = (content) => {
  return ['madera', 'hierro', 'piedra', 'algodon', 'hilo', 'palo', 'runa', 'muro_de_piedra'].includes(content);
};

const Terrain = () => {
  const {
    showModal,
    setShowModal,
    showMaterialModal,
    setShowMaterialModal,
    showCharacterModal,
    setShowCharacterModal,
    showCraftModal,
    /* setShowCraftModal, */
    boardState,
    playerInventory,
    backpack,
    iconMap,
    handleCellClick,
    handleSelectMaterial,
    exportTerrain,
    invokeCharacter,
    handleInvokeCharacter,
    openCraftModal,
    closeCraftModal,
    handleBackpackClick,
    canCraft,
    craftItem,
    selectedCharacter,
    hoveredCell,
    setHoveredCell,
    movingCharacter,
    movingFrom,
    selectedWorker,
    selectedBackpackItem,
    crafteos    
  } = useTerrain();

  const isObreroNearby = (i) => {
    const row = Math.floor(i / 18);
    const col = i % 18;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0], [1, 1]
    ];
    for (let [dr, dc] of directions) {
      const nr = row + dr;
      const nc = col + dc;
      if (nr >= 0 && nr < 12 && nc >= 0 && nc < 18) {
        const ni = nr * 18 + nc;
        if (boardState[ni] === 'obrero') return true;
      }
    }
    return false;
  };

  return (
    <div className="game">
      <div className="game-left">
        
        <button className='btn btn-primary w-100 mb-4 btn-lg' onClick={() => setShowModal(true)}>Ver Iconos</button>
        <button className='btn btn-primary w-100 mb-4 btn-lg' onClick={exportTerrain}>Exportar Terreno</button>
        <button className='btn btn-primary w-100 mb-4 btn-lg' onClick={invokeCharacter}>Invocar Personaje</button>
        <button className='btn btn-primary w-100 mb-4 btn-lg' onClick={openCraftModal}>Craftear</button>
        
        <div className="inventory-compact">
          {Object.keys(playerInventory).map(item => (
            <div key={item} className="inventory-compact-item">
              {React.createElement(iconMap[item], { size: 30, color: colorMap[item] || 'white' })}
              <span>{playerInventory[item]}</span>
            </div>
          ))}
        </div>

        <div className="backpack">
          <h5>Mochila</h5>
          <div className="backpack-grid">
            {backpack.map((item, i) => (
              <div key={i} className={`backpack-slot ${selectedBackpackItem && selectedBackpackItem[1] === i ? 'selected' : ''}`} onClick={() => handleBackpackClick(i)}>
                {item && React.createElement(iconMap[item], { size: 30, color: colorMap[item] || 'white' })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="game-right">
        <div className="board">
          <div className="board-grid">
            {Array.from({ length: 12 * 18 }, (_, i) => {
              const row = Math.floor(i / 18);
              const col = i % 18;
              const isColor1 = (row + col) % 2 === 0;
              const material = boardState[i];
              const isHovered = selectedCharacter && hoveredCell === i;
              const isMovable = movingCharacter && movingFrom !== null && isAdjacent(i, movingFrom) && !isBlocked(boardState[i]);
              const isWalkable = selectedWorker !== null && isAdjacent(i, selectedWorker) && !isBlocked(boardState[i]) && i !== selectedWorker;
              const isPlaceable = selectedBackpackItem && isObreroNearby(i) && !boardState[i];
              return (
                <div 
                  key={i} 
                  className={`cell ${isColor1 ? 'color1' : 'color2'} ${isHovered ? 'hovered' : ''} ${isMovable ? 'movable' : ''} ${isWalkable ? 'walkable' : ''} ${isPlaceable ? 'placeable' : ''}`} 
                  onClick={() => handleCellClick(i)}
                  onMouseEnter={() => setHoveredCell(i)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {material && (imageMap[material] ? <img src={imageMap[material]} alt={material} style={{ width: tamano, height: tamano, pointerEvents: 'none' }} /> : React.createElement(iconMap[material], { size: tamano, color: colorMap[material] || 'white', style: { pointerEvents: 'none' } }))}
                  {isHovered && !material && React.createElement(iconMap[selectedCharacter], { size: tamano, color: 'white', style: { pointerEvents: 'none' } })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showModal && (
        <IconModal isOpen={showModal} onClose={() => setShowModal(false)} crafteos={crafteos} iconMap={iconMap} />
      )}
      {showMaterialModal && (
        <MaterialModal
          isOpen={showMaterialModal}
          onClose={() => setShowMaterialModal(false)}
          playerInventory={playerInventory}
          iconMap={iconMap}
          colorMap={colorMap}
          handleSelectMaterial={handleSelectMaterial}
        />
      )}
      {showCharacterModal && (
        <CharacterModal
          isOpen={showCharacterModal}
          onClose={() => setShowCharacterModal(false)}
          iconMap={iconMap}
          handleInvokeCharacter={handleInvokeCharacter}
        />
      )}
      {showCraftModal && (
        <div className="modal-bg" onClick={closeCraftModal}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <h3>Craftear</h3>
            <div className="craft-list">
              {Object.entries(crafteos.recetas_base).map(([item, recipe]) => (
                <div key={item} className="craft-item">
                  <button
                    disabled={!canCraft(recipe)}
                    onClick={() => craftItem(item, recipe)}
                    className="craft-button"
                  >
                    {React.createElement(iconMap[item], { size: 30, color: colorMap[item] || 'white' })}
                    <span>{item}</span>
                  </button>
                </div>
              ))}
              {Object.entries(crafteos.objetos).map(([item, recipe]) => (
                <div key={item} className="craft-item">
                  <button
                    disabled={!canCraft(recipe)}
                    onClick={() => craftItem(item, recipe)}
                    className="craft-button"
                  >
                    {React.createElement(iconMap[item], { size: 30, color: colorMap[item] || 'white' })}
                    <span>{item}</span>
                  </button>
                </div>
              ))}
            </div>
            <button onClick={closeCraftModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terrain;