import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Placeholder para lógica de registro con Google
    navigate('/lobby');
  };

  return (
    <div className="welcome">
      <h1>Bienvenido a High Kingdom</h1>
      <p>Regístrate con Google para comenzar a jugar.</p>
      <button onClick={handleRegister}>Registrarse con Google</button>
    </div>
  );
};

export default Welcome;