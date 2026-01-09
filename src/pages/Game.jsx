
import Sidebar from '../components/gameComponents/sidebar';
import GameBoard from '../components/gameComponents/GameBoard';

const Game = () => {

  return (
    <div className="game">
      <Sidebar />
      <div className="game-right">
        <GameBoard />
      </div>
    </div>
  );
};

export default Game;