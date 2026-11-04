import { Link } from 'react-router-dom';

// Lista las historias que el usuario publicó.
// Recibe lo que entrega GET /usuarios/me: [{ id, titulo, portada_url, tipo }]
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
        // Cada tarjeta lleva a la ficha de la historia
        <Link className="tarjeta-historia" to={`/historia/${historia.id}`} key={historia.id}>
          {historia.portada_url && (
            <img src={historia.portada_url} alt={`Portada para ${historia.titulo}`} />
          )}
          <div className="tarjeta-cuerpo">
            <div className="tarjeta-etiquetas">
              <span className="etiqueta">{historia.tipo === 'corto' ? 'Relato corto' : 'Novela'}</span>
            </div>
            <h3>{historia.titulo}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ListaMisHistorias;

