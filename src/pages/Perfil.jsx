import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListaMisHistorias from '../components/ListaMisHistorias';
import { AuthContext } from '../context/AuthContext';
import { leerLista } from '../utils/almacenamiento';

// Lee el tema guardado ('oscuro' por defecto)
const leerTema = () => {
  try {
    return localStorage.getItem('tema') || 'oscuro';
  } catch {
    return 'oscuro';
  }
};

const Perfil = () => {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tema, setTema] = useState(leerTema);
  const [misHistorias] = useState(() => leerLista('mis-historias'));

  // Cada vez que cambia el tema: lo ponemos en <html data-tema="..."> y lo guardamos
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    try {
      localStorage.setItem('tema', tema);
    } catch {
      // Si no se puede guardar, el tema igual se aplica mientras la página esté abierta
    }
  }, [tema]);

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <main>
      <section className="perfil">
        {/* Si no hay foto, mostramos un círculo con la inicial del nombre */}
        {usuario.avatar_url ? (
          <img className="avatar" src={usuario.avatar_url} alt={`Foto de ${usuario.nombre}`} />
        ) : (
          <div className="avatar avatar-inicial" aria-hidden="true">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h1>{usuario.nombre}</h1>
          <p className="autor">{usuario.email}</p>
        </div>
      </section>

      <section className="seccion">
        <h2>Tema</h2>
        <div className="selector-tema">
          <button
            type="button"
            className={tema === 'oscuro' ? 'boton' : 'boton-borde'}
            onClick={() => setTema('oscuro')}
            aria-pressed={tema === 'oscuro'}
          >
            🌙 Oscuro
          </button>
          <button
            type="button"
            className={tema === 'claro' ? 'boton' : 'boton-borde'}
            onClick={() => setTema('claro')}
            aria-pressed={tema === 'claro'}
          >
            ☀️ Claro
          </button>
        </div>
      </section>

      <section className="seccion">
        <h2>Mis historias</h2>
        <ListaMisHistorias historias={misHistorias} />
      </section>

      <button className="boton-borde" type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </main>
  );
};

export default Perfil;
