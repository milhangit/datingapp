import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { X, Heart } from "lucide-preact";

interface Profile {
    id: number;
    full_name: string;
    age: number;
    bio: string;
    photos: string[];
    user_id: number;
}

interface Props {
    profile: Profile;
    onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeCard({ profile, onSwipe }: Props) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color overlays
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing touch-none select-none"
        >
            {/* Image */}
            <div className="absolute inset-0 bg-slate-200">
                <img
                    src={profile.photos[0] || `https://ui-avatars.com/api/?name=${profile.full_name}&size=512`}
                    alt={profile.full_name}
                    className="w-full h-full object-cover pointer-events-none"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            </div>

            {/* Swipe Indicators */}
            <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg]">
                <span className="text-green-500 font-bold text-4xl uppercase tracking-widest">Like</span>
            </motion.div>
            <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg]">
                <span className="text-red-500 font-bold text-4xl uppercase tracking-widest">Nope</span>
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl font-bold font-display shadow-sm">
                    {profile.full_name}, <span className="text-2xl font-normal opacity-90">{profile.age}</span>
                </h2>
                <p className="mt-2 text-lg line-clamp-2 opacity-90">{profile.bio || "No bio yet..."}</p>

                {/* Action Buttons (Visual only, clicks handled by parent usually) */}
                <div className="flex justify-center gap-6 mt-6">
                    <button
                        onClick={(e) => { e.stopPropagation(); onSwipe('left'); }}
                        className="p-4 rounded-full bg-slate-800/50 backdrop-blur-sm text-red-500 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <X size={32} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSwipe('right'); }}
                        className="p-4 rounded-full bg-slate-800/50 backdrop-blur-sm text-green-500 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        <Heart size={32} fill="currentColor" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
