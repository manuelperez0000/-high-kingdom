import { GiWoodStick, GiStoneBlock, GiMetalBar, GiCottonFlower, GiArrowDunk, GiAxeInStump, GiCrossbow, GiHammerBreak, GiPickOfDestiny, GiSewingNeedle, GiSpellBook, GiRam, GiStoneWall } from 'react-icons/gi';

const useIcons = () => {

    const iconMap = {
        algodon: GiCottonFlower,
        madera: GiWoodStick,
        piedra: GiStoneBlock,
        hierro: GiMetalBar,
        hilo: GiSewingNeedle,
        palo: GiWoodStick,
        runa: GiSpellBook,
        flecha_de_madera: GiArrowDunk,
        flecha_de_piedra: GiArrowDunk,
        flecha_de_hierro: GiArrowDunk,
        hacha_de_madera: GiAxeInStump,
        hacha_de_piedra: GiAxeInStump,
        hacha_de_hierro: GiAxeInStump,
        arco_de_madera: GiCrossbow,
        arco_de_hierro: GiCrossbow,
        martillo_de_madera: GiHammerBreak,
        martillo_de_piedra: GiHammerBreak,
        martillo_de_hierro: GiHammerBreak,
        pico_de_madera: GiPickOfDestiny,
        pico_de_piedra: GiPickOfDestiny,
        pico_de_hierro: GiPickOfDestiny,
        asada_de_madera: GiSewingNeedle,
        asada_de_piedra: GiSewingNeedle,
        asada_de_hierro: GiSewingNeedle,
        grimorio: GiSpellBook,
        ariete_de_madera: GiRam,
        ariete_de_piedra: GiRam,
        ariete_de_hierro: GiRam,
        muro_de_piedra: GiStoneWall,
    };

    return { iconMap };

}

export default useIcons;