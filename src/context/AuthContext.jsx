import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Al abrir la app, revisa si había una sesión guardada en el navegador
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  // Cada vez que cambia el usuario, lo guarda (o lo borra) en el navegador
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  // Simulado: en el Hito 3 aquí va axios.post('/api/auth/login', { email, password })
  const login = (email) => {
    setUsuario({ id: 1, nombre: email.split('@')[0], email, avatar_url: null });
  };

  // Simulado: en el Hito 3 aquí va axios.post('/api/auth/registro', ...)
  const registro = (nombre, email) => {
    setUsuario({ id: 1, nombre, email, avatar_url: null });
  };

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
};