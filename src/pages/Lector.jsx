import { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import historias from '../data/historias';

const EMOCIONES = [
  { id: 'llorar', emoji: '😢', nombre: 'Llorar', total: 24 },
  { id: 'sorpresa', emoji: '😮', nombre: 'Sorpresa', total: 18 },
  { id: 'risa', emoji: '😂', nombre: 'Risa', total: 3 },
  { id: 'fuego', emoji: '🔥', nombre: 'Fuego', total: 37 },
  { id: 'corazon-roto', emoji: '💔', nombre: 'Corazón roto', total: 9 },
];

const Lector = () => {
  const { id, numero } = useParams();
  const { usuario } = useContext(AuthContext);
  const [emocionSeleccionada, setEmocionSeleccionada] = useState('');
  const [montoDonacion, setMontoDonacion] = useState('1000');
  const [montoPersonalizado, setMontoPersonalizado] = useState('');
  const [mensajeDonacion, setMensajeDonacion] = useState('');

  const historia = historias.find((item) => String(item.id) === id);
  const numeroCapitulo = Number(numero);
  const capitulo = historia?.capitulos.find(
    (item) => Number(item.numero) === numeroCapitulo,
  );

  if (!historia || !capitulo || !Number.isInteger(numeroCapitulo)) {
    return (
      <main>
        <Link
          className="volver"
          to={historia ? `/historia/${historia.id}` : '/explorar'}
        >
          ← Volver
        </Link>
        <section className="mensaje">
          <h2>Capítulo no encontrado</h2>
          <p>Revisa el enlace o vuelve a la ficha de la historia.</p>
        </section>
      </main>
    );
  }

  const indice = historia.capitulos.findIndex(
    (item) => item.numero === capitulo.numero,
  );
  const anterior = historia.capitulos[indice - 1];
  const siguiente = historia.capitulos[indice + 1];
  const parrafos = String(capitulo.contenido || '')
    .split(/\n\s*\n/)
    .filter(Boolean);

  const manejarDonacion = (event) => {
    event.preventDefault();
    setMensajeDonacion(
      'Esta es una demostración: no se realizará ningún cobro.',
    );
  };

  return (
    <main className="lector">
      <Link className="volver" to={`/historia/${historia.id}`}>
        ← {historia.titulo}
      </Link>

      <p className="lector-historia">
        Capítulo {capitulo.numero} de {historia.capitulos.length}
      </p>
      <h1>{capitulo.titulo}</h1>

      <article className="lector-texto">
        {parrafos.map((parrafo, indiceParrafo) => (
          <p key={`${capitulo.id}-${indiceParrafo}`}>{parrafo}</p>
        ))}
      </article>

      <nav className="navegacion-cap" aria-label="Navegación entre capítulos">
        {anterior ? (
          <Link
            className="boton-borde"
            to={`/historia/${historia.id}/capitulo/${anterior.numero}`}
          >
            ← Anterior
          </Link>
        ) : (
          <span className="boton-borde deshabilitado">← Anterior</span>
        )}
        <Link to={`/historia/${historia.id}`}>Índice</Link>
        {siguiente ? (
          <Link
            className="boton"
            to={`/historia/${historia.id}/capitulo/${siguiente.numero}`}
          >
            Siguiente →
          </Link>
        ) : (
          <span className="boton-borde deshabilitado">Siguiente →</span>
        )}
      </nav>

      {!siguiente && (
        <section className="mensaje">
          <h2>¡Llegaste al final!</h2>
          <p>Gracias por leer. Puedes volver a la historia para elegir otro capítulo.</p>
          <Link className="boton-secundario" to={`/historia/${historia.id}`}>
            Volver a la historia
          </Link>
        </section>
      )}

      <section className="seccion">
        <h2>¿Qué te hizo sentir este capítulo?</h2>
        <div className="emociones">
          {EMOCIONES.map((emocion) => {
            const seleccionada = emocionSeleccionada === emocion.id;
            const total = emocion.total + (seleccionada ? 1 : 0);

            return usuario ? (
              <button
                key={emocion.id}
                type="button"
                className="emocion"
                aria-pressed={seleccionada}
                onClick={() =>
                  setEmocionSeleccionada(seleccionada ? '' : emocion.id)
                }
              >
                <span>{emocion.emoji}</span>
                {emocion.nombre} · {total}
              </button>
            ) : (
              <Link key={emocion.id} to="/login" className="emocion">
                <span>{emocion.emoji}</span>
                {emocion.nombre} · {emocion.total}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="donar-caja">
        <p>
          ¿Te gustó este capítulo? Apoya a{' '}
          <strong>{historia.autor?.nombre || 'quien escribe esta historia'}</strong>{' '}
          para que siga escribiendo.
        </p>
        <a className="boton" href="#donar">
          ☕ Donar al escritor
        </a>
      </section>

      <div id="donar" className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-donacion">
        <div className="modal-caja">
          <a className="cerrar" href="#" aria-label="Cerrar ventana de donación">
            ✕
          </a>
          <h2 id="titulo-donacion">
            Apoya a {historia.autor?.nombre || 'quien escribe'}
          </h2>
          <p className="lector-historia">Elige cuánto quieres donar</p>

          <form onSubmit={manejarDonacion}>
            <div className="montos">
              {['1000', '2000', '5000'].map((monto) => (
                <label className="monto" key={monto}>
                  <input
                    type="radio"
                    name="monto"
                    value={monto}
                    checked={montoDonacion === monto}
                    onChange={() => setMontoDonacion(monto)}
                  />
                  ${Number(monto).toLocaleString('es-CL')}
                </label>
              ))}
            </div>

            <input
              type="number"
              min="1"
              placeholder="Otro monto"
              value={montoPersonalizado}
              onChange={(event) => {
                setMontoPersonalizado(event.target.value);
                if (event.target.value) setMontoDonacion('');
              }}
            />
            <button className="boton" type="submit">
              Donar
            </button>
            {mensajeDonacion && <p className="nota">{mensajeDonacion}</p>}
            <p className="nota">Modo de prueba: no se cobra dinero real.</p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Lector;
