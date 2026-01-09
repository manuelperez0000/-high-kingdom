import { create } from 'zustand'

const useGameStore = create((set) => ({
    phase: 1,
    boardState: Array(12 * 18).fill(null),
    currentPlayer: 1, // 1 for creator, 2 for opponent
    isPlayerTurn: false, // whether it's the current user's turn
    setPhase: (phase) => set({ phase }),
    setBoardState: (boardState) => set({ boardState }),
    setCurrentPlayer: (currentPlayer) => set({ currentPlayer }),
    setIsPlayerTurn: (isPlayerTurn) => set({ isPlayerTurn }),
    nextPhase: () => set((state) => {
        const newPhase = state.phase + 1 <= 4 ? state.phase + 1 : 1;
        // Update current player based on phase
        const newCurrentPlayer = newPhase <= 2 ? 1 : 2;
        return {
            phase: newPhase,
            currentPlayer: newCurrentPlayer
        };
    }),
    updateBoardCell: (index, value) => set((state) => {
        const newBoardState = [...state.boardState];
        newBoardState[index] = value;
        return { boardState: newBoardState };
    }),
}))

export default useGameStore
