import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Perfil = () => {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <main>
      <h1>Hola, {usuario.nombre}</h1>
      <p>{usuario.email}</p>
      <button className="boton" onClick={logout}>Cerrar sesión</button>
    </main>
  );
};

export default Perfil;
