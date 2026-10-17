import { useState } from "react";
import Carrusel from "../components/Carrusel";
import Logo from "../components/Logo";
import historias from "../data/historias";

const Inicio = () => {
	const getDesktop = () => window.matchMedia("(min-width: 768px)").matches;
	const [isDesktop, setIsDesktop] = useState(() => getDesktop());
	window.addEventListener("resize", () => {
		setIsDesktop(getDesktop());
	});
	return (
		<main>
			{!isDesktop ? <Logo /> : undefined}
			<h1>Inicio</h1>
			<Carrusel
				items={historias.map(({ id, titulo, portada_url, generos }) => ({
					id,
					props: {
						className: "destacada",
					},
					content: (
						<>
							<img src={portada_url} alt={`Portada de ${titulo}`} />
							<div className="destacada-info">
								<span className="etiqueta">{generos[0]}</span>
								<h1>{titulo}</h1>
							</div>
						</>
					),
				}))}
			/>
		</main>
	);
};

export default Inicio;
