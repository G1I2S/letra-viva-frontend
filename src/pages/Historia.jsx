import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import historias from '../data/historias';

const Historia = () => {
  const { id } = useParams();
  const { usuario } = useContext(AuthContext);
  const historia = historias.find((item) => String(item.id) === id);
  const [favorita, setFavorita] = useState(false);
  const [comentarioNuevo, setComentarioNuevo] = useState('');
  const [comentariosLocales, setComentariosLocales] = useState([]);

  useEffect(() => {
    if (!historia) return;

    try {
      const favoritosGuardados = JSON.parse(
        localStorage.getItem('historias-favoritas') || '[]',
      );
      setFavorita(favoritosGuardados.includes(historia.id));

      const comentariosGuardados = JSON.parse(
        localStorage.getItem(`comentarios-historia-${historia.id}`) || '[]',
      );
      setComentariosLocales(Array.isArray(comentariosGuardados) ? comentariosGuardados : []);
    } catch {
      setFavorita(false);
      setComentariosLocales([]);
    }
  }, [historia?.id]);

  if (!historia) {
    return (
      <main>
        <Link className="volver" to="/explorar">
          ← Volver a explorar
        </Link>
        <section className="mensaje">
          <h2>Historia no encontrada</h2>
          <p>Puede que se haya movido o que el enlace no sea correcto.</p>
          <Link className="boton-secundario" to="/explorar">
            Explorar historias
          </Link>
        </section>
      </main>
    );
  }

  const primerCapitulo = historia.capitulos[0];
  const comentariosPrototipo = [
    {
      autor: 'Sol M.',
      fecha: 'hace 3 días',
      texto: 'Ese final me dejó con la piel de gallina. Necesito saber qué había detrás de la puerta.',
    },
    {
      autor: 'Tomás P.',
      fecha: 'hace 1 semana',
      texto: 'La atmósfera está increíble. Sentí que escuchaba la radio junto a Mara.',
    },
    {
      autor: 'Valentina R.',
      fecha: 'hace 2 semanas',
      texto: 'Leí los tres capítulos de una sentada. ¡Por favor que salga el cuarto pronto!',
    },
  ];

  const alternarFavorito = () => {
    try {
      const guardados = JSON.parse(
        localStorage.getItem('historias-favoritas') || '[]',
      );
      const favoritosActualizados = favorita
        ? guardados.filter((favoritoId) => favoritoId !== historia.id)
        : [...guardados.filter((favoritoId) => favoritoId !== historia.id), historia.id];

      localStorage.setItem(
        'historias-favoritas',
        JSON.stringify(favoritosActualizados),
      );
      setFavorita(!favorita);
    } catch {
      // Si el navegador bloquea localStorage, no cambia el estado guardado.
    }
  };

  const agregarComentario = (event) => {
    event.preventDefault();
    const texto = comentarioNuevo.trim();
    if (!texto || !usuario) return;

    const comentario = {
      autor: usuario.nombre || usuario.email || 'Usuario',
      fecha: 'ahora',
      texto,
    };
    const actualizados = [comentario, ...comentariosLocales];
    setComentariosLocales(actualizados);
    setComentarioNuevo('');

    try {
      localStorage.setItem(
        `comentarios-historia-${historia.id}`,
        JSON.stringify(actualizados),
      );
    } catch {
      // El comentario permanece visible mientras la página siga abierta.
    }
  };

  return (
    <main>
      <Link className="volver" to="/explorar">
        ← Volver a explorar
      </Link>

      <section className="ficha">
        <img
          className="ficha-portada"
          src={historia.portada_url}
          alt={`Portada de ${historia.titulo}`}
        />

        <div className="ficha-info">
          <span className="etiqueta">
            {historia.tipo === 'corto' ? 'Relato corto' : 'Novela'}
          </span>
          <h1>{historia.titulo}</h1>
          <p className="autor">
            Por {historia.autor?.nombre || 'Autor desconocido'} · {historia.capitulos.length} capítulos
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
            <span>♡ {historia.total_reacciones ?? 0} reacciones</span>
            <span>💬 {(historia.total_comentarios ?? 0) + comentariosLocales.length} comentarios</span>
            <span>📖 {historia.capitulos.length} capítulos</span>
          </div>

          <div className="ficha-botones">
            {primerCapitulo && (
              <Link
                className="boton"
                to={`/historia/${historia.id}/capitulo/${primerCapitulo.numero}`}
              >
                📖 Empezar a leer
              </Link>
            )}
            <button
              className="boton-borde"
              type="button"
              onClick={alternarFavorito}
              aria-pressed={favorita}
            >
              {favorita ? '♥ Quitar de favoritos' : '♡ Agregar a favoritos'}
            </button>
          </div>
          {!usuario && (
            <p className="fecha">
              <Link to="/login">Inicia sesión</Link> para sincronizar tus favoritos.
            </p>
          )}
        </div>
      </section>

      <section className="seccion" id="capitulos">
        <h2>Capítulos</h2>
        <ol className="capitulos">
          {historia.capitulos.map((capitulo) => (
            <li key={capitulo.id}>
              <Link to={`/historia/${historia.id}/capitulo/${capitulo.numero}`}>
                <span>
                  Capítulo {capitulo.numero} · {capitulo.titulo}
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="seccion" id="comentarios">
        <h2>
          Comentarios ({(historia.total_comentarios ?? 0) + comentariosLocales.length})
        </h2>

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

        {[...comentariosLocales, ...comentariosPrototipo].map((comentario, indice) => (
          <article className="comentario" key={`${comentario.autor}-${comentario.fecha}-${indice}`}>
            <p className="comentario-autor">
              {comentario.autor}{' '}
              <span className="fecha">· {comentario.fecha}</span>
            </p>
            <p>{comentario.texto}</p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Historia;

