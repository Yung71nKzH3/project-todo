import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LavaLampBackground() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none transition-colors duration-700 bg-background">
            {/* Ambient center backlight */}
            <div 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[160px] transition-all duration-1000 ${
                    isDark 
                        ? 'bg-violet-600/25 mix-blend-screen' 
                        : 'bg-violet-300/30 mix-blend-multiply'
                }`}
            />

            {/* Blob 1 - Purple/Fuchsia (Top Left) */}
            <motion.div
                animate={{
                    x: [0, 90, -40, 0],
                    y: [0, -80, 60, 0],
                    scale: [1, 1.25, 0.9, 1],
                    borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "60% 40% 30% 70% / 50% 30% 70% 40%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute top-[-5%] left-[-5%] w-[580px] h-[580px] blur-[100px] transition-all duration-1000 ${
                    isDark
                        ? 'bg-gradient-to-tr from-purple-600/70 via-fuchsia-600/60 to-violet-500/60 mix-blend-screen'
                        : 'bg-gradient-to-tr from-purple-400/50 via-purple-300/45 to-fuchsia-300/40 mix-blend-multiply'
                }`}
            />

            {/* Blob 2 - Cyan/Teal (Top Right) */}
            <motion.div
                animate={{
                    x: [0, -80, 50, 0],
                    y: [0, 90, -50, 0],
                    scale: [1, 1.15, 0.85, 1],
                    borderRadius: ["50% 50% 30% 70% / 50% 70% 30% 60%", "30% 70% 60% 40% / 60% 40% 70% 30%", "50% 50% 30% 70% / 50% 70% 30% 60%"]
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute top-[10%] right-[-10%] w-[520px] h-[520px] blur-[110px] transition-all duration-1000 ${
                    isDark
                        ? 'bg-gradient-to-bl from-cyan-400/60 via-teal-500/55 to-blue-600/60 mix-blend-screen'
                        : 'bg-gradient-to-bl from-cyan-300/55 via-sky-300/50 to-teal-200/45 mix-blend-multiply'
                }`}
            />

            {/* Blob 3 - Hot Pink/Coral (Bottom Left) */}
            <motion.div
                animate={{
                    x: [0, 70, -60, 0],
                    y: [0, -100, 40, 0],
                    scale: [1, 1.2, 0.95, 1],
                    borderRadius: ["60% 40% 50% 50% / 40% 60% 50% 60%", "40% 60% 30% 70% / 60% 30% 70% 40%", "60% 40% 50% 50% / 40% 60% 50% 60%"]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute bottom-[-10%] left-[10%] w-[620px] h-[620px] blur-[120px] transition-all duration-1000 ${
                    isDark
                        ? 'bg-gradient-to-tl from-pink-600/65 via-rose-500/60 to-purple-600/55 mix-blend-screen'
                        : 'bg-gradient-to-tl from-pink-400/50 via-rose-300/45 to-purple-300/40 mix-blend-multiply'
                }`}
            />

            {/* Blob 4 - Warm Amber/Sunburst (Bottom Right) */}
            <motion.div
                animate={{
                    x: [0, -60, 40, 0],
                    y: [0, -70, 50, 0],
                    scale: [0.9, 1.2, 1, 0.9],
                    borderRadius: ["50% 50% 70% 30% / 30% 50% 70% 60%", "70% 30% 50% 50% / 60% 40% 50% 40%", "50% 50% 70% 30% / 30% 50% 70% 60%"]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute bottom-[5%] right-[-5%] w-[480px] h-[480px] blur-[110px] transition-all duration-1000 ${
                    isDark
                        ? 'bg-gradient-to-r from-amber-500/45 via-orange-500/40 to-pink-500/45 mix-blend-screen'
                        : 'bg-gradient-to-r from-amber-300/45 via-orange-200/40 to-pink-300/35 mix-blend-multiply'
                }`}
            />

            {/* Floating Lava Droplet 1 (Rises & Sinks) */}
            <motion.div
                animate={{
                    y: [120, -180, 120],
                    x: [-30, 40, -30],
                    scale: [0.8, 1.15, 0.8],
                }}
                transition={{
                    duration: 14,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute top-[40%] left-[30%] w-[180px] h-[220px] rounded-full blur-[60px] transition-all duration-1000 ${
                    isDark
                        ? 'bg-fuchsia-500/50 mix-blend-screen'
                        : 'bg-purple-400/35 mix-blend-multiply'
                }`}
            />

            {/* Floating Lava Droplet 2 (Cooling & Sinking) */}
            <motion.div
                animate={{
                    y: [-140, 160, -140],
                    x: [40, -30, 40],
                    scale: [1.1, 0.85, 1.1],
                }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`absolute top-[35%] right-[25%] w-[200px] h-[190px] rounded-full blur-[65px] transition-all duration-1000 ${
                    isDark
                        ? 'bg-cyan-400/45 mix-blend-screen'
                        : 'bg-cyan-300/35 mix-blend-multiply'
                }`}
            />
        </div>
    );
}
