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
