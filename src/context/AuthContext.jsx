import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('authUser', JSON.stringify(user));
    else localStorage.removeItem('authUser');
  }, [user]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const loginWithBackend = (username, password) => {
    fetch(`http://localhost:3001/users?username=${username}&password=${password}`)
      .then(res => res.json())
      .then(users => {
        if (users.length > 0) {
          setUser(users[0]); // Set latest user data from backend
        } else {
          setUser(null); // Invalid login
        }
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginWithBackend }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
