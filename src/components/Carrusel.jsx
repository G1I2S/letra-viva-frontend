import { useRef, useState } from "react";

// Carrusel que se desliza hacia el lado.
// items: [{ id, props, content }] -> props va al <article> y content es lo que se muestra dentro
const Carrusel = ({ items }) => {
	const bodyRef = useRef(null);
	// Solo guardamos el número de la diapositiva visible; los puntos se calculan a partir de él
	const [activo, setActivo] = useState(0);

	// Al deslizar, calculamos qué diapositiva está a la vista:
	// cuánto se ha deslizado dividido por el ancho de cada diapositiva
	const actualizarActivo = () => {
		const body = bodyRef.current;
		const anchoDiapositiva = body.scrollWidth / items.length;
		setActivo(Math.round(body.scrollLeft / anchoDiapositiva));
	};

	return (
		<div className="carrusel">
			<div className="body" ref={bodyRef} onScroll={actualizarActivo}>
				{items.map(({ id, props, content }) => (
					<article key={id} {...props}>
						{content}
					</article>
				))}
			</div>
			<div className="puntos">
				{items.map(({ id }, indice) => (
					<span key={id} className={indice === activo ? "activo" : ""} />
				))}
			</div>
		</div>
	);
};

export default Carrusel;
