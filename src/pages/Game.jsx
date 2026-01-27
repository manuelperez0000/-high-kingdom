
import Sidebar from '../components/gameComponents/sidebar';
import GameBoard from '../components/gameComponents/GameBoard';
import CharacterModal from '../modals/CharacterModal';
import ActionModal from '../modals/ActionModal';
import CraftModal from '../modals/CraftModal';
import ArqueroActionModal from '../modals/ArqueroActionModal';
import MagoActionModal from '../modals/MagoActionModal';
import GameOverModal from '../modals/GameOverModal';
import useGame from '../hooks/useGame';
import { useEffect, useRef, useState } from 'react';

const Game = () => {
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const {
    showCharacterModal,
    setShowCharacterModal,
    showActionModal,
    setShowActionModal,
    showCraftModal,
    setShowCraftModal,
    showArqueroModal,
    setShowArqueroModal,
    showMagoModal,
    setShowMagoModal,
    handleActionSelect,
    handleCraftSelect,
    handleArqueroActionSelect,
    handleMagoActionSelect,
    handleInvokeCharacter,
    playerIndex,
    gameStatus,
    gameWinner,
    user
  } = useGame();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/soundEffects/musica.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }
    
    const playAttempt = audioRef.current.play();
    
    if (playAttempt !== undefined) {
      playAttempt.catch(error => {
        console.log("Auto-play was prevented. Music will start after user interaction.", error);
        // Intentar reproducir de nuevo al primer clic del usuario
        const playOnInteraction = () => {
          audioRef.current.play();
          document.removeEventListener('click', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="game">
      <Sidebar 
        onInvokeCharacter={() => setShowCharacterModal(true)} 
        volume={volume}
        setVolume={setVolume}
      />
      <div className="game-right">
        <GameBoard />
      </div>

      {gameStatus === 'finished' && (
        <GameOverModal isWinner={gameWinner === user?.uid} />
      )}

      <CharacterModal
        isOpen={showCharacterModal}
        onClose={() => setShowCharacterModal(false)}
        handleInvokeCharacter={handleInvokeCharacter}
        playerIndex={playerIndex}
      />
      <ActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onAction={handleActionSelect}
      />
      <CraftModal
        isOpen={showCraftModal}
        onClose={() => setShowCraftModal(false)}
        onCraft={handleCraftSelect}
      />
      <ArqueroActionModal
        isOpen={showArqueroModal}
        onClose={() => setShowArqueroModal(false)}
        onAction={handleArqueroActionSelect}
      />
      <MagoActionModal
        isOpen={showMagoModal}
        onClose={() => setShowMagoModal(false)}
        onAction={handleMagoActionSelect}
      />
    </div>
  );
};

export default Game;
