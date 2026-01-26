import { createElement } from "react"
import useIcons from "../../hooks/useIcons"
import useGameStore from "../../store/useGameStore"
import CastleHealthBar from "./CastleHealthBar"

const colorMap = {
    madera: 'brown',
    hierro: 'gray',
    piedra: 'lightgray',
    algodon: 'white',
};

const Inventory = () => {
    const { iconMap } = useIcons();
    const { inventories, playerIndex } = useGameStore();

    // Determine which inventory to show
    const currentPlayerKey = playerIndex === 1 ? 'player1' : 'player2';
    const playerInventory = inventories[currentPlayerKey] || {
        madera: 0,
        hierro: 0,
        piedra: 0,
        algodon: 0
    };

    // Filter only the 4 allowed materials
    const allowedMaterials = ['madera', 'hierro', 'piedra', 'algodon'];

    return (<>
        <div className="medieval-inventory-title">Inventario</div>
        <div className="inventory-compact">
            {allowedMaterials.map(item => (
                <div key={item} className="inventory-compact-item">
                    {iconMap[item] && createElement(iconMap[item], { size: 40, color: colorMap[item] || 'white' })}
                    <span>{playerInventory[item] || 0}</span>
                </div>
            ))}
        </div>
        <CastleHealthBar />
    </>
    )
}

export default Inventory
