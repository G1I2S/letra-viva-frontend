import { Link } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import historias from "../data/historias";

const Inicio = () => {
	return (
		<main>
			<h1>Inicio</h1>
			<Carrusel
				items={historias.map(({ id, titulo, portada_url, generos }) => ({
					id,
					props: {
						className: "destacada",
					},
					content: (
						<Link to={`/historia/${id}`}>
							<img src={portada_url} alt={`Portada de ${titulo}`} />
							<div className="destacada-info">
								<span className="etiqueta">{generos[0]}</span>
								<h1>{titulo}</h1>
							</div>
						</Link>
					),
				}))}
			/>
		</main>
	);
};

export default Inicio;
