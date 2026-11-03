import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api, { mensajeError } from "../api";

const Historia = () => {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const [historia, setHistoria] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [favorita, setFavorita] = useState(false);
  const [comentarioNuevo, setComentarioNuevo] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError("");
    const peticiones = [
      api.get(`/historias/${id}`),
      api.get(`/historias/${id}/comentarios`),
    ];
    if (usuario) peticiones.push(api.get("/favoritos"));
    Promise.all(peticiones)
      .then(([ficha, listaComentarios, favoritos]) => {
        if (!activo) return;
        setHistoria(ficha.data);
        setComentarios(
          Array.isArray(listaComentarios.data) ? listaComentarios.data : [],
        );
        if (favoritos)
          setFavorita(
            favoritos.data.some(
              (item) => String(item.historia?.id) === String(id),
            ),
          );
        else setFavorita(Boolean(ficha.data.es_favorito));
      })
      .catch((err) => {
        if (activo) setError(mensajeError(err));
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [id, usuario]);

  const alternarFavorito = async () => {
    try {
      if (favorita) await api.delete(`/favoritos/${id}`);
      else await api.post("/favoritos", { historia_id: Number(id) });
      setFavorita(!favorita);
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  const agregarComentario = async (event) => {
    event.preventDefault();
    const contenido = comentarioNuevo.trim();
    if (!contenido) return;
    try {
      const { data } = await api.post(`/historias/${id}/comentarios`, {
        contenido,
      });
      setComentarios((actuales) => [data, ...actuales]);
      setComentarioNuevo("");
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  if (cargando)
    return (
      <main>
        <p className="mensaje">Cargando historia…</p>
      </main>
    );
  if (!historia)
    return (
      <main>
        <Link className="volver" to="/explorar">
          ← Volver a explorar
        </Link>
        <section className="mensaje">
          <h2>No pudimos cargar la historia</h2>
          <p>
            {error ||
              "Puede que se haya movido o que el enlace no sea correcto."}
          </p>
          <Link className="boton-secundario" to="/explorar">
            Explorar historias
          </Link>
        </section>
      </main>
    );

  const primerCapitulo = historia.capitulos?.[0];
  const capituloActual = historia.capitulo_actual;
  const capituloParaSeguir = capituloActual
    ? historia.capitulos?.find(
        (cap) => Number(cap.numero) === Number(capituloActual),
      )
    : primerCapitulo;
  const total = historia.totales || {};
  const fecha = (valor) =>
    valor ? new Date(valor).toLocaleDateString("es-CL") : "";

  return (
    <main>
      <Link className="volver" to="/explorar">
        ← Volver a explorar
      </Link>
      {error && (
        <p className="mensaje" role="alert">
          {error}
        </p>
      )}
      <section className="ficha">
        <img
          className="ficha-portada"
          src={historia.portada_url}
          alt={`Portada de ${historia.titulo}`}
        />
        <div className="ficha-info">
          <span className="etiqueta">
            {historia.tipo === "corto" ? "Relato corto" : "Novela"}
          </span>
          <h1>{historia.titulo}</h1>
          <p className="autor">
            Por {historia.autor?.nombre || "Autor desconocido"} ·{" "}
            {historia.capitulos?.length || 0}{" "}
            {(historia.capitulos?.length || 0) === 1 ? "capítulo" : "capítulos"}
          </p>
          <div className="generos">
            {historia.generos?.map((genero) => (
              <span className="etiqueta" key={genero}>
                {genero}
              </span>
            ))}
          </div>
          <p className="ficha-resumen">{historia.resumen}</p>
          <div className="reacciones">
            <span>♡ {total.reacciones ?? 0} reacciones</span>
            <span>
              💬 {total.comentarios ?? comentarios.length} comentarios
            </span>
            <span>📖 {total.lecturas ?? 0} lecturas</span>
          </div>
          <div className="ficha-botones">
            {capituloParaSeguir && (
              <Link
                className="boton"
                to={`/historia/${historia.id}/capitulo/${capituloParaSeguir.numero}`}
              >
                📖{" "}
                {capituloActual
                  ? `Continuar leyendo · Cap. ${capituloActual}`
                  : "Empezar a leer"}
              </Link>
            )}
            {usuario ? (
              <button
                className="boton-borde"
                type="button"
                onClick={alternarFavorito}
                aria-pressed={favorita}
              >
                {favorita ? "♥ Quitar de favoritos" : "♡ Agregar a favoritos"}
              </button>
            ) : (
              <Link className="boton-borde" to="/login">
                ♡ Inicia sesión para guardar
              </Link>
            )}
          </div>
        </div>
      </section>

      {historia.tipo === "novela" && (
        <section className="seccion" id="capitulos">
          <h2>Capítulos</h2>
          <ol className="capitulos">
            {historia.capitulos?.map((capitulo) => (
              <li key={capitulo.id}>
                <Link
                  to={`/historia/${historia.id}/capitulo/${capitulo.numero}`}
                >
                  <span>
                    Capítulo {capitulo.numero} · {capitulo.titulo}
                  </span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
      <section className="seccion" id="comentarios">
        <h2>Comentarios ({comentarios.length})</h2>
        {usuario ? (
          <form className="formulario-comentario" onSubmit={agregarComentario}>
            <label className="campo">
              <span>Deja tu comentario</span>
              <textarea
                rows="3"
                value={comentarioNuevo}
                onChange={(event) => setComentarioNuevo(event.target.value)}
                placeholder="¿Qué te pareció esta historia?"
                maxLength={1000}
                required
              />
            </label>
            <button className="boton" type="submit">
              Publicar comentario
            </button>
          </form>
        ) : (
          <Link to="/login" className="comentar-aviso">
            💬 Inicia sesión para dejar tu comentario
          </Link>
        )}
        {comentarios.map((comentario) => (
          <article className="comentario" key={comentario.id}>
            <p className="comentario-autor">
              {comentario.usuario?.nombre || "Lector"}{" "}
              <span className="fecha">· {fecha(comentario.fecha)}</span>
            </p>
            <p>{comentario.contenido}</p>
          </article>
        ))}
        {!comentarios.length && <p>Aún no hay comentarios.</p>}
      </section>
    </main>
  );
};

export default Historia;


