import React from 'react';
import useGameStore from '../store/useGameStore';
import { useNavigate } from 'react-router-dom';
import useSound from '../hooks/useSound';
import '../index.css';

const GameOverModal = ({ isWinner }) => {
    const navigate = useNavigate();
    const playSound = useSound();
    const { setGameStatus, setGameWinner } = useGameStore();

    const handleReturnToLobby = () => {
        playSound('click.mp3');
        setGameStatus('playing');
        setGameWinner(null);
        navigate('/lobby');
    };

    return (
        <div className="medieval-modal-bg">
            <div className="game-over-modal">
                <h2 className={isWinner ? 'winner-text' : 'loser-text'}>
                    {isWinner ? '¡VICTORIA!' : '¡DERROTA!'}
                </h2>
                <div className="game-over-icon">
                    {isWinner ? '🏆' : '💀'}
                </div>
                <p className="game-over-message">
                    {isWinner 
                        ? 'Has destruido el castillo enemigo y reclamado el reino.' 
                        : 'Tu castillo ha caído. El enemigo ha conquistado tus tierras.'}
                </p>
                <button 
                    className="lobby-button" 
                    onClick={handleReturnToLobby}
                    onMouseEnter={() => playSound('hover.mp3')}
                >
                    REGRESAR AL LOBBY
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;
