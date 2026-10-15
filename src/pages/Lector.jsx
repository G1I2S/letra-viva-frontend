import { Link, useParams } from 'react-router-dom';
import historias from '../data/historias';

const Lector = () => {
  const { id, numero } = useParams();
  const historia = historias.find((item) => String(item.id) === id);
  const numeroCapitulo = Number(numero);
  const capitulo = historia?.capitulos.find((item) => Number(item.numero) === numeroCapitulo);

  if (!historia || !capitulo || !Number.isInteger(numeroCapitulo)) {
    return <main><Link className="volver" to={historia ? `/historia/${historia.id}` : '/explorar'}>← Volver</Link><section className="mensaje"><h2>Capítulo no encontrado</h2><p>Revisa el enlace o vuelve a la ficha de la historia.</p></section></main>;
  }

  const indice = historia.capitulos.findIndex((item) => item.numero === capitulo.numero);
  const anterior = historia.capitulos[indice - 1];
  const siguiente = historia.capitulos[indice + 1];
  const parrafos = String(capitulo.contenido || '').split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="lector">
      <Link className="volver" to={`/historia/${historia.id}`}>← Ficha de la historia</Link>
      <p className="lector-historia"><Link to={`/historia/${historia.id}`}>{historia.titulo}</Link> · Capítulo {capitulo.numero} de {historia.capitulos.length}</p>
      <h1>{capitulo.titulo}</h1>
      <article className="lector-texto">
        {parrafos.map((parrafo, i) => <p key={`${capitulo.id}-${i}`}>{parrafo}</p>)}
      </article>
      <nav className="navegacion-cap" aria-label="Navegación entre capítulos">
        {anterior ? <Link className="boton-borde" to={`/historia/${historia.id}/capitulo/${anterior.numero}`}>← Anterior</Link> : <span className="boton-borde deshabilitado">← Anterior</span>}
        <Link to={`/historia/${historia.id}`}>Índice</Link>
        {siguiente ? <Link className="boton" to={`/historia/${historia.id}/capitulo/${siguiente.numero}`}>Siguiente →</Link> : <span className="boton-borde deshabilitado">Siguiente →</span>}
      </nav>
      {!siguiente && <section className="mensaje"><h2>¡Llegaste al final!</h2><p>Gracias por leer. Puedes volver a la historia para elegir otro capítulo.</p><Link className="boton-secundario" to={`/historia/${historia.id}`}>Volver a la historia</Link></section>}
    </main>
  );
};

export default Lector;
