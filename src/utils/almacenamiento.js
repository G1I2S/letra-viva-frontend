// Funciones para leer y guardar listas en localStorage.
// Usamos try/catch porque localStorage puede fallar (modo privado,
// datos corruptos, etc.) y no queremos que la página se rompa.

export const leerLista = (clave) => {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave) || '[]');
    // Si lo guardado no es un arreglo, lo ignoramos
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
};

export const guardarLista = (clave, lista) => {
  try {
    localStorage.setItem(clave, JSON.stringify(lista));
  } catch {
    // Si no se puede guardar, la lista sigue visible mientras la página esté abierta
  }
};
