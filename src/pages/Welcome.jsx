import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const Welcome = () => {

  const navigate = useNavigate();



  const handleRegister = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('✅ Usuario autenticado con Google:', user.email);
      navigate('/lobby');
    } catch (error) {
      console.log('❌ Error al autenticar con Google:', error);
    }
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
