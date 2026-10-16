import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<nav className="menu">
			<NavLink href="/explorar" label="Explorar" icon="compass" />
			<NavLink href="/favoritos" label="Favoritos" icon="heart" />
			<NavLink href="/notificaciones" label="Notificaciones" icon="bell" />
			<NavLink href="/perfil" label="Perfil" icon="user" />
		</nav>
	);
};

const NavLink = ({ href, label, icon, ...props }) => {
	return (
		<Link to={href} {...props}>
			<i className={`ti ti-${icon}`}></i>
			{label}
		</Link>
	);
};

export default Navbar;
