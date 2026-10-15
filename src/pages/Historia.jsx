import { Link, useParams } from 'react-router-dom';
import historias from '../data/historias';

const Historia = () => {
  const { id } = useParams();
  const historia = historias.find((item) => String(item.id) === id);

  if (!historia) {
    return <main><Link className="volver" to="/explorar">← Volver a explorar</Link><section className="mensaje"><h2>Historia no encontrada</h2><p>Puede que se haya movido o que el enlace no sea correcto.</p><Link className="boton-secundario" to="/explorar">Explorar historias</Link></section></main>;
  }

  const primerCapitulo = historia.capitulos[0];
  return (
    <main>
      <Link className="volver" to="/explorar">← Volver a explorar</Link>
      <section className="ficha">
        <img className="ficha-portada" src={historia.portada_url} alt={`Portada de ${historia.titulo}`} />
        <div className="ficha-info">
          <span className="etiqueta">{historia.tipo === 'corto' ? 'Relato corto' : 'Novela'}</span>
          <h1>{historia.titulo}</h1>
          <p className="autor">Por {historia.autor?.nombre || 'Autor desconocido'}</p>
          <div className="generos">{historia.generos?.map((genero) => <span className="etiqueta" key={genero}>{genero}</span>)}</div>
          <p className="ficha-resumen">{historia.resumen}</p>
          <div className="reacciones"><span>♡ {historia.total_reacciones ?? 0} reacciones</span><span>▢ {historia.total_comentarios ?? 0} comentarios</span><span>📖 {historia.capitulos.length} capítulos</span></div>
          <div className="ficha-botones">
            {primerCapitulo && <Link className="boton" to={`/historia/${historia.id}/capitulo/${primerCapitulo.numero}`}>Comenzar a leer</Link>}
            <a className="boton-borde" href="#capitulos">Ver capítulos</a>
          </div>
        </div>
      </section>
      <section className="seccion" id="capitulos">
        <h2>Capítulos</h2>
        <ul className="capitulos">
          {historia.capitulos.map((capitulo) => (
            <li key={capitulo.id}><Link to={`/historia/${historia.id}/capitulo/${capitulo.numero}`}><span>Capítulo {capitulo.numero}: {capitulo.titulo}</span><span aria-hidden="true">→</span></Link></li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Historia;
