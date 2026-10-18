import { useContext, useState } from 'react';
import ListaMisHistorias from '../components/ListaMisHistorias';
import { AuthContext } from '../context/AuthContext';
import { guardarLista, leerLista } from '../utils/almacenamiento';

const GENEROS = ['Fantasía', 'Misterio', 'Romance', 'Terror', 'Ciencia ficción', 'Drama', 'Aventura', 'Poesía'];

// Valores iniciales del formulario (también se usan para limpiarlo)
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
  const { usuario } = useContext(AuthContext);
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');
  const [misHistorias, setMisHistorias] = useState(() => leerLista('mis-historias'));

  // Un solo manejador para todos los campos de texto:
  // usa el atributo name del input para saber qué propiedad cambiar
  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Agrega o quita un género de la lista de seleccionados
  const alternarGenero = (genero) => {
    const generos = formulario.generos.includes(genero)
      ? formulario.generos.filter((g) => g !== genero)
      : [...formulario.generos, genero];
    setFormulario({ ...formulario, generos });
  };

  // Devuelve un objeto con los errores encontrados (vacío si todo está bien)
  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio.';
    if (formulario.generos.length === 0) nuevosErrores.generos = 'Elige al menos un género.';
    if (!formulario.capitulo_contenido.trim()) nuevosErrores.contenido = 'El contenido es obligatorio.';
    return nuevosErrores;
  };

  const publicar = (e) => {
    e.preventDefault();
    setExito('');

    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    // Misma forma que las historias de historias.js.
    // En el Hito 3 esto se reemplaza por axios.post('/api/historias', ...)
    const id = Date.now(); // id único simple mientras no haya backend
    const historiaNueva = {
      id,
      titulo: formulario.titulo.trim(),
      resumen: formulario.resumen.trim(),
      portada_url: formulario.portada_url.trim() || null,
      tipo: formulario.tipo,
      autor: { id: usuario.id, nombre: usuario.nombre },
      generos: formulario.generos,
      total_reacciones: 0,
      total_comentarios: 0,
      capitulos: [
        {
          id: id + 1,
          numero: 1,
          titulo: formulario.capitulo_titulo.trim() || formulario.titulo.trim(),
          contenido: formulario.capitulo_contenido.trim(),
        },
      ],
    };

    // La más nueva queda primero
    const actualizadas = [historiaNueva, ...misHistorias];
    setMisHistorias(actualizadas);
    guardarLista('mis-historias', actualizadas);

    setExito(`¡"${historiaNueva.titulo}" fue publicada!`);
    setFormulario(FORMULARIO_VACIO);
  };

  return (
    <main>
      <form className="formulario formulario-ancho" onSubmit={publicar} noValidate>
        <h1>Escribe tu historia</h1>
        <p className="formulario-sub">Publica una novela por capítulos o un relato corto.</p>

        {exito && (
          <p className="mensaje mensaje-exito" role="status">
            {exito}
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
            {GENEROS.map((genero) => (
              <label key={genero} className={formulario.generos.includes(genero) ? 'opcion-genero activa' : 'opcion-genero'}>
                <input
                  type="checkbox"
                  checked={formulario.generos.includes(genero)}
                  onChange={() => alternarGenero(genero)}
                />
                {genero}
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

        <button className="boton" type="submit">Publicar historia</button>
      </form>

      <section className="seccion">
        <h2>Mis historias</h2>
        <ListaMisHistorias historias={misHistorias} />
      </section>
    </main>
  );
};

export default Escribir;
