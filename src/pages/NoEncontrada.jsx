import { Link } from 'react-router-dom';

// Página para cualquier dirección que no existe (ruta "*" en App.jsx).
// Reutiliza los estilos del aviso de páginas privadas.
const NoEncontrada = () => {
  return (
    <main>
      <div className="aviso-privado">
        <span className="aviso-icono">📭</span>
        <h1>Página no encontrada</h1>
        <p>Esta página no existe o se movió de lugar.</p>
        <Link to="/" className="boton">Volver al inicio</Link>
      </div>
    </main>
  );
};

export default NoEncontrada;
