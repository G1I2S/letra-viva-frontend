// Pestañas reutilizables. No guardan estado propio: la página que las usa
// decide cuál está activa y qué mostrar (así la lista se calcula en un solo lugar).
// items: [{ id, titulo }], activa: id de la pestaña activa, onCambiar(id): se llama al hacer clic
const Tabs = ({ items, activa, onCambiar }) => {
	return (
		<div className="pestanas">
			{items.map(({ id, titulo }) => (
				<button
					type="button"
					key={id}
					className={id === activa ? "activa" : ""}
					onClick={() => onCambiar(id)}
				>
					{titulo}
				</button>
			))}
		</div>
	);
};

export default Tabs;
