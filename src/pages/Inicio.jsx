import { Link } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import generos from "../data/generos";
import historias from "../data/historias";

const Inicio = () => {
	return (
		<main>
			<header className="barra-superior barra-inicio">
				<div className="eslogan">
					<h1>
						Detrás de cada historia hay alguien que se atrevió a escribirla, y
						delante, alguien que la va a sentir.
					</h1>
					<p>Letra Viva es el puente entre los dos.</p>
				</div>
				<Link to="/escribir" className="boton-escribir">
					<i className="ti ti-pencil"></i>
					<span>
						<strong>Comparte tu historia</strong>
						<small>
							¨ Escribe lo que sientes. Alguien, en algún lugar, está esperando
							leerlo.
						</small>
					</span>
				</Link>
			</header>
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
			<h1>Géneros</h1>
			<div className="generos">
				{generos.map(({ id, emoji, etiqueta, color }) => (
					<Link
						to="/explorar"
						key={id}
						style={{ "--color": color }}
						className="genero"
					>
						{emoji} {etiqueta}
					</Link>
				))}
			</div>
		</main>
	);
};

export default Inicio;
