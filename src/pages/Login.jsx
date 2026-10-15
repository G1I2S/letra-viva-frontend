import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const entrar = () => {
    login('gisela@ejemplo.com');
    navigate('/perfil');
  };

  return (
    <main>
      <h1>Login (prueba)</h1>
      <button className="boton" onClick={entrar}>Entrar de prueba</button>
    </main>
  );
};

export default Login;