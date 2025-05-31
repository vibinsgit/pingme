import { create } from 'zustand';

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("pingme-theme") || "forest", //default value
    setTheme: (theme) => {
        localStorage.setItem("pingme-theme", theme);
        set({ theme });
    },
}));