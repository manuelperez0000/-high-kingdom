import { useCallback } from "react";

const useSound = () => {
    return useCallback((soundFile) => {
        const audio = new Audio(`/soundEffects/${soundFile}`);
        audio.play().catch(err => console.log('Error playing sound:', err));
    }, []);
}

export default useSound;
