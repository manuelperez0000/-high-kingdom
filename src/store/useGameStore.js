import { createWithEqualityFn } from 'zustand/traditional'
import gameConfig from './config.json'

const useGameStore = createWithEqualityFn((set) => ({
    phase: 1,
    boardState: Array(12 * 18).fill(null),
    currentPlayer: 1, // 1 for creator, 2 for opponent
    playerIndex: null, // 1 for creator, 2 for opponent (set on load)
    isPlayerTurn: false, // whether it's the current user's turn
    setPhase: (phase) => set({ phase }),
    setBoardState: (boardState) => set({ boardState }),
    setCurrentPlayer: (currentPlayer) => set({ currentPlayer }),
    setPlayerIndex: (playerIndex) => set({ playerIndex }),
    setIsPlayerTurn: (isPlayerTurn) => set({ isPlayerTurn }),
    updateBoardCell: (index, value) => set((state) => {
        const newBoardState = [...state.boardState];
        newBoardState[index] = value;
        return { boardState: newBoardState };
    }),
    localSelectedCharacter: null,
    setLocalSelectedCharacter: (localSelectedCharacter) => set({ localSelectedCharacter }),
    craftingMode: null, // { type: 'muro_piedra', workerIndex: number }
    setCraftingMode: (craftingMode) => set({ craftingMode }),
    showCharacterModal: false,
    setShowCharacterModal: (show) => set({ showCharacterModal: show }),
    showActionModal: false,
    setShowActionModal: (show) => set({ showActionModal: show }),
    showCraftModal: false,
    setShowCraftModal: (show) => set({ showCraftModal: show }),
    showArqueroModal: false,
    setShowArqueroModal: (show) => set({ showArqueroModal: show }),
    showMagoModal: false,
    setShowMagoModal: (show) => set({ showMagoModal: show }),
    selectedObreroIndex: null,
    setSelectedObreroIndex: (index) => set({ selectedObreroIndex: index }),
    selectedArqueroIndex: null,
    setSelectedArqueroIndex: (index) => set({ selectedArqueroIndex: index }),
    selectedMagoIndex: null,
    setSelectedMagoIndex: (index) => set({ selectedMagoIndex: index }),
    selectedFrom: null,
    setSelectedFrom: (selectedFrom) => set({ selectedFrom }),
    attackMode: null, // { type: 'arquero', attackerIndex: number }
    setAttackMode: (attackMode) => set({ attackMode }),
    inventories: {
        player1: { madera: 4, piedra: 0, hierro: 0, algodon: 0 },
        player2: { madera: 4, piedra: 0, hierro: 0, algodon: 0 }
    },
    setInventories: (inventories) => set({ inventories }),
    castleHealth: {
        player1: gameConfig.castle.initialHealth,
        player2: gameConfig.castle.initialHealth
    },
    setCastleHealth: (castleHealth) => set({ castleHealth }),
    wallHealths: {}, // { [index]: health }
    setWallHealths: (wallHealths) => set({ wallHealths }),
    gameStatus: 'playing', // 'playing', 'finished'
    setGameStatus: (gameStatus) => set({ gameStatus }),
    gameWinner: null, // userId of winner
    setGameWinner: (gameWinner) => set({ gameWinner }),
    disabledResources: { player1: [], player2: [] }, // Indices by player
    setDisabledResources: (disabledResources) => set({ disabledResources }),
}))

export default useGameStore
