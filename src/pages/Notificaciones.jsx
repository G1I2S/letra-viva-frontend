import { useEffect, useState } from 'react';
import api, { mensajeError } from '../api';

// Emoji de cada emoción (los mismos ids que manda el backend)
const EMOJIS = {
  llorar: '😢',
  sorpresa: '😮',
  risa: '😂',
  fuego: '🔥',
  corazon_roto: '💔',
};

// Ícono (Tabler Icons) según el tipo de notificación
const ICONOS = {
  donacion: 'ti-coin',
  comentario: 'ti-message-circle',
  reaccion: 'ti-heart',
};

// Pestañas para filtrar: 'todas' no filtra nada
const FILTROS = [
  { id: 'todas', titulo: 'Todas' },
  { id: 'reaccion', titulo: 'Reacciones' },
  { id: 'comentario', titulo: 'Comentarios' },
  { id: 'donacion', titulo: 'Donaciones' },
];

// Arma el texto de cada notificación según su tipo
const textoNotificacion = ({ tipo, usuario, historia, detalle }) => {
  if (tipo === 'donacion') {
    // toLocaleString('es-CL') agrega el punto de miles: 2000 -> 2.000
    return `${usuario} donó $${Number(detalle).toLocaleString('es-CL')} a ${historia}`;
  }
  if (tipo === 'comentario') {
    return `${usuario} comentó en ${historia}: "${detalle}"`;
  }
  return `${usuario} reaccionó ${EMOJIS[detalle] || '❤️'} a ${historia}`;
};

// Convierte '2026-10-12T15:40:00Z' en algo como '12 de octubre de 2026, 12:40'
const formatearFecha = (fecha) =>
  new Date(fecha).toLocaleString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const Notificaciones = () => {
  const [filtro, setFiltro] = useState('todas');
  // Lista que llega de GET /notificaciones
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Al abrir la página pedimos las notificaciones al backend
  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const { data } = await api.get('/notificaciones');
        setNotificaciones(data);
      } catch (err) {
        setError(mensajeError(err));
      } finally {
        setCargando(false);
      }
    };
    cargarNotificaciones();
  }, []);

  // Ordenamos de la más nueva a la más antigua.
  // Usamos [...notificaciones] para no modificar el arreglo original
  const ordenadas = [...notificaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const visibles =
    filtro === 'todas' ? ordenadas : ordenadas.filter((notificacion) => notificacion.tipo === filtro);

  // Decide qué mostrar debajo de las pestañas
  const contenido = () => {
    if (cargando) return <p className="mensaje">Cargando...</p>;
    if (error) {
      return (
        <p className="mensaje" role="alert">
          No pudimos cargar tus notificaciones. {error}
        </p>
      );
    }
    if (visibles.length === 0) {
      return (
        <section className="mensaje">
          <p>No tienes notificaciones de este tipo.</p>
        </section>
      );
    }
    return (
      <ul className="notificaciones">
        {visibles.map((notificacion, indice) => (
          <li className="notificacion" key={`${notificacion.fecha}-${indice}`}>
            <i className={`ti ${ICONOS[notificacion.tipo]} notificacion-icono`} />
            <div>
              <p>{textoNotificacion(notificacion)}</p>
              <p className="fecha">{formatearFecha(notificacion.fecha)}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <main>
      <h1 className="titulo-pagina">Notificaciones</h1>

      <div className="pestanas">
        {FILTROS.map(({ id, titulo }) => (
          <button
            key={id}
            type="button"
            className={filtro === id ? 'activa' : ''}
            onClick={() => setFiltro(id)}
          >
            {titulo}
          </button>
        ))}
      </div>

      {contenido()}
    </main>
  );
};

export default Notificaciones;
