import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña para continuar.');
      return;
    }
    // El Context actual simula la autenticación y recibe el correo.
    login(email.trim());
    navigate(location.state?.from || '/perfil', { replace: true });
  };

  return (
    <main>
      <form className="formulario" onSubmit={enviar}>
        <h1>Qué bueno verte de nuevo</h1>
        <p className="formulario-sub">Inicia sesión para seguir leyendo tus historias favoritas.</p>
        {error && <p className="mensaje" role="alert">{error}</p>}
        <label className="campo">
          <span>Correo electrónico</span>
          <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
        </label>
        <label className="campo">
          <span>Contraseña</span>
          <input type="password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" required />
        </label>
        <button className="boton" type="submit">Iniciar sesión</button>
        <p className="aviso-registro">¿Todavía no tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
      </form>
    </main>
  );
};

export default Login;
