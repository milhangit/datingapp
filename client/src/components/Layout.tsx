import { useEffect, useState } from "preact/hooks";
import { BottomNav } from "./BottomNav";
import { Moon, Sun } from "lucide-preact";

export function Layout({ children, showNav = true }: { children: any, showNav?: boolean }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or local storage
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleDark = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text transition-colors duration-300">
            {/* Header / Top Bar */}
            <header className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    {/* Logo or Brand */}
                    <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">
                        Spark
                    </h1>
                </div>
                <button
                    onClick={toggleDark}
                    className="pointer-events-auto p-2 rounded-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/10 shadow-sm active:scale-95 transition-all"
                >
                    {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-600" />}
                </button>
            </header>

            <main className="pb-24 pt-16 px-4 max-w-md mx-auto min-h-screen relative">
                {children}
            </main>

            {showNav && <BottomNav />}
        </div>
    );
}
