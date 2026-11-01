import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Al abrir la app, recupera la sesión solo si hay usuario Y token guardados
  // (las sesiones simuladas del Hito 3 no tienen token y se descartan)
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    return guardado && token ? JSON.parse(guardado) : null;
  });

  // Cada vez que cambia el usuario, lo guarda (o lo borra) en el navegador
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuario');
    }
  }, [usuario]);

  // Inicia sesión en el backend y guarda el token.
  // Si falla, axios lanza el error y la página lo muestra.
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUsuario(data.usuario);
  };

  // El registro no devuelve token, así que después iniciamos sesión
  const registro = async (nombre, email, password) => {
    await api.post('/auth/registro', { nombre, email, password });
    await login(email, password);
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  // Para que Perfil actualice los datos después de editarlos
  const actualizarUsuario = (datos) => {
    setUsuario((actual) => ({ ...actual, ...datos }));
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
