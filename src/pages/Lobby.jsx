import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, orderBy, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

const Lobby = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar estado de autenticación
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    // Cargar lista de partidas activas con listener en tiempo real
    const unsubscribeGames = loadActiveGames();

    return () => {
      unsubscribeAuth();
      unsubscribeGames();
    };
  }, [navigate]);

  const loadActiveGames = () => {
    const gamesQuery = query(collection(db, 'games'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(gamesQuery, (querySnapshot) => {
      const gamesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(gamesList);
    }, (error) => {
      console.error('Error al cargar partidas:', error);
    });

    return unsubscribe;
  };

  const handleCreateGame = async () => {
    if (!user) return;

    try {
      const playerData = {
        id: user.uid,
        name: user.displayName || user.email,
        email: user.email
      };

      const gameData = {
        creatorId: user.uid,
        createdAt: new Date(),
        status: 'waiting',
        players: [user.uid],
        playersData: [playerData],
        boardState: Array(12 * 18).fill(null), // Initialize empty board
        phase: 1
      };

      const docRef = await addDoc(collection(db, 'games'), gameData);
      console.log('Partida creada con ID:', docRef.id);

      // Navegar al juego con el ID de la partida
      navigate(`/game/${docRef.id}`);
    } catch (error) {
      console.error('Error al crear partida:', error);
    }
  };

  const handleJoinGame = async (gameId) => {
    if (!user) return;

    try {
      const gameRef = doc(db, 'games', gameId);

      // Buscar la partida en el estado local
      const game = games.find(g => g.id === gameId);

      if (!game) {
        console.error('Partida no encontrada');
        return;
      }

      const playerData = {
        id: user.uid,
        name: user.displayName || user.email,
        email: user.email
      };

      // Si el usuario no es el creador, agregarlo a la lista de jugadores
      if (user.uid !== game.creatorId) {
        await updateDoc(gameRef, {
          players: arrayUnion(user.uid),
          playersData: arrayUnion(playerData)
        });
        console.log('Usuario agregado a la partida:', gameId);
      } else {
        console.log('Creador entrando a su propia partida:', gameId);
      }

      // Navegar al juego
      navigate(`/game/${gameId}`);
    } catch (error) {
      console.error('Error al unirse a la partida:', error);
    }
  };

  if (loading) {
    return <div className="lobby">Cargando...</div>;
  }

  return (
    <div className="lobby">
      <div className="lobby-container">
        {/* Panel izquierdo - Información del usuario */}
        <div className="lobby-left">
          <div className="user-info">
            <h2>¡Bienvenido!</h2>
            <div className="user-details">
              <p><strong>Nombre:</strong> {user?.displayName || 'Usuario'}</p>
              <p><strong>Correo:</strong> {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Panel derecho - Sala de partidas */}
        <div className="lobby-right">
          <div className="game-room">
            <h2>Sala de Partidas</h2>
            <button className="create-game-btn" onClick={handleCreateGame}>
              Crear Nueva Partida
            </button>

            <div className="active-games">
              <h3>Partidas Activas</h3>
              {games.filter(game => game.status !== 'finished').length === 0 ? (
                <p className='text-light'>No hay partidas activas en este momento.</p>
              ) : (
                <div className="games-list">
                  {games.filter(game => game.status !== 'finished').map((game) => {
                    const creatorData = game.playersData?.find(player => player.id === game.creatorId);
                    return (
                      <div key={game.id} className="game-item">
                        <div className="game-info">
                          <p><strong>Creador:</strong> {creatorData?.name || 'Usuario'}</p>
                          <p><strong>Correo:</strong> {creatorData?.email || 'N/A'}</p>
                          <p><strong>Estado:</strong> {
                            game.status === 'waiting' ? 'Esperando jugadores' :
                            'En juego'
                          }</p>
                        </div>
                        <button
                          className="join-game-btn"
                          onClick={() => handleJoinGame(game.id)}
                          disabled={game.status !== 'waiting'}
                        >
                          {game.status === 'waiting'
                            ? (user.uid === game.creatorId ? 'Entrar' : 'Unirse')
                            : 'En juego'
                          }
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* <div className="finished-games">
              <h3>Partidas Finalizadas</h3>
              {games.filter(game => game.status === 'finished').length === 0 ? (
                <p>No hay partidas finalizadas.</p>
              ) : (
                <div className="games-list">
                  {games.filter(game => game.status === 'finished').map((game) => {
                    const creatorData = game.playersData?.find(player => player.id === game.creatorId);
                    const winnerData = game.playersData?.find(player => player.id === game.winner);
                    return (
                      <div key={game.id} className="game-item">
                        <div className="game-info">
                          <p><strong>Creador:</strong> {creatorData?.name || 'Usuario'}</p>
                          <p><strong>Ganador:</strong> {winnerData?.name || 'N/A'}</p>
                          <p><strong>Estado:</strong> Finalizada</p>
                        </div>
                        <button
                          className="join-game-btn"
                          onClick={() => handleJoinGame(game.id)}
                        >
                          Ver resultado
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
