import { useState } from 'react';
import notificaciones from '../data/notificaciones';

// Emoji de cada emoción (los mismos ids que usa el Lector)
const EMOJIS = {
  llorar: '😢',
  sorpresa: '😮',
  risa: '😂',
  fuego: '🔥',
  'corazon-roto': '💔',
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
    return `${usuario} donó $${detalle.toLocaleString('es-CL')} a ${historia}`;
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

  // Ordenamos de la más nueva a la más antigua.
  // Usamos [...notificaciones] para no modificar el arreglo original
  const ordenadas = [...notificaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const visibles =
    filtro === 'todas' ? ordenadas : ordenadas.filter((notificacion) => notificacion.tipo === filtro);

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

      {visibles.length === 0 ? (
        <section className="mensaje">
          <p>No tienes notificaciones de este tipo.</p>
        </section>
      ) : (
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
      )}
    </main>
  );
};

export default Notificaciones;
