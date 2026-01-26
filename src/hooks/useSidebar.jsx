import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import useGameStore from "../store/useGameStore";

const useSidebar = () => {

    const { 
        phase, 
        setPhase, 
        setBoardState, 
        setCurrentPlayer, 
        setIsPlayerTurn, 
        isPlayerTurn,
        setInventories
    } = useGameStore();
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [creator, setCreator] = useState(null);

    const handleSurrender = async () => {
        if (!user || !opponent || !gameId) return;

        try {
            const gameRef = doc(db, 'games', gameId);
            await updateDoc(gameRef, {
                surrenderedPlayer: user.uid,
                winner: opponent.id,
                status: 'finished',
                finishedAt: new Date()
            });

            // Update local state to reflect game end
            setIsPlayerTurn(false);
        } catch (error) {
            console.error('Error al rendirse:', error);
            alert('Error al procesar la rendición.');
        }
    };

    useEffect(() => {
        // Verificar estado de autenticación
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            }
        });

        // Escuchar cambios en la partida si hay gameId
        let unsubscribeGame = null;
        if (gameId) {
            const gameRef = doc(db, 'games', gameId);
            unsubscribeGame = onSnapshot(gameRef, (doc) => {
                if (doc.exists()) {
                    const gameData = { id: doc.id, ...doc.data() };

                    // Check if game has ended due to surrender and redirect both players to lobby
                    if (gameData.status === 'finished' && gameData.surrenderedPlayer) {
                        navigate('/lobby');
                        return;
                    }

                    // Sync game state from Firebase
                    if (gameData.phase) setPhase(gameData.phase);
                    if (gameData.boardState) setBoardState(gameData.boardState);
                    if (gameData.inventories) setInventories(gameData.inventories);

                    // Determine current player and if it's user's turn
                    const currentPlayer = gameData.phase <= 2 ? 1 : 2; // 1 for creator, 2 for opponent
                    setCurrentPlayer(currentPlayer);

                    // Check if it's the current user's turn
                    const isCreator = user?.uid === gameData.creatorId;
                    const isUserTurn = (currentPlayer === 1 && isCreator) || (currentPlayer === 2 && !isCreator);
                    setIsPlayerTurn(isUserTurn);

                    // Encontrar el oponente (el otro jugador en la partida)
                    if (gameData.players && gameData.players.length > 1 && gameData.playersData) {
                        const opponentId = gameData.players.find(playerId => playerId !== user?.uid);
                        if (opponentId) {
                            const opponentData = gameData.playersData.find(player => player.id === opponentId);
                            if (opponentData) {
                                setOpponent({
                                    id: opponentId,
                                    name: opponentData.name,
                                    email: opponentData.email
                                });
                            }
                        }

                        // Set creator information
                        const creatorData = gameData.playersData.find(player => player.id === gameData.creatorId);
                        if (creatorData) {
                            setCreator({
                                id: gameData.creatorId,
                                name: creatorData.name,
                                email: creatorData.email
                            });
                        }
                    } else {
                        setOpponent(null);
                        setCreator(null);
                    }
                }
            });
        }

        return () => {
            unsubscribeAuth();
            if (unsubscribeGame) unsubscribeGame();
        };
    }, [gameId, user?.uid, setPhase, setBoardState, setCurrentPlayer, setIsPlayerTurn, navigate]);

    return {
        user,
        phase,
        opponent,
        creator,
        isPlayerTurn,
        handleSurrender
    }
}

export default useSidebar