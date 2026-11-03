import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { mensajeError } from "../api";
import Carrusel from "../components/Carrusel";
import TarjetaHistoria from "../components/TarjetaHistoria";
import generosConEstilo from "../data/generos";

const haceCuanto = (fecha) => {
  if (!fecha) return "";
  const dias = Math.floor((Date.now() - new Date(fecha)) / 86400000);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "hace 1 día";
  return `hace ${dias} días`;
};

const Inicio = () => {
  const [populares, setPopulares] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [historias, setHistorias] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    Promise.all([
      api.get("/historias", {
        params: { orden: "populares", pagina: 1, limite: 5 },
      }),
      api.get("/historias", {
        params: { orden: "recientes", pagina: 1, limite: 10 },
      }),
      api.get("/historias", { params: { pagina: 1, limite: 12 } }),
      api.get("/generos"),
    ])
      .then(([pop, rec, todas, listaGeneros]) => {
        if (!activo) return;
        setPopulares(pop.data.historias || []);
        setRecientes(rec.data.historias || []);
        setHistorias(todas.data.historias || []);
        setGeneros(Array.isArray(listaGeneros.data) ? listaGeneros.data : []);
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
  }, []);

  return (
    <main>
      <header className="barra-superior barra-inicio">
        <div className="eslogan">
          <h1>
            Detrás de cada historia hay alguien que se atrevió a escribirla, y
            delante, alguien que la va a sentir.
          </h1>
          <p>Letra Viva es el puente entre los dos.</p>
        </div>
        <Link to="/escribir" className="boton-escribir">
          <i className="ti ti-pencil" />
          <span>
            <strong>Comparte tu historia</strong>
            <small>
              Escribe lo que sientes. Alguien, en algún lugar, está esperando
              leerlo.
            </small>
          </span>
        </Link>
      </header>
      {error && (
        <p className="mensaje" role="alert">
          {error}
        </p>
      )}
      <section className="seccion">
        <h2>Más populares</h2>
        {populares.length ? (
          <Carrusel
            items={populares.map((h) => ({
              id: h.id,
              props: { className: "destacada" },
              content: (
                <Link to={`/historia/${h.id}`}>
                  <img
                    src={h.portada_url || "/portada-respaldo.svg"}
                    alt={`Portada de ${h.titulo}`}
                  />
                  <div className="destacada-info">
                    <span className="etiqueta">
                      {h.generos?.[0] || "Historia"}
                    </span>
                    <h3>{h.titulo}</h3>
                    <p>{h.resumen}</p>
                  </div>
                </Link>
              ),
            }))}
          />
        ) : (
          <p>
            {cargando
              ? "Cargando historias…"
              : "Todavía no hay historias populares."}
          </p>
        )}
      </section>
      <section className="seccion">
        <h2>Géneros</h2>
        <div className="generos">
          {generos.map((g) => {
            const estilo = generosConEstilo.find(
              (item) =>
                item.nombre.toLocaleLowerCase("es") ===
                g.nombre.toLocaleLowerCase("es"),
            );
            const emoji = estilo?.emoji || "";
            const color = estilo?.color || "#6b4f4f";
            return (
              <Link
                key={g.id}
                to={`/explorar?genero=${encodeURIComponent(g.nombre)}`}
                className="genero"
                style={{ "--color": color }}
              >
                {emoji} {g.nombre}
              </Link>
            );
          })}
        </div>
      </section>
      <section className="seccion">
        <h2>Recientes</h2>
        <div className="fila">
          {recientes.map((h) => (
            <Link key={h.id} to={`/historia/${h.id}`} className="tarjeta-mini">
              <img
                src={h.portada_url || "/portada-respaldo.svg"}
                alt={`Portada de ${h.titulo}`}
              />
              <h3>{h.titulo}</h3>
              <p>
                {h.tipo === "corto"
                  ? "Relato corto"
                  : `Cap. ${h.ultimo_capitulo?.numero ?? "—"}`}{" "}
                · {haceCuanto(h.ultimo_capitulo?.fecha_publicacion)}
              </p>
            </Link>
          ))}
        </div>
        <Link to="/explorar" className="boton-secundario">
          Descubrir más
        </Link>
      </section>
      <section className="seccion">
        <div className="mensaje">
          <h2>Tu reacción también cuenta ✨</h2>
          <p>
            Cada emoción y comentario ayuda a que nuevas historias y escritores
            sean descubiertos.
          </p>
        </div>
      </section>
      <section className="seccion">
        <h2>Historias para ti</h2>
        {historias.length ? (
          <div className="lista-historias">
            {historias.map((h) => (
              <TarjetaHistoria
                key={h.id}
                id={h.id}
                portada_url={h.portada_url}
                titulo={h.titulo}
                generos={h.generos || []}
                autor={h.autor}
                total_reacciones={h.total_reacciones}
                total_comentarios={h.total_comentarios}
              />
            ))}
          </div>
        ) : (
          <p>
            {cargando ? "Cargando historias…" : "No hay historias disponibles."}
          </p>
        )}
      </section>
    </main>
  );
};

export default Inicio;

