import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import spriteController from "../sprites/spriteController";
import useGameStore from "../store/useGameStore";
import { auth, db } from "../firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import terrain from '../assets/terrain1.json'
import gameConfig from '../store/config.json'
import useSound from "./useSound";

const useGame = (onCharacterPlaced) => {
    const playSound = useSound();
    const { gameId } = useParams();
    const {
        phase,
        boardState,
        setBoardState,
        isPlayerTurn,
        setIsPlayerTurn,
        setPhase,
        currentPlayer,
        setCurrentPlayer,
        playerIndex,
        setPlayerIndex,
        localSelectedCharacter,
        setLocalSelectedCharacter,
        inventories,
        setInventories,
        castleHealth,
        setCastleHealth,
        wallHealths,
        setWallHealths,
        gameStatus,
        setGameStatus,
        gameWinner,
        setGameWinner,
        craftingMode,
        setCraftingMode,
        showCharacterModal,
        setShowCharacterModal,
        showActionModal,
        setShowActionModal,
        showCraftModal,
        setShowCraftModal,
        showArqueroModal,
        setShowArqueroModal,
        showMagoModal,
        setShowMagoModal,
        selectedObreroIndex,
        setSelectedObreroIndex,
        selectedArqueroIndex,
        setSelectedArqueroIndex,
        selectedMagoIndex,
        setSelectedMagoIndex,
        selectedFrom,
        setSelectedFrom,
        attackMode,
        setAttackMode,
        disabledResources,
        setDisabledResources
    } = useGameStore();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        let unsubscribeGame = null;
        if (gameId) {
            const gameRef = doc(db, 'games', gameId);
            unsubscribeGame = onSnapshot(gameRef, (docSnap) => {
                if (docSnap.exists()) {
                    const gameData = docSnap.data();
                    setBoardState(gameData.boardState || terrain.boardState);
                    setPhase(gameData.phase || 1);
                    setLocalSelectedCharacter(gameData.localSelectedCharacter || null);

                    if (gameData.inventories) {
                        setInventories(gameData.inventories);
                    }

                    if (gameData.castleHealth) {
                        setCastleHealth(gameData.castleHealth);
                    }

                    if (gameData.wallHealths) {
                        setWallHealths(gameData.wallHealths);
                    }

                    if (gameData.status) {
                        setGameStatus(gameData.status);
                    }

                    if (gameData.winner) {
                        setGameWinner(gameData.winner);
                    }

                    if (gameData.disabledResources) {
                        setDisabledResources(gameData.disabledResources);
                    } else {
                        setDisabledResources({ player1: [], player2: [] });
                    }

                    const newPhase = gameData.phase || 1;
                    const activePlayer = newPhase <= 2 ? 1 : 2;
                    setCurrentPlayer(activePlayer);

                    if (user) {
                        const index = gameData.creatorId === user.uid ? 1 : 2;
                        setPlayerIndex(index);
                        setIsPlayerTurn(activePlayer === index);
                    }
                }
            });
        }

        return () => {
            unsubscribeAuth();
            if (unsubscribeGame) unsubscribeGame();
        };
    }, [gameId, user, setLocalSelectedCharacter, setBoardState, setPhase, setCurrentPlayer, setPlayerIndex, setIsPlayerTurn]);

    const isObreroNearby = (index) => {
        const row = Math.floor(index / 18);
        const col = index % 18;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];

        const obreroType = `p${playerIndex}_obrero`;

        for (let [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < 12 && nc >= 0 && nc < 18) {
                const ni = nr * 18 + nc;
                if (boardState[ni] === obreroType) return true;
            }
        }
        return false;
    };

    const isWithinOneCell = (fromIndex, toIndex) => {
        const r1 = Math.floor(fromIndex / 18);
        const c1 = fromIndex % 18;
        const r2 = Math.floor(toIndex / 18);
        const c2 = toIndex % 18;
        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
    };

    const hasLineOfSight = (fromIndex, toIndex) => {
        const r1 = Math.floor(fromIndex / 18);
        const c1 = fromIndex % 18;
        const r2 = Math.floor(toIndex / 18);
        const c2 = toIndex % 18;

        const dr = r2 - r1;
        const dc = c2 - c1;
        const distance = Math.max(Math.abs(dr), Math.abs(dc));

        if (distance === 0) return true;

        for (let i = 1; i < distance; i++) {
            // Simplified Bresenham or linear interpolation for discrete grid
            const checkR = Math.round(r1 + (dr * i) / distance);
            const checkC = Math.round(c1 + (dc * i) / distance);
            const checkIndex = checkR * 18 + checkC;

            if (boardState[checkIndex] === 'muro_piedra') {
                return false;
            }
        }
        return true;
    };

    const nextPhase = async ({ gameId, newBoardState, newInventories, newCastleHealth, newWallHealths, newDisabledResources }) => {
        if (gameId) {
            try {
                const gameRef = doc(db, 'games', gameId);
                const newPhase = phase + 1 <= 4 ? phase + 1 : 1;

                const updateData = {
                    phase: newPhase,
                    localSelectedCharacter: null,
                };

                // Reset disabled resources when it's the start of a player's full turn
                let currentDisabledResources = newDisabledResources || disabledResources;
                if (newPhase === 1) {
                    currentDisabledResources = { ...currentDisabledResources, player1: [] };
                } else if (newPhase === 3) {
                    currentDisabledResources = { ...currentDisabledResources, player2: [] };
                }
                updateData.disabledResources = currentDisabledResources;

                if (newBoardState) {
                    updateData.boardState = newBoardState;
                }
                if (newInventories) {
                    updateData.inventories = newInventories;
                }
                if (newCastleHealth) {
                    updateData.castleHealth = newCastleHealth;
                }
                if (newWallHealths) {
                    updateData.wallHealths = newWallHealths;
                }

                await updateDoc(gameRef, updateData);
            } catch (error) {
                console.error('Error updating game state:', error);
            }
        }
    };

    const handleCharacterPlaced = async (index) => {
        if (!localSelectedCharacter) return;

        const cost = gameConfig.summonCosts[localSelectedCharacter];
        const playerKey = playerIndex === 1 ? 'player1' : 'player2';

        // Use a deep copy of the current inventories state
        const newInventories = JSON.parse(JSON.stringify(inventories));

        if (!newInventories[playerKey]) {
            newInventories[playerKey] = { madera: 0, piedra: 0, hierro: 0, algodon: 0 };
        }

        // Subtract resources
        newInventories[playerKey].madera = (newInventories[playerKey].madera || 0) - (cost.madera || 0);
        newInventories[playerKey].piedra = (newInventories[playerKey].piedra || 0) - (cost.piedra || 0);
        newInventories[playerKey].hierro = (newInventories[playerKey].hierro || 0) - (cost.hierro || 0);
        newInventories[playerKey].algodon = (newInventories[playerKey].algodon || 0) - (cost.algodon || 0);

        const newBoardState = [...boardState];
        newBoardState[index] = `p${playerIndex}_${localSelectedCharacter}`;

        setLocalSelectedCharacter(null);
        await nextPhase({ gameId, newBoardState, newInventories });

        if (onCharacterPlaced) {
            onCharacterPlaced();
        }
    };

    const handleBoardCellClick = async (i) => {
        if (!isPlayerTurn || !user || gameStatus === 'finished') {
            playSound('error.mp3');
            return;
        }

        // Handle wall placement
        if (craftingMode) {
            if (i === craftingMode.workerIndex) {
                setCraftingMode(null);
                return;
            }
            if (!isWithinOneCell(craftingMode.workerIndex, i)) {
                playSound('error.mp3');
                return;
            }
            if (boardState[i] !== null) {
                playSound('error.mp3');
                return;
            }

            const newBoardState = [...boardState];
            newBoardState[i] = craftingMode.type; // e.g., 'muro_piedra'

            // Deduct materials for the wall
            const craftData = gameConfig.crafting[craftingMode.type];
            const newInventories = JSON.parse(JSON.stringify(inventories));
            const playerKey = playerIndex === 1 ? 'player1' : 'player2';

            if (craftData && craftData.cost) {
                for (const [res, amount] of Object.entries(craftData.cost)) {
                    newInventories[playerKey][res] = (newInventories[playerKey][res] || 0) - amount;
                }
            }

            // Set initial health for the wall
            const newWallHealths = { ...wallHealths };
            if (craftingMode.type === 'muro_piedra') {
                newWallHealths[i] = gameConfig.wall.initialHealth;
            }

            setCraftingMode(null);
            await nextPhase({ gameId, newBoardState, newWallHealths, newInventories });
            return;
        }

        // Handle Archer Attack
        if (attackMode && attackMode.type === 'arquero') {
            if (i === attackMode.attackerIndex) {
                setAttackMode(null);
                return;
            }
            const r1 = Math.floor(attackMode.attackerIndex / 18);
            const c1 = attackMode.attackerIndex % 18;
            const r2 = Math.floor(i / 18);
            const c2 = i % 18;
            const distance = Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));

            if (distance > 3) {
                playSound('error.mp3');
                return;
            }

            if (!hasLineOfSight(attackMode.attackerIndex, i)) {
                playSound('error.mp3');
                return;
            }

            const target = boardState[i];
            const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';

            if (target === enemyCastle) {
                if (window.confirm('¿Quieres atacar el castillo enemigo con flechas?')) {
                    const enemyKey = playerIndex === 1 ? 'player2' : 'player1';
                    const currentHealth = castleHealth[enemyKey];
                    const damage = gameConfig.castle.damageReceived.arquero;
                    const newHealth = currentHealth - damage;

                    if (newHealth <= 0) {
                        const newCastleHealth = { ...castleHealth, [enemyKey]: 0 };
                        playSound('sword.mp3');
                        const gameRef = doc(db, 'games', gameId);
                        await updateDoc(gameRef, {
                            castleHealth: newCastleHealth,
                            status: 'finished',
                            winner: user.uid
                        });
                        alert('¡Has destruido el castillo enemigo y ganado la partida!');
                    } else {
                        const newCastleHealth = { ...castleHealth, [enemyKey]: newHealth };
                        playSound('sword.mp3');
                        alert(`¡Flecha en el blanco! Al castillo enemigo le quedan ${newHealth} vidas.`);
                        setAttackMode(null);
                        await nextPhase({ gameId, newCastleHealth });
                    }
                    return;
                }
            }

            if (target === 'muro_piedra') {
                const currentHealth = wallHealths[i] ?? gameConfig.wall.initialHealth;
                const damage = gameConfig.wall.damageReceived.arquero;
                const newHealth = currentHealth - damage;
                const newWallHealths = { ...wallHealths };
                const newBoardState = [...boardState];

                if (newHealth <= 0) {
                    delete newWallHealths[i];
                    newBoardState[i] = null;
                    playSound('stone.mp3');
                    //alert('¡Muro destruido!');
                } else {
                    newWallHealths[i] = newHealth;
                    playSound('stone.mp3');
                    //alert(`¡Ataque al muro! Vida restante: ${newHealth}`);
                }

                setAttackMode(null);
                await nextPhase({ gameId, newBoardState, newWallHealths });
                return;
            }

            if (!target || !target.startsWith('p') || target.startsWith(`p${playerIndex}_`)) {
                playSound('error.mp3');
                return;
            }

            // Execute attack (kill target)
            const newBoardState = [...boardState];
            newBoardState[i] = null;
            playSound('sword.mp3');

            setAttackMode(null);
            await nextPhase({ gameId, newBoardState });
            return;
        }

        // Handle Mago Attack
        if (attackMode && attackMode.type === 'mago') {
            if (i === attackMode.attackerIndex) {
                setAttackMode(null);
                return;
            }
            const r1 = Math.floor(attackMode.attackerIndex / 18);
            const c1 = attackMode.attackerIndex % 18;
            const r2 = Math.floor(i / 18);
            const c2 = i % 18;

            const isStraightLine = (r1 === r2 || c1 === c2);
            const distance = Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));

            if (!isStraightLine || distance > 4) {
                playSound('error.mp3');
                return;
            }

            const target = boardState[i];
            const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';

            if (target === enemyCastle) {
                if (window.confirm('¿Quieres lanzar un hechizo al castillo enemigo?')) {
                    const enemyKey = playerIndex === 1 ? 'player2' : 'player1';
                    const currentHealth = castleHealth[enemyKey];
                    const damage = gameConfig.castle.damageReceived.mago;
                    const newHealth = currentHealth - damage;

                    if (newHealth <= 0) {
                        const newCastleHealth = { ...castleHealth, [enemyKey]: 0 };
                        playSound('sword.mp3');
                        const gameRef = doc(db, 'games', gameId);
                        await updateDoc(gameRef, {
                            castleHealth: newCastleHealth,
                            status: 'finished',
                            winner: user.uid
                        });
                        alert('¡Has destruido el castillo enemigo con tu magia y ganado la partida!');
                    } else {
                        const newCastleHealth = { ...castleHealth, [enemyKey]: newHealth };
                        playSound('sword.mp3');
                        alert(`¡Hechizo impactado! Al castillo enemigo le quedan ${newHealth} vidas.`);
                        setAttackMode(null);
                        await nextPhase({ gameId, newCastleHealth });
                    }
                    return;
                }
            }

            if (target === 'muro_piedra') {
                const currentHealth = wallHealths[i] ?? gameConfig.wall.initialHealth;
                const damage = gameConfig.wall.damageReceived.mago;
                const newHealth = currentHealth - damage;
                const newWallHealths = { ...wallHealths };
                const newBoardState = [...boardState];

                if (newHealth <= 0) {
                    delete newWallHealths[i];
                    newBoardState[i] = null;
                    playSound("stone.mp3")
                    //alert('¡Muro destruido por el hechizo!');
                } else {
                    newWallHealths[i] = newHealth;
                    playSound("stone.mp3")
                    //alert(`¡Hechizo al muro! Vida restante: ${newHealth}`);
                }

                setAttackMode(null);
                await nextPhase({ gameId, newBoardState, newWallHealths });
                return;
            }

            if (!target || !target.startsWith('p') || target.startsWith(`p${playerIndex}_`)) {
                playSound('error.mp3');
                return;
            }

            // Execute attack (kill target) - Mago ignores walls
            const newBoardState = [...boardState];
            newBoardState[i] = null;
            playSound('sword.mp3');

            setAttackMode(null);
            await nextPhase({ gameId, newBoardState });
            return;
        }

        // Handle Obrero Attack
        if (attackMode && attackMode.type === 'obrero') {
            if (i === attackMode.attackerIndex) {
                setAttackMode(null);
                return;
            }
            if (!isWithinOneCell(attackMode.attackerIndex, i)) {
                playSound('error.mp3');
                return;
            }

            const target = boardState[i];
            const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';

            if (target === enemyCastle) {
                if (window.confirm('¿Quieres atacar el castillo enemigo con tu pico?')) {
                    const enemyKey = playerIndex === 1 ? 'player2' : 'player1';
                    const currentHealth = castleHealth[enemyKey];
                    const damage = gameConfig.castle.damageReceived.obrero;
                    const newHealth = currentHealth - damage;

                    if (newHealth <= 0) {
                        const newCastleHealth = { ...castleHealth, [enemyKey]: 0 };
                        playSound('sword.mp3');
                        const gameRef = doc(db, 'games', gameId);
                        await updateDoc(gameRef, {
                            castleHealth: newCastleHealth,
                            status: 'finished',
                            winner: user.uid
                        });
                        alert('¡El obrero ha demolido el castillo enemigo! ¡Has ganado!');
                    } else {
                        const newCastleHealth = { ...castleHealth, [enemyKey]: newHealth };
                        playSound('sword.mp3');
                        alert(`¡Gran golpe! Al castillo enemigo le quedan ${newHealth} vidas.`);
                        setAttackMode(null);
                        await nextPhase({ gameId, newCastleHealth });
                    }
                    return;
                }
            }

            if (target === 'muro_piedra') {
                const currentHealth = wallHealths[i] ?? gameConfig.wall.initialHealth;
                const damage = gameConfig.wall.damageReceived.obrero;
                const newHealth = currentHealth - damage;
                const newWallHealths = { ...wallHealths };
                const newBoardState = [...boardState];

                if (newHealth <= 0) {
                    delete newWallHealths[i];
                    newBoardState[i] = null;
                    playSound('stone.mp3');
                } else {
                    newWallHealths[i] = newHealth;
                    playSound('stone.mp3');
                    //alert(`¡Obrero picando el muro! Vida restante: ${newHealth}`);
                }

                setAttackMode(null);
                await nextPhase({ gameId, newBoardState, newWallHealths });
                return;
            }

            if (!target || !target.startsWith('p') || target.startsWith(`p${playerIndex}_`)) {
                playSound('error.mp3');
                return;
            }

            // Execute attack on character
            const newBoardState = [...boardState];
            newBoardState[i] = null;
            playSound('sword.mp3');

            setAttackMode(null);
            await nextPhase({ gameId, newBoardState });
            return;
        }

        if (localSelectedCharacter) {
            // Summoning logic
            const col = i % 18;
            if (playerIndex === 1 && col > 8) {
                playSound('error.mp3');
                return;
            }
            if (playerIndex === 2 && col < 9) {
                playSound('error.mp3');
                return;
            }

            if (boardState[i] !== null) {
                playSound('error.mp3');
                return;
            }

            await handleCharacterPlaced(i);
        } else {
            // Move or Attack logic
            const content = boardState[i];

            if (selectedFrom !== null) {
                // We have a character selected, now we click a target cell
                if (i === selectedFrom) {
                    setSelectedFrom(null); // Deselect
                    return;
                }

                // Restriction: only move 1 cell distance
                if (!isWithinOneCell(selectedFrom, i)) {
                    playSound('error.mp3');
                    setSelectedFrom(null);
                    return;
                }

                // Check if target is enemy castle
                const target = boardState[i];
                const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';

                if (target === enemyCastle) {
                    if (window.confirm('¿Quieres atacar el castillo enemigo?')) {
                        const attacker = boardState[selectedFrom];
                        let damage = gameConfig.castle.damageReceived.default;

                        if (attacker) {
                            if (attacker.endsWith('_obrero')) damage = gameConfig.castle.damageReceived.obrero;
                            else if (attacker.endsWith('_arquero')) damage = gameConfig.castle.damageReceived.arquero;
                            else if (attacker.endsWith('_mago')) damage = gameConfig.castle.damageReceived.mago;
                        }

                        const enemyKey = playerIndex === 1 ? 'player2' : 'player1';
                        const currentHealth = castleHealth[enemyKey];
                        const newHealth = currentHealth - damage;

                        if (newHealth <= 0) {
                            const newBoardState = [...boardState];
                            newBoardState[i] = boardState[selectedFrom];
                            newBoardState[selectedFrom] = null;

                            const newCastleHealth = { ...castleHealth, [enemyKey]: 0 };
                            playSound('sword.mp3');

                            const gameRef = doc(db, 'games', gameId);
                            await updateDoc(gameRef, {
                                boardState: newBoardState,
                                castleHealth: newCastleHealth,
                                status: 'finished',
                                winner: user.uid
                            });
                            alert('¡Has destruido el castillo enemigo y ganado la partida!');
                        } else {
                            const newCastleHealth = { ...castleHealth, [enemyKey]: newHealth };
                            playSound('sword.mp3');
                            alert(`¡Ataque exitoso! Al castillo enemigo le quedan ${newHealth} vidas.`);
                            await nextPhase({ gameId, newCastleHealth });
                        }
                        setSelectedFrom(null);
                        return;
                    }
                }

                // Simple move: any empty cell
                if (target === null) {
                    const newBoardState = [...boardState];
                    newBoardState[i] = boardState[selectedFrom];
                    newBoardState[selectedFrom] = null;
                    setSelectedFrom(null);
                    await nextPhase({ gameId, newBoardState });
                } else {
                    playSound('error.mp3');
                    setSelectedFrom(null);
                }
            } else {
                // Select a character to move or act
                const isOwnCharacter = content && content.startsWith(`p${playerIndex}_`);

                if (isOwnCharacter) {
                    if (content.endsWith('_obrero')) {
                        setSelectedObreroIndex(i);
                        setShowActionModal(true);
                    } else if (content.endsWith('_arquero')) {
                        setSelectedArqueroIndex(i);
                        setShowArqueroModal(true);
                    } else if (content.endsWith('_mago')) {
                        setSelectedMagoIndex(i);
                        setShowMagoModal(true);
                    } else {
                        setSelectedFrom(i);
                    }
                } else if (content && ['madera', 'piedra', 'hierro', 'algodon'].includes(content)) {
                    // Collect resource logic
                    const isResourceDisabled = (disabledResources?.player1 || []).includes(i) || (disabledResources?.player2 || []).includes(i);
                    
                    if (isResourceDisabled) {
                        playSound('error.mp3');
                        return;
                    }

                    if (isObreroNearby(i)) {
                        // Update inventories
                        const newInventories = JSON.parse(JSON.stringify(inventories));
                        const playerKey = playerIndex === 1 ? 'player1' : 'player2';
                        
                        // Get collection amount from config
                        const amount = gameConfig.collectionAmounts[content] || 1;
                        newInventories[playerKey][content] = (newInventories[playerKey][content] || 0) + amount;

                        // Disable resource for the player
                        const newDisabledResources = { ...disabledResources };
                        const listKey = playerIndex === 1 ? 'player1' : 'player2';
                        newDisabledResources[listKey] = [...(newDisabledResources[listKey] || []), i];

                        playSound('collect.mp3');
                        await nextPhase({ gameId, newInventories, newDisabledResources });

                    } else {
                        playSound('error.mp3');
                    }
                } else if (content && content.startsWith('p') && !content.startsWith(`p${playerIndex}_`)) {
                    playSound('error.mp3');
                }
            }
        }
    };

    const handleActionSelect = (action) => {
        setShowActionModal(false);
        if (action === 'move') {
            setSelectedFrom(selectedObreroIndex);
        } else if (action === 'craft') {
            setShowCraftModal(true);
        } else if (action === 'attack') {
            setAttackMode({ type: 'obrero', attackerIndex: selectedObreroIndex });
        }
    };

    const handleArqueroActionSelect = (action) => {
        setShowArqueroModal(false);
        if (action === 'move') {
            setSelectedFrom(selectedArqueroIndex);
        } else if (action === 'attack') {
            setAttackMode({ type: 'arquero', attackerIndex: selectedArqueroIndex });
        }
    };

    const handleMagoActionSelect = (action) => {
        setShowMagoModal(false);
        if (action === 'move') {
            setSelectedFrom(selectedMagoIndex);
        } else if (action === 'attack') {
            setAttackMode({ type: 'mago', attackerIndex: selectedMagoIndex });
        }
    };

    const handleCraftSelect = (craft) => {
        // Check resources
        const playerKey = playerIndex === 1 ? 'player1' : 'player2';
        const playerInv = inventories[playerKey];

        for (const [res, amount] of Object.entries(craft.cost)) {
            if ((playerInv[res] || 0) < amount) {
                playSound('error.mp3');
                return;
            }
        }

        setShowCraftModal(false);
        setCraftingMode({ type: craft.id, workerIndex: selectedObreroIndex });
    };

    const getClassNames = useCallback((i) => {
        const row = Math.floor(i / 18);
        const col = i % 18;
        const isColor1 = (row + col) % 2 === 0;
        const colorCells = isColor1 ? 'color1' : 'color2';
        let extraClasses = '';

        if (craftingMode && isWithinOneCell(craftingMode.workerIndex, i) && boardState[i] === null) {
            extraClasses = ' craft-highlight';
        }

        if (attackMode && attackMode.type === 'arquero') {
            const r1 = Math.floor(attackMode.attackerIndex / 18);
            const c1 = attackMode.attackerIndex % 18;
            const r2 = row;
            const c2 = col;
            const distance = Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));

            if (distance <= 3 && i !== attackMode.attackerIndex && hasLineOfSight(attackMode.attackerIndex, i)) {
                const target = boardState[i];
                const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';
                if (target === 'muro_piedra' || target === enemyCastle || (target && target.startsWith('p') && !target.startsWith(`p${playerIndex}_`))) {
                    extraClasses = ' attack-range-highlight';
                } else {
                    extraClasses = ' range-highlight';
                }
            }
        }

        if (attackMode && attackMode.type === 'mago') {
            const r1 = Math.floor(attackMode.attackerIndex / 18);
            const c1 = attackMode.attackerIndex % 18;
            const r2 = row;
            const c2 = col;

            // Attack in straight line (horizontal or vertical) up to 4 cells
            const isStraightLine = (r1 === r2 || c1 === c2);
            const distance = Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));

            if (isStraightLine && distance <= 4 && i !== attackMode.attackerIndex) {
                const target = boardState[i];
                const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';
                if (target === 'muro_piedra' || target === enemyCastle || (target && target.startsWith('p') && !target.startsWith(`p${playerIndex}_`))) {
                    extraClasses = ' attack-range-highlight';
                } else {
                    extraClasses = ' range-highlight';
                }
            }
        }

        if (attackMode && attackMode.type === 'obrero') {
            const r1 = Math.floor(attackMode.attackerIndex / 18);
            const c1 = attackMode.attackerIndex % 18;
            const r2 = row;
            const c2 = col;
            const distance = Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));

            if (distance <= 1 && i !== attackMode.attackerIndex) {
                const target = boardState[i];
                const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';
                if (target === 'muro_piedra' || target === enemyCastle || (target && target.startsWith('p') && !target.startsWith(`p${playerIndex}_`))) {
                    extraClasses = ' attack-range-highlight';
                } else {
                    extraClasses = ' range-highlight';
                }
            }
        }

        if (selectedFrom !== null && isWithinOneCell(selectedFrom, i) && i !== selectedFrom) {
            if (boardState[i] === null) {
                extraClasses = ' move-highlight';
            } else {
                const target = boardState[i];
                const enemyCastle = playerIndex === 1 ? 'castillo_jugador2' : 'castillo_jugador1';
                if (target === enemyCastle) {
                    extraClasses = ' attack-highlight';
                }
            }
        }

        // Highlight disabled resources
        const isResourceDisabled = (disabledResources?.player1 || []).includes(i) || (disabledResources?.player2 || []).includes(i);
        if (isResourceDisabled) {
            extraClasses += ' resource-disabled';
        }

        return `cell ${colorCells}${extraClasses}`;
    }, [craftingMode, boardState, selectedFrom, playerIndex, attackMode, disabledResources]);

    const getSprite = (i) => {
        if (!boardState[i]) return null;
        let spriteKey = boardState[i];

        // If it's a character with ownership prefix
        if (spriteKey.startsWith('p1_')) {
            spriteKey = spriteKey.substring(3); // e.g. "obrero"
        } else if (spriteKey.startsWith('p2_')) {
            spriteKey = spriteKey.substring(3) + '2'; // e.g. "obrero2"
        }

        const health = wallHealths[i];
        const isWall = boardState[i] === 'muro_piedra';
        const showWallHealth = isWall && health !== undefined && health < 10;
        const isResourceDisabled = (disabledResources?.player1 || []).includes(i) || (disabledResources?.player2 || []).includes(i);

        return (
            <div className="sprite-container" style={{ position: 'relative', width: '100%', height: '100%', opacity: isResourceDisabled ? 0.4 : 1 }}>
                <img className='boardTexture' src={spriteController[spriteKey]} alt={spriteKey} />
                {showWallHealth && (
                    <div className="wall-health-bar-container">
                        <div
                            className="wall-health-bar-fill"
                            style={{ width: `${(health / gameConfig.wall.initialHealth) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        );
    };

    const handleInvokeCharacter = (character) => {
        const inventory = inventories[playerIndex === 1 ? 'player1' : 'player2'];
        const cost = gameConfig.summonCosts[character];

        if (inventory.madera < cost.madera ||
            inventory.piedra < cost.piedra ||
            inventory.hierro < cost.hierro ||
            inventory.algodon < cost.algodon) {
            playSound('error.mp3');
            return;
        }

        setLocalSelectedCharacter(character);
        setShowCharacterModal(false);
    };

    return {
        getClassNames,
        getSprite,
        nextPhase,
        isPlayerTurn,
        handleBoardCellClick,
        isObreroNearby,
        showCharacterModal,
        setShowCharacterModal,
        showActionModal,
        setShowActionModal,
        showCraftModal,
        setShowCraftModal,
        handleActionSelect,
        handleCraftSelect,
        handleArqueroActionSelect,
        handleMagoActionSelect,
        localSelectedCharacter,
        handleInvokeCharacter,
        handleCharacterPlaced,
        boardState,
        selectedFrom,
        craftingMode,
        showArqueroModal,
        setShowArqueroModal,
        showMagoModal,
        setShowMagoModal,
        attackMode,
        gameStatus,
        gameWinner,
        user,
        disabledResources
    }
}
export default useGame;
