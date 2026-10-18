import { Link } from "react-router-dom";

const TarjetaHistoria = ({
	id,
	portada_url,
	titulo,
	props,
	generos,
	autor,
}) => {
	return (
		<Link to={`/historia/${id}`} className="tarjeta-historia" {...props}>
			<img src={portada_url} alt={`Portada para ${titulo}`} />
			<div className="tarjeta-cuerpo">
				{generos.map((genero) => (
					<span key={id} className="etiqueta">
						{genero}
					</span>
				))}
				<h3>{titulo}</h3>
				<p className="autor">Por {autor.nombre}</p>
			</div>
		</Link>
	);
};

export default TarjetaHistoria;
