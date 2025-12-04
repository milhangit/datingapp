import { Link, useLocation } from "wouter";
import { Home, MessageCircle, User, Heart } from "lucide-preact";
import { cn } from "../lib/utils";

export function BottomNav() {
    const [location] = useLocation();

    const navItems = [
        { href: "/app", icon: Home, label: "Discover" },
        { href: "/app/likes", icon: Heart, label: "Likes" },
        { href: "/app/matches", icon: MessageCircle, label: "Matches" },
        { href: "/app/profile", icon: User, label: "Profile" },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe pt-2 px-6 z-50">
            <div className="flex justify-between items-center max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <a className={cn(
                                "flex flex-col items-center gap-1 p-2 transition-all duration-300",
                                isActive ? "text-primary-600 dark:text-primary-400 scale-110" : "text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400"
                            )}>
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </a>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
