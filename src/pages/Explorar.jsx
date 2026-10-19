import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Tabs from "../components/Tabs";
import TarjetaHistoria from "../components/TarjetaHistoria";
import generos from "../data/generos";
import historias from "../data/historias";

const PESTANAS = [
	{ id: "todas", titulo: "Todas" },
	{ id: "novela", titulo: "Novelas por capítulos" },
	{ id: "corto", titulo: "Relatos cortos" },
];

// Pasa un texto a minúsculas y le quita las tildes, para comparar sin importar eso:
// "Señal" -> "senal", "DÍAZ" -> "diaz"
const normalizar = (texto) =>
	texto
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase();

const Explorar = () => {
	// Si venimos desde Inicio con /explorar?genero=Terror, ese género parte seleccionado
	const [searchParams] = useSearchParams();
	const [generosElegidos, setGenerosElegidos] = useState(() => searchParams.getAll("genero"));
	const [busqueda, setBusqueda] = useState("");
	const [pestana, setPestana] = useState("todas");

	// Agrega o quita un género de los elegidos
	const alternarGenero = (genero) => {
		setGenerosElegidos(
			generosElegidos.includes(genero)
				? generosElegidos.filter((g) => g !== genero)
				: [...generosElegidos, genero],
		);
	};

	const limpiarFiltros = () => {
		setGenerosElegidos([]);
		setBusqueda("");
		setPestana("todas");
	};

	// La lista NO se guarda en un estado: se calcula en cada render
	// a partir de la pestaña, el buscador y los géneros elegidos
	const texto = normalizar(busqueda.trim());
	const resultados = historias.filter((historia) => {
		const coincidePestana = pestana === "todas" || historia.tipo === pestana;
		const coincideTexto =
			normalizar(historia.titulo).includes(texto) ||
			normalizar(historia.autor.nombre).includes(texto);
		// Con géneros elegidos, la historia debe tener al menos uno de ellos
		const coincideGenero =
			generosElegidos.length === 0 ||
			historia.generos.some((genero) => generosElegidos.includes(genero));
		return coincidePestana && coincideTexto && coincideGenero;
	});

	return (
		<main>
			<input
				type="search"
				className="buscador"
				placeholder="🔍 Buscar por título o escritor"
				value={busqueda}
				onChange={(e) => setBusqueda(e.target.value)}
			/>

			<div className="explorar-encabezado">
				<h1>Explorar</h1>

				{/* <details> abre y cierra el menú de géneros sin necesidad de estado */}
				<details className="filtro">
					<summary>
						Filtrar{generosElegidos.length > 0 && ` (${generosElegidos.length})`} ▾
					</summary>
					<div className="filtro-opciones">
						{generos.map(({ nombre }) => (
							<label key={nombre}>
								<input
									type="checkbox"
									checked={generosElegidos.includes(nombre)}
									onChange={() => alternarGenero(nombre)}
								/>{" "}
								{nombre}
							</label>
						))}
					</div>
				</details>
			</div>

			<Tabs items={PESTANAS} activa={pestana} onCambiar={setPestana} />

			{resultados.length === 0 ? (
				<div className="mensaje">
					<h2>No encontramos historias</h2>
					<p>Prueba con otra búsqueda, otro género u otra pestaña.</p>
					<button type="button" className="boton-secundario" onClick={limpiarFiltros}>
						Limpiar filtros
					</button>
				</div>
			) : (
				<div className="lista-historias">
					{resultados.map((historia) => (
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
			)}
		</main>
	);
};

export default Explorar;
