import { useEffect } from "react";
import { useRef, useState } from "react";

const Carrusel = ({ items }) => {
	const itemsRef = useRef([]);
	/** @type {import("react").RefObject<HTMLDivElement | null>} */
	const bodyRef = useRef(null);
	const [dots, setDots] = useState([]);
	const updateDots = () => {
		setDots(
			itemsRef.current.map(({ id, ref }) => (
				<span
					key={id}
					className={
						Math.abs(
							ref.getBoundingClientRect().left -
								bodyRef.current.getBoundingClientRect().left,
						) < 10
							? "activo"
							: ""
					}
				/>
			)),
		);
	};
	useEffect(() => {
		updateDots();
	}, []);
	return (
		<div className="carrusel">
			<div
				className="body"
				ref={bodyRef}
				onScrollEnd={() => {
					updateDots();
				}}
			>
				{items.map(({ id, props, content }, index) => (
					<article
						key={id}
						{...props}
						ref={(ref) => {
							itemsRef.current[index] = { id, ref };
						}}
					>
						{content}
					</article>
				))}
			</div>
			<div className="puntos">{dots}</div>
		</div>
	);
};

export default Carrusel;
