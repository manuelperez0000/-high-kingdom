/* eslint-disable react/prop-types */
/* import PropTypes from 'prop-types'; */
import Inventory from "./Inventory"
import useSidebar from '../../hooks/useSidebar';
import { FaUserPlus, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import useGameStore from '../../store/useGameStore';
import useSound from '../../hooks/useSound';

const Sidebar = ({ onInvokeCharacter, volume, setVolume }) => {
    const playSound = useSound();
    const {
        user,
        phase,
        opponent,
        creator,
        isPlayerTurn,
        handleSurrender
    } = useSidebar();

    const { localSelectedCharacter } = useGameStore();

    return (
        <div className="game-left">
            <div className='medieval-sidebar-header'>
                {user && (
                    <span>{user.displayName || user.email}</span>
                )}
                <span className="medieval-vs"> VS </span>
                {opponent ? (
                    <span>{opponent.name}</span>
                ) : (
                    <span>Esperando rival...</span>
                )}
            </div>

            {/* <div className="medieval-info-card text-danger">
                <p>Fase: {phase <= 2 ? 'Turno Jugador 1' : 'Turno Jugador 2'}</p>
                <p>Acción: {phase % 2 === 1 ? '1 / 2' : '2 / 2'}</p>
            </div> */}

            <div className="game-options">
                <div className="medieval-info-card d-flex flex-column align-items-center">
                    <h4 className='m-0 p-0'>Turno de:</h4>
                    <p className="turn-player">
                        {isPlayerTurn
                            ? (user ? (user.displayName || user.email) : 'Esperando...')
                            : (user?.uid === creator?.id ? (opponent ? opponent.name : 'Esperando...') : (creator ? creator.name : 'Esperando...'))
                        }
                    </p>
                </div>
                
                <Inventory />

                <button
                    className="invoke-character-button"
                    onClick={() => {
                        playSound('click.mp3');
                        onInvokeCharacter();
                    }}
                    onMouseEnter={() => playSound('hover.mp3')}
                    disabled={!isPlayerTurn}
                >
                    <FaUserPlus />
                    Invocar Personaje
                </button>

                {opponent && <button
                    className="surrender-button"
                    onClick={() => {
                        playSound('click.mp3');
                        handleSurrender();
                    }}
                    onMouseEnter={() => playSound('hover.mp3')}
                >
                    Rendirse
                </button>}

                <div className="volume-control-container">
                    <div className="volume-icon">
                        {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="medieval-volume-slider"
                    />
                    <span className="volume-percentage">{Math.round(volume * 100)}%</span>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
