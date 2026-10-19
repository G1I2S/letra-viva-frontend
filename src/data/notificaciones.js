// Datos de prueba con la misma forma que devolverá GET /notificaciones.
// detalle: monto (donación), texto (comentario) o id de emoción (reacción)
const notificaciones = [
  {
    tipo: 'donacion',
    usuario: 'Tomás P.',
    historia: 'La última señal',
    detalle: 2000,
    fecha: '2026-10-12T15:40:00Z',
  },
  {
    tipo: 'comentario',
    usuario: 'Sol M.',
    historia: 'La última señal',
    detalle: 'Ese final me dejó con la piel de gallina. ¡Quiero el próximo capítulo!',
    fecha: '2026-10-14T09:15:00Z',
  },
  {
    tipo: 'reaccion',
    usuario: 'Valentina R.',
    historia: 'La casa de los espejos',
    detalle: 'fuego',
    fecha: '2026-10-16T22:05:00Z',
  },
  {
    tipo: 'reaccion',
    usuario: 'Martín G.',
    historia: 'Dos cafés después',
    detalle: 'llorar',
    fecha: '2026-10-11T18:30:00Z',
  },
  {
    tipo: 'comentario',
    usuario: 'Camila S.',
    historia: 'Dos cafés después',
    detalle: 'Me encantó la escena de la libreta, muy tierna.',
    fecha: '2026-10-15T13:20:00Z',
  },
  {
    tipo: 'donacion',
    usuario: 'Ignacio L.',
    historia: 'La casa de los espejos',
    detalle: 5000,
    fecha: '2026-10-09T11:00:00Z',
  },
  {
    tipo: 'reaccion',
    usuario: 'Sol M.',
    historia: 'La última señal',
    detalle: 'sorpresa',
    fecha: '2026-10-17T08:45:00Z',
  },
];

export default notificaciones;
