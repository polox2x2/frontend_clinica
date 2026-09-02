import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular lectura de sesión desde localStorage
    const savedUser = localStorage.getItem('clinic_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // Simulación de detección de roles basados en el nombre de usuario
    let role = 'PATIENT';
    let name = username || 'Paciente';

    const lowerUser = username.toLowerCase();
    
    if (lowerUser.includes('admin')) {
      role = 'ADMIN';
      name = 'Administrador del Sistema';
    } else if (lowerUser.includes('doc') || lowerUser.includes('medico')) {
      role = 'DOCTOR';
      name = 'Dr. ' + (username.charAt(0).toUpperCase() + username.slice(1));
    }

    const mockUser = {
      id: 1,
      username: username,
      name: name,
      role: role
    };
    
    setUser(mockUser);
    localStorage.setItem('clinic_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinic_user');
  };

  if (loading) return <div>Cargando sesión...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
