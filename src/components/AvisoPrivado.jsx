import { Link } from 'react-router-dom';

const AvisoPrivado = ({ icono, titulo, texto }) => {
  return (
    <main>
      <div className="aviso-privado">
        <span className="aviso-icono">{icono}</span>
        <h1>{titulo}</h1>
        <p>{texto}</p>
        <Link to="/login" className="boton">Iniciar sesión</Link>
        <p className="aviso-registro">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </main>
  );
};

export default AvisoPrivado;