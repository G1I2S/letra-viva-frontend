import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListaMisHistorias from '../components/ListaMisHistorias';
import { AuthContext } from '../context/AuthContext';
import api, { mensajeError } from '../api';

// Los 10 avatares que están en public/avatares/
const AVATARES = Array.from({ length: 10 }, (_, i) => `/avatares/avatar-${i + 1}.svg`);

// Lee el tema guardado ('oscuro' por defecto)
const leerTema = () => {
  try {
    return localStorage.getItem('tema') || 'oscuro';
  } catch {
    return 'oscuro';
  }
};

const Perfil = () => {
  const { logout, actualizarUsuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tema, setTema] = useState(leerTema);

  // Datos que llegan de GET /usuarios/me
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Formulario para editar nombre y foto
  const [formulario, setFormulario] = useState({ nombre: '', avatar_url: '' });
  const [guardando, setGuardando] = useState(false);
  const [mensajeFormulario, setMensajeFormulario] = useState('');
  const [errorFormulario, setErrorFormulario] = useState('');

  // Al abrir la página pedimos el perfil al backend
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const { data } = await api.get('/usuarios/me');
        setPerfil(data);
        setFormulario({ nombre: data.nombre, avatar_url: data.avatar_url || AVATARES[0] });
      } catch (err) {
        setError(mensajeError(err));
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, []);

  // Cada vez que cambia el tema: lo ponemos en <html data-tema="..."> y lo guardamos
  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    try {
      localStorage.setItem('tema', tema);
    } catch {
      // Si no se puede guardar, el tema igual se aplica mientras la página esté abierta
    }
  }, [tema]);

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    setMensajeFormulario('');
    setErrorFormulario('');

    if (!formulario.nombre.trim()) {
      setErrorFormulario('El nombre es obligatorio.');
      return;
    }

    setGuardando(true);
    try {
      const { data } = await api.put('/usuarios/me', {
        nombre: formulario.nombre.trim(),
        avatar_url: formulario.avatar_url.trim() || AVATARES[0],
      });
      // Si la respuesta no trae las historias, conservamos las que ya teníamos
      setPerfil({ ...perfil, ...data });
      // Actualiza el usuario en toda la app (por ejemplo, en el menú)
      actualizarUsuario({ nombre: data.nombre, avatar_url: data.avatar_url });
      setMensajeFormulario('¡Tus datos se guardaron!');
    } catch (err) {
      setErrorFormulario(mensajeError(err));
    } finally {
      setGuardando(false);
    }
  };

  // Saca la historia eliminada de la lista, sin recargar la página
  const quitarHistoria = (id) => {
    setPerfil((actual) => ({
      ...actual,
      historias: actual.historias.filter((historia) => historia.id !== id),
    }));
  };

  const cerrarSesion = () => {
    logout();
    navigate('/');
  };

  return (
    <main>
      {cargando && <p className="mensaje">Cargando...</p>}

      {error && (
        <p className="mensaje" role="alert">
          No pudimos cargar tu perfil. {error}
        </p>
      )}

      {perfil && (
        <>
          <section className="perfil">
            <img className="avatar" src={perfil.avatar_url || AVATARES[0]} alt={`Foto de ${perfil.nombre}`} />
            <div>
              <h1>{perfil.nombre}</h1>
              <p className="autor">{perfil.email}</p>
            </div>
          </section>

          <section className="seccion">
            <h2>Editar perfil</h2>
            <form className="formulario formulario-ancho" onSubmit={guardarPerfil} noValidate>
              {mensajeFormulario && (
                <p className="mensaje mensaje-exito" role="status">
                  {mensajeFormulario}
                </p>
              )}
              {errorFormulario && (
                <p className="mensaje" role="alert">
                  {errorFormulario}
                </p>
              )}

              <label className="campo">
                <span>Nombre</span>
                <input name="nombre" value={formulario.nombre} onChange={cambiarCampo} placeholder="Tu nombre" />
              </label>

              <fieldset className="campo">
                <legend className="leyenda-avatares">Elige tu avatar</legend>
                <div className="grilla-avatares">
                  {AVATARES.map((ruta, i) => {
                    const elegido = formulario.avatar_url === ruta;
                    return (
                      <button
                        key={ruta}
                        type="button"
                        className={elegido ? 'opcion-avatar elegido' : 'opcion-avatar'}
                        onClick={() => setFormulario({ ...formulario, avatar_url: ruta })}
                        aria-pressed={elegido}
                      >
                        <img src={ruta} alt={`Avatar ${i + 1}`} />
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Si avatar_url es uno de los 10 avatares, el campo queda vacío;
                  si es otro link, aparece aquí y ningún avatar queda marcado */}
              <label className="campo">
                <span>O pega el link de tu foto (opcional)</span>
                <input
                  type="url"
                  name="avatar_url"
                  value={AVATARES.includes(formulario.avatar_url) ? '' : formulario.avatar_url}
                  onChange={cambiarCampo}
                  placeholder="https://..."
                />
              </label>

              <button className="boton" type="submit" disabled={guardando}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </form>
          </section>
        </>
      )}

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

      {perfil && (
        <section className="seccion">
          <h2>Mis historias</h2>
          <ListaMisHistorias historias={perfil.historias} onEliminada={quitarHistoria} />
        </section>
      )}

      <button className="boton-borde" type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </main>
  );
};

export default Perfil;
