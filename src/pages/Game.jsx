
import Sidebar from '../components/gameComponents/sidebar';
import GameBoard from '../components/gameComponents/GameBoard';
import CharacterModal from '../modals/CharacterModal';
import ActionModal from '../modals/ActionModal';
import CraftModal from '../modals/CraftModal';
import ArqueroActionModal from '../modals/ArqueroActionModal';
import MagoActionModal from '../modals/MagoActionModal';
import GameOverModal from '../modals/GameOverModal';
import useGame from '../hooks/useGame';
import CastleHealthBar from '../components/gameComponents/CastleHealthBar';

const Game = () => {
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

  return (
    <div className="game">
      <Sidebar onInvokeCharacter={() => setShowCharacterModal(true)} />
      <div className="game-right">
        <GameBoard/>
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
