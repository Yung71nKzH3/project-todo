import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LavaLampBackground() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'));
                }
            });
        });

        observer.observe(document.documentElement, { attributes: true });
        setIsDark(document.documentElement.classList.contains('dark'));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 bg-background">
            {/* Blob 1 - Pink/Purple */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className={`absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-multiply filter transition-colors duration-1000 ${
                    isDark ? 'bg-purple-900/30' : 'bg-purple-400/40'
                }`}
            />

            {/* Blob 2 - Cyan/Blue */}
            <motion.div
                animate={{
                    x: [0, -70, 40, 0],
                    y: [0, 80, -60, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.33, 0.66, 1]
                }}
                className={`absolute top-[20%] right-0 w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-multiply filter transition-colors duration-1000 ${
                    isDark ? 'bg-indigo-900/30' : 'bg-cyan-400/40'
                }`}
            />

            {/* Blob 3 - Pink/Orange */}
            <motion.div
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -90, 40, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.4, 0.7, 1]
                }}
                className={`absolute bottom-0 left-[20%] w-[700px] h-[700px] rounded-full blur-[140px] mix-blend-multiply filter transition-colors duration-1000 ${
                    isDark ? 'bg-violet-950/30' : 'bg-pink-400/40'
                }`}
            />
        </div>
    );
}
