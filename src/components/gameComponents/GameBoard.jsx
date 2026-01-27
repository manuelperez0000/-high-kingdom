/* import PropTypes from 'prop-types'; */
import { useState } from 'react';
import useGame from '../../hooks/useGame';
import spriteController from '../../sprites/spriteController';
import useSound from '../../hooks/useSound';

const GameBoard = () => {
    const playSound = useSound();
    const [hoveredCell, setHoveredCell] = useState(null);

    const { getClassNames,
        getSprite, isPlayerTurn,
        handleBoardCellClick, boardState,
        localSelectedCharacter,
        selectedFrom,
        craftingMode,
        isObreroNearby,
        disabledResources
    } = useGame();

    const handleCellClick = (i) => {
        handleBoardCellClick(i);
    };

    const getSpriteOrCharacter = (i) => {
        if (localSelectedCharacter && hoveredCell === i && boardState[i] === null) {
            return (
                <img
                    src={spriteController[localSelectedCharacter]}
                    alt={localSelectedCharacter}
                    height={"29px"}
                    className="character"
                />
            );
        }
        if (craftingMode && hoveredCell === i && boardState[i] === null) {
            return (
                <img
                    src={spriteController[craftingMode.type]}
                    alt={craftingMode.type}
                    height={"29px"}
                    className="character preview-wall"
                />
            );
        }
        return getSprite(i);
    }
    return <div className="board">
        <div className="board-grid">
            {boardState.map((item, i) => {
                return (
                    <div
                        key={i}
                        className={`${getClassNames(i)} ${!isPlayerTurn && !localSelectedCharacter ? 'disabled' : ''} ${selectedFrom === i ? 'selected' : ''}`}
                        onClick={() => handleCellClick(i)}
                        onMouseEnter={() => {
                            playSound('hover.mp3');
                            setHoveredCell(i);
                        }}
                        onMouseLeave={() => setHoveredCell(null)}>
                        {getSpriteOrCharacter(i)}
                    </div>
                );
            })}
        </div>
        {!isPlayerTurn && !localSelectedCharacter && (
            <div className="turn-indicator">
                <p>Esperando turno del rival...</p>
            </div>
        )}
    </div>
}

export default GameBoard;
