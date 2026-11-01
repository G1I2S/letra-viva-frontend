import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListaMisHistorias from '../components/ListaMisHistorias';
import api, { mensajeError } from '../api';

// Valores iniciales del formulario (también se usan para limpiarlo).
// generos guarda los ids de los géneros elegidos
const FORMULARIO_VACIO = {
  titulo: '',
  resumen: '',
  portada_url: '',
  tipo: 'novela',
  generos: [],
  capitulo_titulo: '',
  capitulo_contenido: '',
};

const Escribir = () => {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [publicando, setPublicando] = useState(false);
  // Historia recién publicada, para el mensaje de éxito con su enlace
  const [publicada, setPublicada] = useState(null);

  // Datos que llegan del backend
  const [generos, setGeneros] = useState([]);
  const [misHistorias, setMisHistorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');

  // Pide mis historias a GET /usuarios/me (se usa al abrir y después de publicar)
  const cargarMisHistorias = async () => {
    const { data } = await api.get('/usuarios/me');
    setMisHistorias(data.historias);
  };

  // Al abrir la página cargamos los géneros y mis historias al mismo tiempo
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [respuestaGeneros] = await Promise.all([api.get('/generos'), cargarMisHistorias()]);
        setGeneros(respuestaGeneros.data);
      } catch (err) {
        setErrorCarga(mensajeError(err));
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, []);

  // Un solo manejador para todos los campos de texto:
  // usa el atributo name del input para saber qué propiedad cambiar
  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Agrega o quita el id de un género de la lista de seleccionados
  const alternarGenero = (id) => {
    const seleccionados = formulario.generos.includes(id)
      ? formulario.generos.filter((g) => g !== id)
      : [...formulario.generos, id];
    setFormulario({ ...formulario, generos: seleccionados });
  };

  // Devuelve un objeto con los errores encontrados (vacío si todo está bien)
  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio.';
    if (formulario.generos.length === 0) nuevosErrores.generos = 'Elige al menos un género.';
    if (!formulario.capitulo_contenido.trim()) nuevosErrores.contenido = 'El contenido es obligatorio.';
    return nuevosErrores;
  };

  const publicar = async (e) => {
    e.preventDefault();
    setPublicada(null);
    setError('');

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setPublicando(true);
    try {
      // a) Creamos la historia
      const { data: historia } = await api.post('/historias', {
        titulo: formulario.titulo.trim(),
        resumen: formulario.resumen.trim(),
        portada_url: formulario.portada_url.trim() || null,
        tipo: formulario.tipo,
        generos: formulario.generos,
      });

      // b) Con el id que devolvió, creamos su primer capítulo
      try {
        await api.post(`/historias/${historia.id}/capitulos`, {
          titulo: formulario.capitulo_titulo.trim() || formulario.titulo.trim(),
          contenido: formulario.capitulo_contenido.trim(),
        });
      } catch (errorCapitulo) {
        // Si el capítulo falla, borramos la historia para que no quede vacía
        await api.delete(`/historias/${historia.id}`).catch(() => {});
        throw errorCapitulo;
      }

      setPublicada({ id: historia.id, titulo: historia.titulo });
      setFormulario(FORMULARIO_VACIO);
      await cargarMisHistorias();
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setPublicando(false);
    }
  };

  if (cargando) {
    return (
      <main>
        <p className="mensaje">Cargando...</p>
      </main>
    );
  }

  if (errorCarga) {
    return (
      <main>
        <p className="mensaje" role="alert">
          No pudimos preparar el formulario. {errorCarga}
        </p>
      </main>
    );
  }

  return (
    <main>
      <form className="formulario formulario-ancho" onSubmit={publicar} noValidate>
        <h1>Escribe tu historia</h1>
        <p className="formulario-sub">Publica una novela por capítulos o un relato corto.</p>

        {publicada && (
          <p className="mensaje mensaje-exito" role="status">
            ¡"{publicada.titulo}" fue publicada! <Link to={`/historia/${publicada.id}`}>Ver mi historia</Link>
          </p>
        )}

        {error && (
          <p className="mensaje" role="alert">
            {error}
          </p>
        )}

        <label className="campo">
          <span>Título *</span>
          <input name="titulo" value={formulario.titulo} onChange={cambiarCampo} placeholder="El nombre de tu historia" />
          {errores.titulo && <small className="error">{errores.titulo}</small>}
        </label>

        <label className="campo">
          <span>Resumen</span>
          <textarea name="resumen" rows="3" value={formulario.resumen} onChange={cambiarCampo} placeholder="¿De qué trata?" />
        </label>

        <label className="campo">
          <span>URL de la portada (opcional)</span>
          <input type="url" name="portada_url" value={formulario.portada_url} onChange={cambiarCampo} placeholder="https://..." />
        </label>

        <label className="campo">
          <span>Tipo</span>
          <select name="tipo" value={formulario.tipo} onChange={cambiarCampo}>
            <option value="novela">Novela por capítulos</option>
            <option value="corto">Relato corto</option>
          </select>
        </label>

        {/* fieldset agrupa los checkbox de géneros */}
        <fieldset className="campo">
          <span>Géneros *</span>
          <div className="opciones-generos">
            {generos.map(({ id, nombre }) => (
              <label key={id} className={formulario.generos.includes(id) ? 'opcion-genero activa' : 'opcion-genero'}>
                <input
                  type="checkbox"
                  checked={formulario.generos.includes(id)}
                  onChange={() => alternarGenero(id)}
                />
                {nombre}
              </label>
            ))}
          </div>
          {errores.generos && <small className="error">{errores.generos}</small>}
        </fieldset>

        <h2 className="formulario-subtitulo">Primer capítulo</h2>

        <label className="campo">
          <span>Título del capítulo</span>
          <input name="capitulo_titulo" value={formulario.capitulo_titulo} onChange={cambiarCampo} placeholder="Capítulo 1" />
        </label>

        <label className="campo">
          <span>Contenido *</span>
          <textarea name="capitulo_contenido" rows="10" value={formulario.capitulo_contenido} onChange={cambiarCampo} placeholder="Había una vez..." />
          {errores.contenido && <small className="error">{errores.contenido}</small>}
        </label>

        <button className="boton" type="submit" disabled={publicando}>
          {publicando ? 'Publicando...' : 'Publicar historia'}
        </button>
      </form>

      <section className="seccion">
        <h2>Mis historias</h2>
        <ListaMisHistorias historias={misHistorias} />
      </section>
    </main>
  );
};

export default Escribir;
