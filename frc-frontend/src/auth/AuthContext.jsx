import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await apiClient.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const {
      accessToken,
      user: loggedInUser,
    } = response.data;

    localStorage.setItem(
      "accessToken",
      accessToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return loggedInUser;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem(
        "accessToken"
      );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await apiClient.get("/auth/me");
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}