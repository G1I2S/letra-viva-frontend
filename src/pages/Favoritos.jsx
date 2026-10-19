import { useState } from 'react';
import { Link } from 'react-router-dom';
import TarjetaHistoria from '../components/TarjetaHistoria';
import historias from '../data/historias';
import { guardarLista, leerLista } from '../utils/almacenamiento';

const Favoritos = () => {
  // Leemos los ids guardados solo una vez, al crear el estado
  const [favoritos, setFavoritos] = useState(() => leerLista('historias-favoritas'));

  // Buscamos en los datos de prueba las historias cuyos ids están en favoritos.
  // En el Hito 3 esto se reemplaza por axios.get('/api/favoritos')
  const historiasFavoritas = historias.filter((historia) => favoritos.includes(historia.id));

  const quitarFavorito = (id) => {
    const actualizados = favoritos.filter((favoritoId) => favoritoId !== id);
    setFavoritos(actualizados);
    guardarLista('historias-favoritas', actualizados);
  };

  return (
    <main>
      <h1 className="titulo-pagina">Favoritos</h1>

      {historiasFavoritas.length === 0 ? (
        <section className="mensaje">
          <h2>Todavía no tienes favoritos</h2>
          <p>Cuando una historia te guste, guárdala con el botón "Agregar a favoritos".</p>
          <Link className="boton-secundario" to="/explorar">
            Explorar historias
          </Link>
        </section>
      ) : (
        <section className="lista-historias">
          {historiasFavoritas.map(({ id, portada_url, titulo, generos, autor }) => (
            // El botón va fuera de la tarjeta, porque la tarjeta es un Link
            <div className="favorito" key={id}>
              <TarjetaHistoria {...{ id, portada_url, titulo, generos, autor }} />
              <button className="boton-borde" type="button" onClick={() => quitarFavorito(id)}>
                ♥ Quitar de favoritos
              </button>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default Favoritos;
