import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from "./Logo";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const fechaMasReciente = (notificaciones) =>
	notificaciones.reduce((reciente, notificacion) => {
		if (!reciente || new Date(notificacion.fecha) > new Date(reciente)) return notificacion.fecha;
		return reciente;
	}, null);

const Navbar = () => {
	const { usuario } = useContext(AuthContext);
	const location = useLocation();
	const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
	const [mostrarAviso, setMostrarAviso] = useState(false);
	const ultimaAlerta = useRef(null);
	const getDesktop = () => window.matchMedia("(min-width: 768px)").matches;
	const [isDesktop, setIsDesktop] = useState(() => getDesktop());

	useEffect(() => {
		const alCambiarTamano = () => setIsDesktop(getDesktop());
		window.addEventListener("resize", alCambiarTamano);
		return () => window.removeEventListener("resize", alCambiarTamano);
	}, []);

	useEffect(() => {
		if (!mostrarAviso) return undefined;
		const temporizador = window.setTimeout(() => setMostrarAviso(false), 5000);
		return () => window.clearTimeout(temporizador);
	}, [mostrarAviso]);

	useEffect(() => {
		if (!usuario) {
			setCantidadNotificaciones(0);
			setMostrarAviso(false);
			return undefined;
		}

		let activa = true;
		const claveVisto = `notificaciones-vistas-${usuario.id}`;
		const estaEnNotificaciones = location.pathname === "/notificaciones";
		if (estaEnNotificaciones) {
			setCantidadNotificaciones(0);
			setMostrarAviso(false);
		}
		const actualizarNotificaciones = async () => {
			try {
				const { data } = await api.get("/notificaciones", { silencioso: true });
				if (!activa) return;

				const masReciente = fechaMasReciente(data);
				const fechaVista = localStorage.getItem(claveVisto);

				// La primera consulta establece el punto de partida; lo anterior no cuenta como nuevo.
				if (fechaVista === null) {
					localStorage.setItem(claveVisto, masReciente || "");
					ultimaAlerta.current = masReciente;
					setCantidadNotificaciones(0);
					return;
				}

				// Al abrir la página, marca como vistas las notificaciones disponibles.
				if (estaEnNotificaciones) {
					if (masReciente && (!fechaVista || new Date(masReciente) > new Date(fechaVista))) {
						localStorage.setItem(claveVisto, masReciente);
					}
					ultimaAlerta.current = masReciente;
					setCantidadNotificaciones(0);
					setMostrarAviso(false);
					return;
				}

				const nuevas = data.filter((notificacion) =>
					new Date(notificacion.fecha) > new Date(fechaVista || 0),
				);
				setCantidadNotificaciones(nuevas.length);

				const fechaNuevaMasReciente = fechaMasReciente(nuevas);
				if (fechaNuevaMasReciente && (!ultimaAlerta.current || new Date(fechaNuevaMasReciente) > new Date(ultimaAlerta.current))) {
					ultimaAlerta.current = fechaNuevaMasReciente;
					setMostrarAviso(true);
				}
			} catch {
				// Un fallo temporal no debe interrumpir la navegación ni cerrar la sesión.
			}
		};

		actualizarNotificaciones();
		if (!estaEnNotificaciones) {
			const intervalo = window.setInterval(actualizarNotificaciones, 30000);
			const alVolver = () => {
				if (document.visibilityState === "visible") actualizarNotificaciones();
			};
			document.addEventListener("visibilitychange", alVolver);
			return () => {
				activa = false;
				window.clearInterval(intervalo);
				document.removeEventListener("visibilitychange", alVolver);
			};
		}

		return () => {
			activa = false;
		};
	}, [usuario, location.pathname]);

	return (
		<>
			<nav className="menu">
				{isDesktop ? <Logo /> : undefined}
				<NavbarLink href="/" label="Inicio" icon="home" />
				<NavbarLink href="/favoritos" label="Favoritos" icon="heart" />
				<NavbarLink href="/explorar" label="Explorar" icon="search" className="lupa" />
				<NavbarLink href="/notificaciones" label="Notificaciones" icon="bell" cantidad={cantidadNotificaciones} />
				<NavbarLink href="/perfil" label="Perfil" icon="user" />
			</nav>
			{mostrarAviso && (
				<NavLink className="aviso-notificacion-nueva" to="/notificaciones" onClick={() => setMostrarAviso(false)} role="status">
					Tienes una notificación nueva
				</NavLink>
			)}
		</>
	);
};

const NavbarLink = ({ href, label, icon, className, cantidad, ...props }) => (
	<NavLink
		to={href}
		{...props}
		className={({ isActive }) => `${isActive ? "activo" : ""}${className ? ` ${className}` : ""}`}
	>
		<span className="menu-icono">
			<i className={`ti ti-${icon}`}></i>
			{cantidad > 0 && <span className="contador-notificaciones" aria-label={`${cantidad} notificaciones nuevas`}>{cantidad > 99 ? "99+" : cantidad}</span>}
		</span>
		<span>{label}</span>
	</NavLink>
);

export default Navbar;

