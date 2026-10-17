import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useState } from "react";

const Navbar = () => {
	const getDesktop = () => window.matchMedia("(min-width: 768px)").matches;
	const [isDesktop, setIsDesktop] = useState(() => getDesktop());
	window.addEventListener("resize", () => {
		setIsDesktop(getDesktop());
	});
	return (
		<nav className="menu">
			{isDesktop ? <Logo /> : undefined}
			<NavbarLink href="/" label="Inicio" icon="home" />
			<NavbarLink href="/explorar" label="Explorar" icon="search" />
			<NavbarLink href="/favoritos" label="Favoritos" icon="heart" />
			<NavbarLink href="/notificaciones" label="Notificaciones" icon="bell" />
			<NavbarLink href="/perfil" label="Perfil" icon="user" />
		</nav>
	);
};

const NavbarLink = ({ href, label, icon, ...props }) => {
	return (
		<NavLink to={href} {...props}>
			<i className={`ti ti-${icon}`}></i>
			<span>{label}</span>
		</NavLink>
	);
};

export default Navbar;
