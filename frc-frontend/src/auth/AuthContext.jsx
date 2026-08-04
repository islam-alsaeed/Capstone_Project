import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import apiClient from "../api/apiClient";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const clearAuthentication =
    useCallback(() => {
      localStorage.removeItem(
        "accessToken"
      );

      localStorage.removeItem(
        "user"
      );

      setUser(null);
    }, []);

  const saveAuthentication =
    useCallback(
      (
        loginData,
        suppliedUser = null
      ) => {
        let accessToken = null;
        let authenticatedUser =
          suppliedUser;

        if (
          typeof loginData === "string"
        ) {
          accessToken = loginData;
        } else if (
          loginData &&
          typeof loginData === "object"
        ) {
          accessToken =
            loginData.accessToken ||
            loginData.access_token ||
            loginData.token ||
            null;

          authenticatedUser =
            loginData.user ||
            authenticatedUser ||
            null;
        }

        if (!accessToken) {
          throw new Error(
            "The login response did not include an access token."
          );
        }

        localStorage.setItem(
          "accessToken",
          accessToken
        );

        if (authenticatedUser) {
          localStorage.setItem(
            "user",
            JSON.stringify(
              authenticatedUser
            )
          );

          setUser(
            authenticatedUser
          );
        }

        return authenticatedUser;
      },
      []
    );

  const loadCurrentUser =
    useCallback(async () => {
      const accessToken =
        localStorage.getItem(
          "accessToken"
        );

      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response =
          await apiClient.get(
            "/auth/me"
          );

        const currentUser =
          response.data.user ||
          response.data;

        localStorage.setItem(
          "user",
          JSON.stringify(
            currentUser
          )
        );

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Unable to restore authentication:",
          error.response?.data ||
            error
        );

        clearAuthentication();
      } finally {
        setLoading(false);
      }
    }, [clearAuthentication]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(
    async (
      loginData,
      suppliedUser = null
    ) => {
      const savedUser =
        saveAuthentication(
          loginData,
          suppliedUser
        );

      if (savedUser) {
        return savedUser;
      }

      const response =
        await apiClient.get(
          "/auth/me"
        );

      const currentUser =
        response.data.user ||
        response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(
          currentUser
        )
      );

      setUser(currentUser);

      return currentUser;
    },
    [saveAuthentication]
  );

  const logout = useCallback(() => {
    clearAuthentication();
  }, [clearAuthentication]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated:
        Boolean(user),
      login,
      logout,
      refreshUser:
        loadCurrentUser,
    }),
    [
      user,
      loading,
      login,
      logout,
      loadCurrentUser,
    ]
  );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}

export {
  AuthProvider,
  useAuth,
};