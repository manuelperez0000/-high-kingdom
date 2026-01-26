/* eslint-disable react/prop-types */
/* import PropTypes from 'prop-types'; */
import Inventory from "./Inventory"
import useSidebar from '../../hooks/useSidebar';
import { FaUserPlus } from 'react-icons/fa';
import useGameStore from '../../store/useGameStore';

const Sidebar = ({ onInvokeCharacter }) => {

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
                    onClick={onInvokeCharacter}
                    disabled={!isPlayerTurn}
                >
                    <FaUserPlus />
                    Invocar Personaje
                </button>

                {opponent && <button
                    className="surrender-button"
                    onClick={handleSurrender}
                >
                    Rendirse
                </button>}
            </div>
        </div>
    )
}

export default Sidebar
