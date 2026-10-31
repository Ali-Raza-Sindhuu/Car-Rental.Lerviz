const TOKEN_KEY = "revexAccessToken";
const USER_KEY = "revexUser";

export const persistAuth = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearPersistedAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const loadPersistedAuth = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);
  if (!token || !storedUser) return null;

  try {
    const user = JSON.parse(storedUser);
    if (!user || typeof user !== "object" || Array.isArray(user)) {
      clearPersistedAuth();
      return null;
    }
    return { user, token };
  } catch {
    clearPersistedAuth();
    return null;
  }
};
