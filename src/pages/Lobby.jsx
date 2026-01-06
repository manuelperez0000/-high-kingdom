import React from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const navigate = useNavigate();

  const handleJoinGame = () => {
    // Placeholder para lógica de unirse a partida
    navigate('/game');
  };

  return (
    <div className="lobby">
      <h1>Lobby</h1>
      <p>Presiona el botón para unirte a una partida.</p>
      <button onClick={handleJoinGame}>Unirse a Partida</button>
    </div>
  );
};

export default Lobby;