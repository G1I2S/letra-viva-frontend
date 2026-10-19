import { useState } from "react";
import Tabs from "../components/Tabs";
import TarjetaHistoria from "../components/TarjetaHistoria";
import historias from "../data/historias";

const Explorar = () => {
	return (
		<main>
			<h1>Explorar</h1>
			<Tabs
				items={[
					{
						id: "novelas",
						titulo: "Novelas por capítulos",
						filtro: (historia) => historia.tipo === "novela",
					},
					{
						id: "cortos",
						titulo: "Relatos cortos",
						filtro: (historia) => historia.tipo === "corto",
					},
				]}
				dataset={historias}
				datasetMap={({ id, autor, generos, portada_url, titulo }) => (
					<TarjetaHistoria
						key={id}
						{...{ id, autor, generos, portada_url, titulo }}
					/>
				)}
			/>
		</main>
	);
};

export default Explorar;
