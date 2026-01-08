import { motion } from 'framer-motion';

export function LavaLampBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-indigo-50">
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
                className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400/40 rounded-full blur-[100px] mix-blend-multiply filter"
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
                    times: [0, 0.33, 0.66, 1] // Adjust timing slightly
                }}
                className="absolute top-[20%] right-0 w-[400px] h-[400px] bg-cyan-400/40 rounded-full blur-[100px] mix-blend-multiply filter"
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
                className="absolute bottom-0 left-[20%] w-[600px] h-[600px] bg-pink-400/40 rounded-full blur-[120px] mix-blend-multiply filter"
            />
        </div>
    );
}
