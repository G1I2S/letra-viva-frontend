import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Registro = () => {
  const { registro } = useContext(AuthContext);
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    setError('');
    if (nombre.trim().length < 2) {
      setError('Escribe un nombre de al menos 2 caracteres.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // El Context actual simula el registro y recibe nombre y correo.
    registro(nombre.trim(), email.trim());
    navigate('/perfil', { replace: true });
  };

  return (
    <main>
      <form className="formulario" onSubmit={enviar}>
        <h1>Únete a Letra Viva</h1>
        <p className="formulario-sub">Crea tu cuenta y descubre nuevas historias.</p>
        {error && <p className="mensaje" role="alert">{error}</p>}
        <label className="campo">
          <span>Nombre</span>
          <input type="text" name="nombre" autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Cómo te llamas" minLength={2} required />
        </label>
        <label className="campo">
          <span>Correo electrónico</span>
          <input type="email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
        </label>
        <label className="campo">
          <span>Contraseña</span>
          <input type="password" name="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} placeholder="Mínimo 8 caracteres" required />
        </label>
        <label className="campo">
          <span>Repite tu contraseña</span>
          <input type="password" name="confirmacion" autoComplete="new-password" value={confirmacion} onChange={(e) => setConfirmacion(e.target.value)} minLength={8} placeholder="Confirma tu contraseña" required />
        </label>
        <button className="boton" type="submit">Crear cuenta</button>
        <p className="aviso-registro">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
      </form>
    </main>
  );
};

export default Registro;

