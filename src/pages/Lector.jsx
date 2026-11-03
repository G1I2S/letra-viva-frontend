import { useContext, useEffect, useState } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
  const [mensajeDonacion, setMensajeDonacion] = useState("");
  const [enviandoReaccion, setEnviandoReaccion] = useState(false);
  const [enviandoDonacion, setEnviandoDonacion] = useState(false);
  const reaccionEnCurso = useRef(false);
  const donacionEnCurso = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [numero]);

  useEffect(() => {
    let activo = true;
    setError("");
    api
      .get(`/historias/${id}/capitulos/${numero}`)
      .then(async ({ data }) => {
    Promise.all([
      api.get(`/historias/${id}/capitulos/${numero}`),
      api.get(`/historias/${id}`),
    ])
      .then(async ([{ data }, { data: ficha }]) => {
        if (!activo) return;
        setCapitulo(data);
        setCapitulo({
          ...data,
          historia: { ...data.historia, tipo: ficha.tipo },
        });
        setReacciones(data.reacciones || {});
  const manejarReaccion = async (tipo) => {
    if (!usuario || !capitulo) return;
    if (!usuario || !capitulo || reaccionEnCurso.current) return;
    reaccionEnCurso.current = true;
    setEnviandoReaccion(true);
    try {
      setError(mensajeError(err));
    } finally {
      reaccionEnCurso.current = false;
      setEnviandoReaccion(false);
    }
    event.preventDefault();
    if (donacionEnCurso.current) return;
    const montoNumero = Number(monto);
    }
    donacionEnCurso.current = true;
    setEnviandoDonacion(true);
    try {
      setMensajeDonacion(mensajeError(err));
    } finally {
      donacionEnCurso.current = false;
      setEnviandoDonacion(false);
    }
  const historia = capitulo.historia;
  const puedeDonar = String(usuario?.id) !== String(historia.autor?.id);
  const parrafos = String(capitulo.contenido || "")
      )}
      {historia.tipo !== "corto" && (
      <p className="lector-historia">
        Capítulo {capitulo.numero} de {capitulo.total_capitulos}
      </p>
        <p className="lector-historia">
          Capítulo {capitulo.numero} de {capitulo.total_capitulos}
        </p>
      )}
      <h1>{capitulo.titulo}</h1>
      <nav className="navegacion-cap" aria-label="Navegación entre capítulos">
        {capitulo.anterior ? (
        {historia.tipo !== "corto" && capitulo.anterior ? (
          <Link className="boton-borde" to={hrefCapitulo(capitulo.anterior)}>
          </Link>
        ) : (
        ) : historia.tipo !== "corto" ? (
          <span className="boton-borde deshabilitado">← Anterior</span>
        )}
        ) : null}
        <Link to={`/historia/${id}`}>Índice</Link>
        {capitulo.siguiente ? (
        {historia.tipo !== "corto" && capitulo.siguiente ? (
          <Link className="boton" to={hrefCapitulo(capitulo.siguiente)}>
          </Link>
        ) : (
        ) : historia.tipo !== "corto" ? (
          <span className="boton-borde deshabilitado">Siguiente →</span>
        )}
        ) : null}
      </nav>
                aria-pressed={emocionSeleccionada === emocion.id}
                disabled={enviandoReaccion}
                onClick={() => manejarReaccion(emocion.id)}
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
      {puedeDonar && (
        <>
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
                <button
                  className="boton"
                  type="submit"
                  disabled={enviandoDonacion}
                >
                  {enviandoDonacion ? "Enviando…" : "Donar"}
                </button>
                {mensajeDonacion && (
                  <p className="nota" role="status">
                    {mensajeDonacion}
                  </p>
                )}
                <p className="nota">Modo de prueba: no se cobra dinero real.</p>
              </form>
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
          </div>
        </>
      )}
            <p className="nota">Modo de prueba: no se cobra dinero real.</p>
          </form>
        </div>
      </div>
    </main>

