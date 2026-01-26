import useGameStore from '../../store/useGameStore';
import gameConfig from '../../store/config.json';
const CastleHealthBar = () => {
  const { castleHealth, playerIndex } = useGameStore();
  
  const currentPlayerKey = playerIndex === 1 ? 'player1' : 'player2';
  const health = castleHealth[currentPlayerKey] ?? gameConfig.castle.initialHealth;
  const maxHealth = gameConfig.castle.maxHealth;
  const percentage = (health / maxHealth) * 100;

  // Determine color based on health percentage
  const getHealthColor = () => {
    if (percentage > 50) return '#4caf50'; // Green
    if (percentage > 20) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  return (
    <div className="castle-health-container">
      <div className="medieval-health-title">Vida del Castillo</div>
      <div className="health-bar-background">
        <div 
          className="health-bar-fill" 
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getHealthColor()
          }}
        >
          <span className="health-text">{health} / {maxHealth} </span>
        </div>
      </div>
    </div>
  );
};

export default CastleHealthBar;