const historias = [
  {
    id: 1,
    titulo: 'La última señal',
    resumen: 'Una voz imposible vuelve a llamar en mitad de la noche.',
    portada_url: 'https://picsum.photos/seed/senal/800/400',
    tipo: 'novela',
    autor: { id: 7, nombre: 'Luna Díaz' },
    generos: ['Fantasía', 'Misterio'],
    total_reacciones: 91,
    total_comentarios: 25,
    capitulos: [
      { id: 10, numero: 1, titulo: 'La señal', contenido: 'La radio llevaba seis inviernos en silencio...' },
      { id: 11, numero: 2, titulo: 'La voz', contenido: 'Esa noche la voz dijo su nombre...' },
    ],
  },
  {
    id: 2,
    titulo: 'Dos cafés después',
    resumen: 'Una cafetería, una libreta olvidada y dos desconocidos.',
    portada_url: 'https://picsum.photos/seed/cafe/800/400',
    tipo: 'novela',
    autor: { id: 8, nombre: 'Tomás Pérez' },
    generos: ['Romance'],
    total_reacciones: 64,
    total_comentarios: 12,
    capitulos: [
      { id: 20, numero: 1, titulo: 'La libreta', contenido: 'Nadie deja una libreta así por accidente...' },
    ],
  },
  {
    id: 3,
    titulo: 'La casa de los espejos',
    resumen: 'Cada espejo muestra un recuerdo que nadie vivió.',
    portada_url: 'https://picsum.photos/seed/espejos/800/400',
    tipo: 'corto',
    autor: { id: 9, nombre: 'Sol Martínez' },
    generos: ['Terror'],
    total_reacciones: 40,
    total_comentarios: 7,
    capitulos: [
      { id: 30, numero: 1, titulo: 'La casa de los espejos', contenido: 'El primer espejo estaba en la entrada...' },
    ],
  },
];

export default historias;