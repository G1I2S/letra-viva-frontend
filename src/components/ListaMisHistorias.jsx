import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { mensajeError } from '../api';

// Lista las historias que el usuario publicó.
// Recibe lo que entrega GET /usuarios/me: [{ id, titulo, portada_url, tipo }]
// y avisa con onEliminada(id) cuando se borra una, para que la página la saque de su estado.
const ListaMisHistorias = ({ historias, onEliminada }) => {
  // Ids de las historias que se están eliminando
  const [eliminando, setEliminando] = useState([]);
  // El error se muestra junto a la historia: { id, mensaje }
  const [error, setError] = useState(null);

  const eliminarHistoria = async (id) => {
    const confirmado = window.confirm(
      '¿Seguro que quieres eliminar esta historia? También se borrarán sus capítulos, comentarios y reacciones. No se puede deshacer.',
    );
    if (!confirmado) return;

    setError(null);
    setEliminando((actuales) => [...actuales, id]);
    try {
      await api.delete(`/historias/${id}`);
      onEliminada(id);
    } catch (err) {
      setError({ id, mensaje: mensajeError(err) });
    } finally {
      setEliminando((actuales) => actuales.filter((actual) => actual !== id));
    }
  };

  if (historias.length === 0) {
    return (
      <div className="mensaje">
        <p>Todavía no has publicado historias.</p>
        <Link className="boton-secundario" to="/escribir">
          Escribir mi primera historia
        </Link>
      </div>
    );
  }

  return (
    <div className="lista-historias">
      {historias.map((historia) => (
        // El botón va fuera de la tarjeta, porque la tarjeta es un Link
        <div className="favorito" key={historia.id}>
          {/* Cada tarjeta lleva a la ficha de la historia */}
          <Link className="tarjeta-historia" to={`/historia/${historia.id}`}>
            <img src={historia.portada_url || '/portada-respaldo.svg'} alt={`Portada para ${historia.titulo}`} />
            <div className="tarjeta-cuerpo">
              <div className="tarjeta-etiquetas">
                <span className="etiqueta">{historia.tipo === 'corto' ? 'Relato corto' : 'Novela'}</span>
              </div>
              <h3>{historia.titulo}</h3>
            </div>
          </Link>

          <div className="favorito-acciones">
            <button
              className="boton-borde"
              type="button"
              onClick={() => eliminarHistoria(historia.id)}
              disabled={eliminando.includes(historia.id)}
            >
              {eliminando.includes(historia.id) ? 'Eliminando…' : 'Eliminar'}
            </button>
          </div>
          {error?.id === historia.id && (
            <small className="error" role="alert">
              {error.mensaje}
            </small>
          )}
        </div>
      ))}
    </div>
  );
};

export default ListaMisHistorias;
