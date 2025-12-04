import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect } from "preact/hooks";
import { MessageCircle } from "lucide-preact";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    matchName: string;
    matchPhoto: string;
}

export function MatchModal({ isOpen, onClose, matchName, matchPhoto }: Props) {
    useEffect(() => {
        if (isOpen) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#8b5cf6', '#f472b6']
            });
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.5, y: 100 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.5, y: 100 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-sm text-center relative overflow-hidden"
                    >
                        {/* Background decoration */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-100/50 to-transparent dark:from-primary-900/20" />

                        <h2 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-600 mb-2 relative z-10">
                            It's a Match!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 relative z-10">
                            You and {matchName} liked each other.
                        </p>

                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-secondary-600 animate-pulse blur-lg opacity-50" />
                            <img
                                src={matchPhoto}
                                alt={matchName}
                                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 relative z-10"
                            />
                        </div>

                        <div className="space-y-3">
                            <button className="btn-primary w-full flex items-center justify-center gap-2">
                                <MessageCircle size={20} />
                                Send a Message
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                                Keep Swiping
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
