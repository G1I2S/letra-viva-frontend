import { Link } from "react-router-dom";
import Carrusel from "../components/Carrusel";
import TarjetaHistoria from "../components/TarjetaHistoria";
import generos from "../data/generos";
import historias from "../data/historias";

// Cuántos días pasaron desde una fecha, en texto: "hoy", "hace 1 día", "hace 5 días"
const haceCuanto = (fecha) => {
	const dias = Math.floor((Date.now() - new Date(fecha)) / (1000 * 60 * 60 * 24));
	if (dias <= 0) return "hoy";
	if (dias === 1) return "hace 1 día";
	return `hace ${dias} días`;
};

const Inicio = () => {
	// Más populares: copiamos el arreglo ([...]) para no cambiar el original al ordenar,
	// ordenamos por reacciones de mayor a menor y mostramos las 5 primeras
	const populares = [...historias]
		.sort((a, b) => b.total_reacciones - a.total_reacciones)
		.slice(0, 5);

	// Recientes: ordenadas por la fecha de su último capítulo, de la más nueva a la más antigua
	const recientes = [...historias].sort(
		(a, b) =>
			new Date(b.ultimo_capitulo.fecha_publicacion) -
			new Date(a.ultimo_capitulo.fecha_publicacion),
	);

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
					<i className="ti ti-pencil" />
					<span>
						<strong>Comparte tu historia</strong>
						<small>
							Escribe lo que sientes. Alguien, en algún lugar, está esperando
							leerlo.
						</small>
					</span>
				</Link>
			</header>

			<section className="seccion">
				<h2>Más populares</h2>
				<Carrusel
					items={populares.map(({ id, titulo, resumen, portada_url, generos }) => ({
						id,
						props: { className: "destacada" },
						content: (
							<Link to={`/historia/${id}`}>
								<img src={portada_url} alt={`Portada de ${titulo}`} />
								<div className="destacada-info">
									<span className="etiqueta">{generos[0]}</span>
									<h3>{titulo}</h3>
									<p>{resumen}</p>
								</div>
							</Link>
						),
					}))}
				/>
			</section>

			<section className="seccion">
				<h2>Géneros</h2>
				<div className="generos">
					{generos.map(({ nombre, emoji, color }) => (
						// --color es la variable CSS que usa .genero para el fondo
						<Link
							key={nombre}
							to={`/explorar?genero=${encodeURIComponent(nombre)}`}
							className="genero"
							style={{ "--color": color }}
						>
							{emoji} {nombre}
						</Link>
					))}
				</div>
			</section>

			<section className="seccion">
				<h2>Recientes</h2>
				<div className="fila">
					{recientes.map(({ id, titulo, portada_url, tipo, ultimo_capitulo }) => (
						<Link key={id} to={`/historia/${id}`} className="tarjeta-mini">
							<img src={portada_url} alt={`Portada de ${titulo}`} />
							<h3>{titulo}</h3>
							<p>
								{tipo === "corto" ? "Relato corto" : `Cap. ${ultimo_capitulo.numero}`}{" "}
								· {haceCuanto(ultimo_capitulo.fecha_publicacion)}
							</p>
						</Link>
					))}
				</div>
				<Link to="/explorar" className="boton-secundario">
					Descubrir más
				</Link>
			</section>

			<section className="seccion">
				<div className="mensaje">
					<h2>Tu reacción también cuenta ✨</h2>
					<p>
						Cada emoción y comentario ayuda a que nuevas historias y escritores
						sean descubiertos.
					</p>
				</div>
			</section>

			<section className="seccion">
				<h2>Historias para ti</h2>
				<div className="lista-historias">
					{historias.map((historia) => (
						<TarjetaHistoria
							key={historia.id}
							id={historia.id}
							portada_url={historia.portada_url}
							titulo={historia.titulo}
							generos={historia.generos}
							autor={historia.autor}
							total_reacciones={historia.total_reacciones}
							total_comentarios={historia.total_comentarios}
						/>
					))}
				</div>
			</section>
		</main>
	);
};

export default Inicio;
