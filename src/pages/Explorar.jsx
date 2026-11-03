import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { mensajeError } from "../api";
import Tabs from "../components/Tabs";
import TarjetaHistoria from "../components/TarjetaHistoria";

const PESTANAS = [
  { id: "todas", titulo: "Todas" },
  { id: "novela", titulo: "Novelas por capítulos" },
  { id: "corto", titulo: "Relatos cortos" },
];

const Explorar = () => {
  const [searchParams] = useSearchParams();
  const [generos, setGeneros] = useState([]);
  const [generosElegidos, setGenerosElegidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const [pestana, setPestana] = useState("todas");
  const [historias, setHistorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const temporizador = setTimeout(() => setBusquedaAplicada(busqueda), 400);
    return () => clearTimeout(temporizador);
  }, [busqueda]);

  useEffect(() => {
    let activo = true;
    api
      .get("/generos")
      .then(({ data }) => {
        if (!activo) return;
        const lista = Array.isArray(data) ? data : [];
        setGeneros(lista);
        const nombresIniciales = searchParams.getAll("genero");
        setGenerosElegidos(
          lista
            .filter((g) => nombresIniciales.includes(g.nombre))
            .map((g) => g.id),
        );
      })
      .catch((err) => {
        if (activo) setError(mensajeError(err));
      });
    return () => {
      activo = false;
    };
  }, [searchParams]);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError("");
    const params = { pagina, limite: 12 };
    if (pestana !== "todas") params.tipo = pestana;
    if (generosElegidos.length) params.generos = generosElegidos.join(",");
    if (busquedaAplicada.trim()) params.buscar = busquedaAplicada.trim();
    api
      .get("/historias", { params })
      .then(({ data }) => {
        if (!activo) return;
        setHistorias(data.historias || []);
        setTotal(data.total || 0);
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
  }, [busquedaAplicada, pestana, generosElegidos, pagina]);

  const alternarGenero = (id) => {
    setPagina(1);
    setGenerosElegidos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((g) => g !== id)
        : [...actuales, id],
    );
  };
  const limpiarFiltros = () => {
    setGenerosElegidos([]);
    setBusqueda("");
    setPestana("todas");
    setPagina(1);
  };

  return (
    <main>
      <input
        type="search"
        className="buscador"
        placeholder="🔍 Buscar por título o escritor"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPagina(1);
        }}
      />
      <div className="explorar-encabezado">
        <h1>Explorar</h1>
        <details className="filtro">
          <summary>
            Filtrar
            {generosElegidos.length > 0 && ` (${generosElegidos.length})`} ▾
          </summary>
          <div className="filtro-opciones">
            {generos.map((g) => (
              <label key={g.id}>
                <input
                  type="checkbox"
                  checked={generosElegidos.includes(g.id)}
                  onChange={() => alternarGenero(g.id)}
                />{" "}
                {g.nombre}
              </label>
            ))}
          </div>
        </details>
      </div>
      <Tabs
        items={PESTANAS}
        activa={pestana}
        onCambiar={(id) => {
          setPestana(id);
          setPagina(1);
        }}
      />
      {error && (
        <p className="mensaje" role="alert">
          {error}
        </p>
      )}
      {cargando ? (
        <p className="mensaje">Buscando historias…</p>
      ) : historias.length === 0 ? (
        <div className="mensaje">
          <h2>No encontramos historias</h2>
          <p>Prueba con otra búsqueda, otro género u otra pestaña.</p>
          <button
            type="button"
            className="boton-secundario"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
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
          <nav className="navegacion-cap" aria-label="Paginación">
            <button
              className="boton-borde"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => p - 1)}
            >
              ← Anterior
            </button>
            <span>
              Página {pagina} · {total} historias
            </span>
            <button
              className="boton-borde"
              disabled={pagina * 12 >= total}
              onClick={() => setPagina((p) => p + 1)}
            >
              Siguiente →
            </button>
          </nav>
        </>
      )}
    </main>
  );
};

export default Explorar;


