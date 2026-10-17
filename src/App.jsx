import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import RutaPrivada from "./components/RutaPrivada";
import Escribir from "./pages/Escribir";
import Explorar from "./pages/Explorar";
import Favoritos from "./pages/Favoritos";
import Historia from "./pages/Historia";
import Inicio from "./pages/Inicio";
import Lector from "./pages/Lector";
import Login from "./pages/Login";
import NoEncontrada from "./pages/NoEncontrada";
import Notificaciones from "./pages/Notificaciones";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";

const App = () => {
	return (
		<>
			<Navbar />
			<Routes>
				{/* Públicas */}
				<Route path="/" element={<Inicio />} />
				<Route path="/explorar" element={<Explorar />} />
				<Route path="/historia/:id" element={<Historia />} />
				<Route path="/historia/:id/capitulo/:numero" element={<Lector />} />
				<Route path="/login" element={<Login />} />
				<Route path="/registro" element={<Registro />} />

				{/* Privadas: si no hay sesión, muestran el aviso */}
				<Route
					path="/favoritos"
					element={
						<RutaPrivada
							icono="❤️"
							titulo="Tus favoritos"
							texto="Aquí vas a encontrar las historias que te gustaron, guardadas para que sigas leyendo justo donde te quedaste."
						>
							<Favoritos />
						</RutaPrivada>
					}
				/>
				<Route
					path="/notificaciones"
					element={
						<RutaPrivada
							icono="🔔"
							titulo="Tus notificaciones"
							texto="Aquí vas a ver las reacciones, comentarios y donaciones que reciben tus historias."
						>
							<Notificaciones />
						</RutaPrivada>
					}
				/>
				<Route
					path="/perfil"
					element={
						<RutaPrivada
							icono="👤"
							titulo="Tu perfil"
							texto="Aquí vas a tener tu foto, tu nombre, tus historias y podrás elegir entre tema claro u oscuro."
						>
							<Perfil />
						</RutaPrivada>
					}
				/>
				<Route
					path="/escribir"
					element={
						<RutaPrivada
							icono="✍️"
							titulo="Escribe tu historia"
							texto="Aquí podrás publicar novelas por capítulos o escritos cortos y compartirlos con la comunidad."
						>
							<Escribir />
						</RutaPrivada>
					}
				/>

				{/* Cualquier otra dirección */}
				<Route path="*" element={<NoEncontrada />} />
			</Routes>
		</>
	);
};

export default App;
