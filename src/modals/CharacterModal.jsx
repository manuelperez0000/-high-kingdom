/* eslint-disable react/prop-types */
import spriteController from '../sprites/spriteController';
import gameConfig from '../store/config.json';
import useSound from '../hooks/useSound';

const CharacterModal = ({ isOpen, onClose, handleInvokeCharacter, playerIndex }) => {
  const playSound = useSound();
  if (!isOpen) return null;

  const characters = [
    { id: 'obrero', name: 'Obrero', cost: gameConfig.summonCosts.obrero },
    { id: 'arquero', name: 'Arquero', cost: gameConfig.summonCosts.arquero },
    { id: 'mago', name: 'Mago', cost: gameConfig.summonCosts.mago }
  ];

  return (
    <div className="modal-bg medieval-modal-bg">
      <div className="medieval-modal">
        <div className="medieval-header">
          <span 
            className="medieval-close" 
            onClick={() => {
              playSound('click.mp3');
              onClose();
            }}
            onMouseEnter={() => playSound('hover.mp3')}
          >&times;</span>
          <h3 className="medieval-title">Reclutar Tropas</h3>
        </div>
        
        <div className="medieval-body">
          <div className="character-grid">
            {characters.map(char => {
              const spriteKey = playerIndex === 2 ? `${char.id}2` : char.id;
              return (
                <div 
                  key={char.id} 
                  className="character-card" 
                  onClick={() => {
                    playSound('click.mp3');
                    handleInvokeCharacter(char.id);
                  }}
                  onMouseEnter={() => playSound('hover.mp3')}
                >
                  <div className="character-image-container">
                    <img src={spriteController[spriteKey]} alt={char.name} className="character-portrait" />
                  </div>
                  <div className="character-info">
                    <span className="character-name">{char.name.toUpperCase()}</span>
                    <div className="character-cost">
                      {Object.entries(char.cost).map(([resource, amount]) => (
                        <span key={resource} className={`cost-item ${resource}`}>
                          {amount} {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="medieval-footer">
          <p>Elige sabiamente, cada guerrero cuenta en la batalla.</p>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
