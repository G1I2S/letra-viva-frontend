import { Link } from 'react-router-dom';

// Lista las historias que el usuario publicó (guardadas en 'mis-historias').
// No usamos TarjetaHistoria porque esa tarjeta es un Link a /historia/:id
// y la página de historia todavía no conoce las historias guardadas localmente.
const ListaMisHistorias = ({ historias }) => {
  if (historias.length === 0) {
    return (
      <div className="mensaje">
        <p>Todavía no has publicado historias.</p>
        <Link className="boton-secundario" to="/escribir">
          Escribir mi primera historia
        </Link>
      </div>
    );
  }

  return (
    <div className="lista-historias">
      {historias.map((historia) => (
        <article className="tarjeta-historia" key={historia.id}>
          {historia.portada_url && (
            <img src={historia.portada_url} alt={`Portada para ${historia.titulo}`} />
          )}
          <div className="tarjeta-cuerpo">
            <div className="tarjeta-etiquetas">
              <span className="etiqueta">{historia.tipo === 'corto' ? 'Relato corto' : 'Novela'}</span>
              {historia.generos.map((genero) => (
                <span className="etiqueta" key={genero}>
                  {genero}
                </span>
              ))}
            </div>
            <h3>{historia.titulo}</h3>
            {historia.resumen && <p className="autor">{historia.resumen}</p>}
            <p className="fecha">
              {historia.capitulos.length} capítulo · Cap. 1: {historia.capitulos[0].titulo}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
};

export default ListaMisHistorias;
