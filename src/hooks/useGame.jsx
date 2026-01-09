import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import spriteController from "../sprites/spriteController";
import useGameStore from "../store/useGameStore";
import { getClassNames } from "../utils/gameUtils";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const useGame = () => {
    const { gameId } = useParams();
    const { phase, boardState, isPlayerTurn, updateBoardCell, setPhase } = useGameStore();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Get current user
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return unsubscribe;
    }, []);

    const handleCellClick = async (i) => {
        // Only allow clicks if it's the player's turn
        if (!isPlayerTurn || !user) return;

        // gamePhase 4
        const textureSelected = phase < 3 ? 'madera' : 'algodon';

        // Update local state
        updateBoardCell(i, textureSelected);

        // Update Firebase
        if (gameId) {
            try {
                const gameRef = doc(db, 'games', gameId);
                const newBoardState = [...boardState];
                newBoardState[i] = textureSelected;

                const newPhase = phase + 1 <= 4 ? phase + 1 : 1;

                await updateDoc(gameRef, {
                    boardState: newBoardState,
                    phase: newPhase
                });

                // Update local phase state
                setPhase(newPhase);
            } catch (error) {
                console.error('Error updating game state:', error);
            }
        }

        console.log(`Cell ${i} clicked `, boardState);
    };

    const getSprite = (i) => boardState[i] && <img className='boardTexture' src={spriteController[boardState[i]]} />;

    return {
        getClassNames, handleCellClick, getSprite
    }
}
export default useGame;
