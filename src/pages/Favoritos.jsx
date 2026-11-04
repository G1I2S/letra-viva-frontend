import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { mensajeError } from "../api";

// Texto del progreso de lectura de cada favorito
const textoProgreso = (capitulo_actual, total_capitulos) => {
  if (!capitulo_actual) return "Todavía no empiezas";
  return `Vas en el capítulo ${capitulo_actual.numero} de ${total_capitulos}`;
};

const Favoritos = () => {
  // Lista que llega de GET /favoritos
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  // Id de la historia que se está quitando (null si ninguna), para evitar el doble clic
  const [quitando, setQuitando] = useState(null);

  // Al abrir la página pedimos los favoritos al backend
  useEffect(() => {
    const cargarFavoritos = async () => {
      try {
        const { data } = await api.get("/favoritos");
        setFavoritos(data);
      } catch (err) {
        setError(mensajeError(err));
      } finally {
        setCargando(false);
      }
    };
    cargarFavoritos();
  }, []);

  // Borra el favorito en el backend y lo saca de la lista sin recargar
  const quitarFavorito = async (historiaId) => {
    setError("");
    setQuitando(historiaId);
    try {
      await api.delete(`/favoritos/${historiaId}`);
      setFavoritos(
        favoritos.filter((favorito) => favorito.historia.id !== historiaId),
      );
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setQuitando(null);
    }
  };

  return (
    <main>
      <h1 className="titulo-pagina">Favoritos</h1>

      {error && (
        <p className="mensaje" role="alert">
          Algo salió mal con tus favoritos. {error}
        </p>
      )}

      {cargando ? (
        <p className="mensaje">Cargando...</p>
      ) : favoritos.length === 0 && !error ? (
        <section className="mensaje">
          <h2>Todavía no tienes favoritos</h2>
          <p>
            Cuando una historia te guste, guárdala con el botón "Agregar a
            favoritos".
          </p>
          <Link className="boton-secundario" to="/explorar">
            Explorar historias
          </Link>
        </section>
      ) : (
        <section className="lista-historias">
          {favoritos.map(({ historia, capitulo_actual, total_capitulos }) => (
            // Los botones van fuera de la tarjeta, porque la tarjeta es un Link
            <div className="favorito" key={historia.id}>
              <Link
                className="tarjeta-historia"
                to={`/historia/${historia.id}`}
              >
                <img
                  src={historia.portada_url || "/portada-respaldo.svg"}
                  alt={`Portada para ${historia.titulo}`}
                />
                <div className="tarjeta-cuerpo">
                  <h3>{historia.titulo}</h3>
                  <p className="autor">
                    {textoProgreso(capitulo_actual, total_capitulos)}
                  </p>
                </div>
              </Link>

              <div className="favorito-acciones">
                {/* Si ya empezó, sigue en su capítulo; si no, parte en el 1 */}
                {total_capitulos > 0 && (
                  <Link
                    className="boton-secundario"
                    to={`/historia/${historia.id}/capitulo/${capitulo_actual ? capitulo_actual.numero : 1}`}
                  >
                    {capitulo_actual ? "Seguir leyendo" : "Empezar a leer"}
                  </Link>
                )}
                <button
                  className="boton-borde"
                  type="button"
                  onClick={() => quitarFavorito(historia.id)}
                  disabled={quitando === historia.id}
                >
                  ♥ Quitar de favoritos
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default Favoritos;

