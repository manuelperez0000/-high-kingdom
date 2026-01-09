import { useState, createElement } from "react"
import useIcons from "../../hooks/useIcons"
const colorMap = {
    madera: 'brown',
    hierro: 'gray',
    piedra: 'lightgray',
    algodon: 'white',
    hilo: 'white',
    palo: 'brown',
    runa: 'blue', // Asumiendo azul como grimorio
};
const Inventory = () => {

    const { iconMap } = useIcons();

    const [playerInventory] = useState({
        madera: 10,
        hierro: 5,
        piedra: 8,
        algodon: 3,
        hilo: 2,
        palo: 4,
        runa: 1,
    });

    return (<>
        Inventario
        <div className="inventory-compact">
            {Object.keys(playerInventory).map(item => (
                <div key={item} className="inventory-compact-item">
                    {createElement(iconMap[item], { size: 40, color: colorMap[item] || 'white' })}
                    <span>{playerInventory[item]}</span>
                </div>
            ))}
        </div>
    </>
    )
}

export default Inventory
