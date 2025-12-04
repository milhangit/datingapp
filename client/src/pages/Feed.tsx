import { useEffect, useState } from "preact/hooks";
import { Layout } from "../components/Layout";
import { SwipeCard } from "../components/SwipeCard";
import { MatchModal } from "../components/MatchModal";
import { api } from "../lib/api";
import { AnimatePresence } from "framer-motion";

export function Feed() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchData, setMatchData] = useState<{ isOpen: boolean; name: string; photo: string } | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.profiles.feed();
            if (data.profiles) {
                setProfiles(data.profiles);
            }
        } catch (e) {
            console.error(e);
            setError("Failed to load profiles. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (direction: 'left' | 'right', profileId: number) => {
        const swipedProfile = profiles.find(p => p.user_id === profileId);

        // Optimistic update
        setProfiles(prev => prev.filter(p => p.user_id !== profileId));

        try {
            const res = await api.actions.swipe(profileId, direction);
            if (res.isMatch && swipedProfile) {
                setMatchData({
                    isOpen: true,
                    name: swipedProfile.full_name,
                    photo: swipedProfile.photos[0] || `https://ui-avatars.com/api/?name=${swipedProfile.full_name}`
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Layout>
            {matchData && (
                <MatchModal
                    isOpen={matchData.isOpen}
                    onClose={() => setMatchData(prev => prev ? { ...prev, isOpen: false } : null)}
                    matchName={matchData.name}
                    matchPhoto={matchData.photo}
                />
            )}
            <div className="relative w-full h-[75dvh] mt-4">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse-slow text-primary-500 font-bold text-xl">Finding your spark...</div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                        <p className="text-slate-500 mb-6">{error}</p>
                        <button onClick={loadProfiles} className="btn-primary">Try Again</button>
                    </div>
                ) : profiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                        <div className="text-6xl mb-4">😴</div>
                        <h3 className="text-xl font-bold mb-2">No more profiles</h3>
                        <p className="text-slate-500 mb-6">Check back later for more matches.</p>
                        <button onClick={loadProfiles} className="btn-primary">Refresh</button>
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        <AnimatePresence>
                            {profiles.map((profile, index) => (
                                // Only render top 2 cards for performance
                                index <= 1 && (
                                    <div key={profile.user_id} className="absolute inset-0" style={{ zIndex: profiles.length - index }}>
                                        <SwipeCard
                                            profile={profile}
                                            onSwipe={(dir) => handleSwipe(dir, profile.user_id)}
                                        />
                                    </div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </Layout>
    );
}
