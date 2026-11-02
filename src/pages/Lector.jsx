import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api, { mensajeError } from "../api";

const EMOCIONES = [
  { id: "llorar", emoji: "😢", nombre: "Llorar" },
  { id: "sorpresa", emoji: "😮", nombre: "Sorpresa" },
  { id: "risa", emoji: "😂", nombre: "Risa" },
  { id: "fuego", emoji: "🔥", nombre: "Fuego" },
  { id: "corazon_roto", emoji: "💔", nombre: "Corazón roto" },
];

const Lector = () => {
  const { id, numero } = useParams();
  const { usuario } = useContext(AuthContext);
  const [capitulo, setCapitulo] = useState(null);
  const [reacciones, setReacciones] = useState({});
  const [emocionSeleccionada, setEmocionSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [monto, setMonto] = useState("1000");
  const [mensajeDonacion, setMensajeDonacion] = useState("");

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError("");
    api
      .get(`/historias/${id}/capitulos/${numero}`)
      .then(async ({ data }) => {
        if (!activo) return;
        setCapitulo(data);
        setReacciones(data.reacciones || {});
        setEmocionSeleccionada(data.mi_reaccion || "");
        if (usuario) {
          try {
            await api.put("/lecturas", {
              historia_id: Number(id),
              capitulo_id: data.id,
            });
          } catch (err) {
            if (activo) setError(mensajeError(err));
          }
        }
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
  }, [id, numero, usuario]);

  const manejarReaccion = async (tipo) => {
    if (!usuario || !capitulo) return;
    try {
      if (emocionSeleccionada === tipo) {
        await api.delete(`/capitulos/${capitulo.id}/reacciones`);
        setEmocionSeleccionada("");
        setReacciones((anteriores) => ({
          ...anteriores,
          [tipo]: Math.max(0, (anteriores[tipo] || 0) - 1),
        }));
      } else {
        const { data } = await api.post(
          `/capitulos/${capitulo.id}/reacciones`,
          { tipo },
        );
        setEmocionSeleccionada(tipo);
        setReacciones(data.reacciones || {});
      }
    } catch (err) {
      setError(mensajeError(err));
    }
  };

  const manejarDonacion = async (event) => {
    event.preventDefault();
    const montoNumero = Number(monto);
    if (!usuario) {
      setMensajeDonacion("Inicia sesión para apoyar a quien escribe.");
      return;
    }
    try {
      await api.post("/donaciones", {
        escritor_id: capitulo.historia.autor.id,
        historia_id: Number(id),
        monto: montoNumero,
      });
      setMensajeDonacion("¡Gracias por apoyar a quien escribe!");
    } catch (err) {
      setMensajeDonacion(mensajeError(err));
    }
  };

  if (cargando)
    return (
      <main className="lector">
        <p className="mensaje">Cargando capítulo…</p>
      </main>
    );
  if (!capitulo)
    return (
      <main>
        <Link className="volver" to="/explorar">
          ← Volver a explorar
        </Link>
        <section className="mensaje">
          <h2>Capítulo no encontrado</h2>
          <p>{error || "Revisa el enlace o vuelve a explorar."}</p>
        </section>
      </main>
    );

  const historia = capitulo.historia;
  const parrafos = String(capitulo.contenido || "")
    .split(/\n\s*\n/)
    .filter(Boolean);
  const hrefCapitulo = (n) => `/historia/${id}/capitulo/${n}`;

  return (
    <main className="lector">
      <Link className="volver" to={`/historia/${id}`}>
        ← {historia.titulo}
      </Link>
      {error && (
        <p className="mensaje" role="alert">
          {error}
        </p>
      )}
      <p className="lector-historia">
        Capítulo {capitulo.numero} de {capitulo.total_capitulos}
      </p>
      <h1>{capitulo.titulo}</h1>
      <article className="lector-texto">
        {parrafos.map((parrafo, i) => (
          <p key={`${capitulo.id}-${i}`}>{parrafo}</p>
        ))}
      </article>
      <nav className="navegacion-cap" aria-label="Navegación entre capítulos">
        {capitulo.anterior ? (
          <Link className="boton-borde" to={hrefCapitulo(capitulo.anterior)}>
            ← Anterior
          </Link>
        ) : (
          <span className="boton-borde deshabilitado">← Anterior</span>
        )}
        <Link to={`/historia/${id}`}>Índice</Link>
        {capitulo.siguiente ? (
          <Link className="boton" to={hrefCapitulo(capitulo.siguiente)}>
            Siguiente →
          </Link>
        ) : (
          <span className="boton-borde deshabilitado">Siguiente →</span>
        )}
      </nav>
      {!capitulo.siguiente && (
        <section className="mensaje">
          <h2>¡Llegaste al final!</h2>
          <p>
            Gracias por leer. Puedes volver a la historia para elegir otro
            capítulo.
          </p>
          <Link className="boton-secundario" to={`/historia/${id}`}>
            Volver a la historia
          </Link>
        </section>
      )}
      <section className="seccion">
        <h2>¿Qué te hizo sentir este capítulo?</h2>
        <div className="emociones">
          {EMOCIONES.map((emocion) =>
            usuario ? (
              <button
                key={emocion.id}
                type="button"
                className="emocion"
                style={{ color: "var(--texto)" }}
                aria-pressed={emocionSeleccionada === emocion.id}
                onClick={() => manejarReaccion(emocion.id)}
              >
                <span>{emocion.emoji}</span>
                {emocion.nombre} · {reacciones[emocion.id] || 0}
              </button>
            ) : (
              <Link
                key={emocion.id}
                to="/login"
                className="emocion"
                style={{ color: "var(--texto)" }}
              >
                <span>{emocion.emoji}</span>
                {emocion.nombre} · {reacciones[emocion.id] || 0}
              </Link>
            ),
          )}
        </div>
      </section>
      <section className="donar-caja">
        <p>
          ¿Te gustó este capítulo? Apoya a{" "}
          <strong>
            {historia.autor?.nombre || "quien escribe esta historia"}
          </strong>{" "}
          para que siga escribiendo.
        </p>
        <a className="boton" href="#donar">
          ☕ Donar al escritor
        </a>
      </section>
      <div
        id="donar"
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-donacion"
      >
        <div className="modal-caja">
          <a
            className="cerrar"
            href="#"
            aria-label="Cerrar ventana de donación"
          >
            ✕
          </a>
          <h2 id="titulo-donacion">
            Apoya a {historia.autor?.nombre || "quien escribe"}
          </h2>
          <p className="lector-historia">Elige cuánto quieres donar</p>
          <form onSubmit={manejarDonacion}>
            <div className="montos">
              {["1000", "2000", "5000"].map((valor) => (
                <label className="monto" key={valor}>
                  <input
                    type="radio"
                    name="monto"
                    value={valor}
                    checked={monto === valor}
                    onChange={() => setMonto(valor)}
                  />
                  ${Number(valor).toLocaleString("es-CL")}
                </label>
              ))}
            </div>
            <input
              type="number"
              min="1"
              placeholder="Otro monto"
              value={["1000", "2000", "5000"].includes(monto) ? "" : monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            <button className="boton" type="submit">
              Donar
            </button>
            {mensajeDonacion && (
              <p className="nota" role="status">
                {mensajeDonacion}
              </p>
            )}
            <p className="nota">Modo de prueba: no se cobra dinero real.</p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Lector;

