import axios from 'axios';

// Instancia de axios con la dirección del backend.
// En producción se toma de VITE_API_URL (configurada en Vercel).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Antes de cada petición: si hay token guardado, lo agrega al encabezado
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Después de cada respuesta: si el token venció o es inválido (401),
// cierra la sesión y lleva al login. En /auth/login el 401 significa
// "contraseña incorrecta", así que ahí dejamos que la página muestre el error.
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    const esLogin = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Devuelve el mensaje de error que manda el backend, o uno genérico
// si no hubo respuesta (servidor apagado, sin internet, etc.)
export const mensajeError = (error) => {
  return error.response?.data?.error || 'No pudimos conectar con el servidor. Intenta de nuevo.';
};

export default api;
