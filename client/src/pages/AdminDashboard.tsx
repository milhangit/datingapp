import { useEffect, useState } from "preact/hooks";
import { api } from "../lib/api";

export function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [page]);

    const loadData = async () => {
        setLoading(true);
        try {
            const statsRes = await api.admin.stats();
            setStats(statsRes);
            const usersRes = await api.admin.users(page);
            setUsers(usersRes.users);
            setTotalPages(usersRes.totalPages);
        } catch (e) {
            console.error("Failed to load admin data", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId: number, action: string, value?: any) => {
        try {
            await api.admin.action(userId, action, value);
            loadData(); // Refresh data
        } catch (e) {
            alert("Action failed");
        }
    };

    if (loading && !stats) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
            <div className="flex h-screen">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-4 hidden md:block">
                    <h1 className="text-xl font-bold mb-8 text-primary-500">Admin Panel</h1>
                    <nav className="space-y-2">
                        <a href="#" className="block px-4 py-2 rounded bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium">Dashboard</a>
                        <a href="/app" className="block px-4 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700">Back to App</a>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-8">
                    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</h3>
                            <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Matches</h3>
                            <p className="text-3xl font-bold mt-2">{stats?.totalMatches || 0}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Reports</h3>
                            <p className="text-3xl font-bold mt-2">{stats?.totalReports || 0}</p>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-bold">User Management</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">ID</th>
                                        <th className="px-6 py-4 font-medium">Phone</th>
                                        <th className="px-6 py-4 font-medium">Name</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">{user.id}</td>
                                            <td className="px-6 py-4">{user.msisdn}</td>
                                            <td className="px-6 py-4">{user.full_name || '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    {user.is_verified ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Verified</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Unverified</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleAction(user.id, 'verify', !user.is_verified)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                >
                                                    {user.is_verified ? 'Unverify' : 'Verify'}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, 'ban')} // Assuming ban sets auth_state to banned
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium"
                                                >
                                                    Ban
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>Page {page} of {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
