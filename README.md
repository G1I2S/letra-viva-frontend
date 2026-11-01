# Letra Viva

Plataforma donde escritores publican historias por capítulos o relatos cortos, y los lectores reaccionan con emociones, comentan, guardan favoritos y donan.

Proyecto final · Hito 2: Desarrollo Frontend con React.
## Ver en línea

https://letra-viva-frontend.vercel.app

## Instalación

```bash
git clone https://github.com/G1I2S/letra-viva-frontend.git
cd letra-viva-frontend
npm install
npm run dev
```

Abre la dirección que muestra la terminal (por defecto http://localhost:5173).

## Conexión con el backend

- **En local:** el [backend](https://github.com/G1I2S/letra-viva-backend) tiene que estar corriendo en http://localhost:3000. El frontend usa `http://localhost:3000/api` por defecto.
- **En producción:** en Vercel se configura la variable `VITE_API_URL` con la dirección del backend en Render (ver `.env.example`).
- Todas las peticiones pasan por `src/api.js`, que agrega el token automáticamente.

## Tecnologías

React, Vite, React Router, Context API, Axios y Bootstrap.

## Equipo

- Gisela Astudillo · [@G1I2S](https://github.com/G1I2S)
- Sofía Maturana · [@SilverTke](https://github.com/SilverTke)
- Jorge Guzmán · [@JGuzGaj](https://github.com/JGuzGaj)

