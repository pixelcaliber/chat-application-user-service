import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    // Try to retrieve user details from cookies on component mount
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const [user, setUser] = useState(null);
  const [receiver, setReceiver] = useState(null);

  const login = (userData) => {
    setUser(userData);
    // Save user details to cookies
    console.log(userData)
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Remove user details from cookies on logout
    localStorage.clear();
  };

  const setReceiverId = (receiver) => {
    setReceiver(receiver);
    console.log(receiver)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, receiver, setReceiverId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
