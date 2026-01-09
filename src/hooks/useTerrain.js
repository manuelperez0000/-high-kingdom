import { useState } from 'react';
import crafteos from '../assets/crafteos.json';
import terrain1 from '../assets/terrain1.json';
import { GiWoodStick, GiStoneBlock, GiMetalBar, GiCottonFlower, GiArrowDunk, GiAxeInStump, GiCrossbow, GiHammerBreak, GiPickOfDestiny, GiSewingNeedle, GiSpellBook, GiRam, GiStoneWall, GiBowman, GiFarmer, GiWizardFace } from 'react-icons/gi';
export const useTerrain = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showCraftModal, setShowCraftModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [movingCharacter, setMovingCharacter] = useState(null);
  const [movingFrom, setMovingFrom] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedBackpackItem, setSelectedBackpackItem] = useState(null);
  const [boardState, setBoardState] = useState(terrain1.boardState);

  const [playerInventory, setPlayerInventory] = useState({
    madera: 0,
    hierro: 0,
    piedra: 0,
    algodon: 0,
    hilo: 0,
    palo: 0,
    runa: 0,
  });

  const [backpack, setBackpack] = useState(Array(4 * 6).fill(null));

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
    arquero: GiBowman,
    obrero: GiFarmer,
    mago: GiWizardFace,
  };

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

  const canCraft = (recipe) => {
    for (const [mat, qty] of Object.entries(recipe)) {
      if ((playerInventory[mat] || 0) < qty) return false;
    }
    return true;
  };

  const craftItem = (item, recipe) => {
    if (!canCraft(recipe)) return;
    // Subtract materials
    setPlayerInventory(prev => {
      const newInv = { ...prev };
      for (const [mat, qty] of Object.entries(recipe)) {
        newInv[mat] -= qty;
      }
      return newInv;
    });
    // Add to inventory or backpack
    if (crafteos.recetas_base[item]) {
      setPlayerInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));
    } else {
      // Add to backpack
      setBackpack(prev => {
        const newPack = [...prev];
        const emptyIndex = newPack.findIndex(slot => slot === null);
        if (emptyIndex !== -1) {
          newPack[emptyIndex] = item;
        }
        return newPack;
      });
    }
  };

  const handleCellClick = (i) => {
    if (movingCharacter) {
      if (!isBlocked(boardState[i])) {
        setBoardState(prev => {
          const newState = [...prev];
          newState[movingFrom] = null;
          newState[i] = movingCharacter;
          return newState;
        });
        setMovingCharacter(null);
        setMovingFrom(null);
      }
    } else if (selectedBackpackItem && isObreroNearby(i) && !boardState[i]) {
      setBoardState(prev => {
        const newState = [...prev];
        newState[i] = selectedBackpackItem[0];
        return newState;
      });
      setBackpack(prev => {
        const newPack = [...prev];
        newPack[selectedBackpackItem[1]] = null;
        return newPack;
      });
      setSelectedBackpackItem(null);
    } else if (selectedWorker !== null && isAdjacent(i, selectedWorker) && !isBlocked(boardState[i]) && i !== selectedWorker) {
      setBoardState(prev => {
        const newState = [...prev];
        newState[selectedWorker] = null;
        newState[i] = 'obrero';
        return newState;
      });
      setSelectedWorker(null);
    } else if (selectedCharacter) {
      if (!boardState[i]) {
        setBoardState(prev => prev.map((val, idx) => idx === i ? selectedCharacter : val));
        setSelectedCharacter(null);
      }
    } else {
      const content = boardState[i];
      if (content) {
        if (['madera', 'hierro', 'piedra', 'algodon', 'hilo', 'palo', 'runa'].includes(content)) {
          if (isObreroNearby(i)) {
            setPlayerInventory(prev => ({ ...prev, [content]: prev[content] + 1 }));
          } else {
            alert('Necesita poner un obrero cerca para minar este material');
          }
        } else if (!['muro_de_piedra'].includes(content)) {
          if (content === 'obrero') {
            setSelectedWorker(i);
          } else {
            // it's a character, start moving
            setMovingCharacter(content);
            setMovingFrom(i);
          }
        }
        // if muro_de_piedra, do nothing
      } else {
        setSelectedCell(i);
        setShowMaterialModal(true);
      }
    }
  };

  const handleSelectMaterial = (material) => {
    if (playerInventory[material] > 0) {
      setBoardState(prev => prev.map((val, idx) => idx === selectedCell ? material : val));
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

  const invokeCharacter = () => {
    setShowCharacterModal(true);
  };

  const handleInvokeCharacter = (character) => {
    setSelectedCharacter(character);
    setShowCharacterModal(false);
  };

  const openCraftModal = () => {
    setShowCraftModal(true);
  };

  const closeCraftModal = () => {
    setShowCraftModal(false);
  };

  const handleBackpackClick = (i) => {
    if (backpack[i] === 'muro_de_piedra') {
      if (selectedBackpackItem && selectedBackpackItem[1] === i) {
        setSelectedBackpackItem(null);
      } else {
        setSelectedBackpackItem([backpack[i], i]);
      }
    }
  };

  return {
    showModal,
    setShowModal,
    showMaterialModal,
    setShowMaterialModal,
    showCharacterModal,
    setShowCharacterModal,
    showCraftModal,
    setShowCraftModal,
    selectedCell,
    selectedCharacter,
    hoveredCell,
    setHoveredCell,
    movingCharacter,
    movingFrom,
    selectedWorker,
    selectedBackpackItem,
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
    crafteos
  };
};