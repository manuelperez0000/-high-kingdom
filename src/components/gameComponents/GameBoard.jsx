import useGame from '../../hooks/useGame';
import useGameStore from '../../store/useGameStore';

const GameBoard = () => {
    const { getClassNames, handleCellClick, getSprite } = useGame();
    const { isPlayerTurn } = useGameStore();

    return <div className="board">
        <div className="board-grid">
            {Array.from({ length: 12 * 18 }, (_, i) => {
                return (
                    <div
                        key={i}
                        className={`${getClassNames(i)} ${!isPlayerTurn ? 'disabled' : ''}`}
                        onClick={() => isPlayerTurn && handleCellClick(i)}>
                        {getSprite(i)}
                    </div>
                );
            })}
        </div>
        {!isPlayerTurn && (
            <div className="turn-indicator">
                <p>Esperando turno del rival...</p>
            </div>
        )}
    </div>
}
export default GameBoard;
