export const getClassNames = (i) => {
        const row = Math.floor(i / 18);
        const col = i % 18;
        const isColor1 = (row + col) % 2 === 0;
        const colorCells = isColor1 ? 'color1' : 'color2';
        return `cell ${colorCells}`;
    }