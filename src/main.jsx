import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";

// Aplica el tema guardado antes de mostrar la app, para que al recargar
// cualquier página se vea con el tema elegido en el perfil
try {
	document.documentElement.dataset.tema = localStorage.getItem("tema") || "oscuro";
} catch {
	document.documentElement.dataset.tema = "oscuro";
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>,
);
