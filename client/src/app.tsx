import { Route, Switch, Redirect } from "wouter";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Feed } from "./pages/Feed";
import { AdminDashboard } from "./pages/AdminDashboard";
import { useState, useEffect } from "preact/hooks";
import { api } from "./lib/api";

const Matches = () => <Layout><h1 className="text-2xl font-bold p-4">Matches</h1><p className="px-4">No matches yet.</p></Layout>;
const Profile = () => <Layout><h1 className="text-2xl font-bold p-4">Profile</h1><p className="px-4">Your profile settings.</p></Layout>;

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.auth.me();
      setIsAuthenticated(!!res.user);
    } catch {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-900"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div></div>;
  }

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/app" /> : <Login />}
      </Route>

      <Route path="/app" nest>
        {isAuthenticated ? (
          <Switch>
            <Route path="/" component={Feed} />
            <Route path="/matches" component={Matches} />
            <Route path="/profile" component={Profile} />
            <Route path="/admin" component={AdminDashboard} />
          </Switch>
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      <Route path="/">
        <Redirect to={isAuthenticated ? "/app" : "/login"} />
      </Route>
    </Switch>
  );
}
