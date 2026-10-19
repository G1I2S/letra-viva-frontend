import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useEffect, useState } from "react";

const Navbar = () => {
	const getDesktop = () => window.matchMedia("(min-width: 768px)").matches;
	const [isDesktop, setIsDesktop] = useState(() => getDesktop());
	// Escuchamos el cambio de tamaño una sola vez y lo quitamos al desmontar
	// (antes se agregaba un listener nuevo en cada render)
	useEffect(() => {
		const alCambiarTamano = () => setIsDesktop(getDesktop());
		window.addEventListener("resize", alCambiarTamano);
		return () => window.removeEventListener("resize", alCambiarTamano);
	}, []);
	return (
		<nav className="menu">
			{isDesktop ? <Logo /> : undefined}
			<NavbarLink href="/" label="Inicio" icon="home" />
			<NavbarLink href="/favoritos" label="Favoritos" icon="heart" />
			<NavbarLink
				href="/explorar"
				label="Explorar"
				icon="search"
				className="lupa"
			/>
			<NavbarLink href="/notificaciones" label="Notificaciones" icon="bell" />
			<NavbarLink href="/perfil" label="Perfil" icon="user" />
		</nav>
	);
};

const NavbarLink = ({ href, label, icon, className, ...props }) => {
	return (
		<NavLink
			to={href}
			{...props}
			className={({ isActive }) =>
				`${isActive ? "activo" : ""}${className ? ` ${className}` : ""}`
			}
		>
			<i className={`ti ti-${icon}`}></i>
			<span>{label}</span>
		</NavLink>
	);
};

export default Navbar;
