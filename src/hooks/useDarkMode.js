import { useState, useEffect } from "react";

export default function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Mengecek apakah sebelumnya user sudah menyimpan preferensi gelap di localStorage
        const saved = localStorage.getItem("darkMode");
        if (saved !== null) {
            return saved === "true";
        }
        // Jika tidak ada di localStorage, cek preferensi OS browser bawaan
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            return true;
        }
        return false;
    });

    useEffect(() => {
        // Menyimpan pilihan ke localStorage
        localStorage.setItem("darkMode", isDarkMode);

        // Menyuntikkan class "dark" ke root elemen <html>
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    return [isDarkMode, toggleDarkMode];
}
