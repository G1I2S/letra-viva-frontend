import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { useContext, useEffect, useState } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { usuario } = useContext(AuthContext);
  const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
  const getDesktop = () => window.matchMedia("(min-width: 768px)").matches;
  const [isDesktop, setIsDesktop] = useState(() => getDesktop());
  // Escuchamos el cambio de tamaño una sola vez y lo quitamos al desmontar
  // (antes se agregaba un listener nuevo en cada render)
  useEffect(() => {
    const alCambiarTamano = () => setIsDesktop(getDesktop());
    window.addEventListener("resize", alCambiarTamano);
    return () => window.removeEventListener("resize", alCambiarTamano);
  }, []);
  useEffect(() => {
    if (!usuario) {
      setCantidadNotificaciones(0);
      return undefined;
    }

    let activa = true;
    const actualizarNotificaciones = async () => {
      try {
        const { data } = await api.get("/notificaciones");
        if (activa) setCantidadNotificaciones(data.length);
      } catch {
        // Un fallo temporal no debe interrumpir la navegación.
      }
    };

    actualizarNotificaciones();
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
  }, [usuario]);
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
      <NavbarLink
        href="/notificaciones"
        label="Notificaciones"
        icon="bell"
        cantidad={cantidadNotificaciones}
      />
      <NavbarLink href="/perfil" label="Perfil" icon="user" />
    </nav>
  );
};

const NavbarLink = ({ href, label, icon, className, cantidad, ...props }) => {
  return (
    <NavLink
      to={href}
      {...props}
      className={({ isActive }) =>
        `${isActive ? "activo" : ""}${className ? ` ${className}` : ""}`
      }
    >
      <span className="menu-icono">
        <i className={`ti ti-${icon}`}></i>
        {cantidad > 0 && (
          <span
            className="contador-notificaciones"
            aria-label={`${cantidad} notificaciones nuevas`}
          >
            {cantidad > 99 ? "99+" : cantidad}
          </span>
        )}
      </span>
      <span>{label}</span>
    </NavLink>
  );
};

export default Navbar;

