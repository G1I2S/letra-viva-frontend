import { Link } from "react-router-dom";

const TarjetaHistoria = ({
	id,
	portada_url,
	titulo,
	props,
	generos,
	autor,
	total_reacciones,
	total_comentarios,
}) => {
	return (
		<Link to={`/historia/${id}`} className="tarjeta-historia" {...props}>
			<img src={portada_url} alt={`Portada para ${titulo}`} />
			<div className="tarjeta-cuerpo">
				{/* La key es el género: no se repite dentro de una misma historia */}
				{generos.map((genero) => (
					<span key={genero} className="etiqueta">
						{genero}
					</span>
				))}
				<h3>{titulo}</h3>
				<p className="autor">Por {autor.nombre}</p>
				{/* Reacciones y comentarios: solo si se pasan estas props (son opcionales) */}
				{total_reacciones !== undefined && (
					<div className="reacciones">
						<span>♡ {total_reacciones}</span>
						<span>💬 {total_comentarios ?? 0}</span>
					</div>
				)}
			</div>
		</Link>
	);
};

export default TarjetaHistoria;
