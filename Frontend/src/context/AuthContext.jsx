import { createContext, useContext, useEffect, useState } from "react";
import { api, getSession, setSession } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, updateSession] = useState(getSession);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => updateSession(getSession());
    window.addEventListener("lerviz-session-change", sync);
    if (getSession()?.accessToken) {
      api("/auth/me").then(({ data }) => setSession({ ...getSession(), user: data }))
        .catch((error) => { if (error.status === 401) setSession(null); })
        .finally(() => setReady(true));
    } else setReady(true);
    return () => window.removeEventListener("lerviz-session-change", sync);
  }, []);

  async function signIn(email, password) {
    const { data } = await api("/auth/login", { method: "POST", body: { email, password }, auth: false });
    setSession(data);
    return data.user;
  }
  async function signUp(values) {
    await api("/auth/register", { method: "POST", body: values, auth: false });
    return signIn(values.email, values.password);
  }
  async function signOut() {
    const refreshToken = getSession()?.refreshToken;
    if (refreshToken) await api("/auth/logout", { method: "POST", body: { refreshToken }, auth: false }).catch(() => {});
    setSession(null);
  }
  return <AuthContext.Provider value={{ user: session?.user || null, ready, signIn, signUp, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
