# Letra Viva — Hito 2 Frontend

## Objetivos del Hito 2

## Requisitos
| ---                                           | 

### Crear el proyecto e instalar dependencias   |
Proyecto React creado con Vite. Las dependencias y versiones quedan registradas en `package.json` y `package-lock.json`. 

### Navegar entre vistas con React Router       | 
`BrowserRouter` en `src/main.jsx`; rutas declaradas en DSDSD `src/App.jsx`. 

### Reutilizar componentes con props y renderización dinámica |
Componentes compartidos en `src/components/`; por ejemplo, `RutaPrivada` recibe contenido y parámetros por props, y `Carrusel`, `Tabs` y `TarjetaHistoria` se reutilizan en las vistas. 

### Usar hooks                                  | 
Hooks de React como `useState`, `useEffect` y `useContext` manejan formularios, interfaz, datos y sesión. 

### Manejar estado global con Context           | 
`AuthProvider` y `AuthContext` mantienen el usuario disponible en la aplicación. 

### Preparar el consumo de datos según el contrato anterior | 
Axios está instalado y hay comentarios de integración en el contexto y las páginas. La aplicación actual todavía usa datos de ejemplo y almacenamiento del navegador; falta conectar los endpoints y modelos definidos en el Hito 1.

## Descargar e instalar


### Descargar como ZIP

1. Abre <https://github.com/G1I2S/letra-viva-frontend/>.
2. Selecciona **Code → Download ZIP** y descomprime el archivo.
3. Abre una terminal en la carpeta que contiene `package.json`.
4. Instala las dependencias:

## Instalar y ejecutar
```bash
npm install
npm run dev
```
Vite mostrará la dirección local para abrir en el navegador.

## Componentes, props y renderización

Los componentes compartidos están en `src/components/`. Las páginas los componen y les pasan información mediante props para cambiar su contenido o comportamiento. Algunos ejemplos:

- `RutaPrivada` recibe ícono, título, texto y contenido hijo para presentar las distintas secciones privadas.
- `TarjetaHistoria` muestra una historia usando los datos que recibe.
- `Carrusel` y `Tabs` permiten reutilizar estructuras de interfaz en más de una vista.
- `Navbar`, `Logo` y otros componentes forman elementos comunes de la aplicación.

Las páginas están en `src/pages/`.

## Hooks y estado global

- `useState` gestiona estados de formularios y componentes.
- `useEffect` sincroniza la sesión con el almacenamiento local.
- `useContext` permite que las vistas accedan a las acciones y datos de autenticación.
- `AuthProvider` envuelve la aplicación en `src/main.jsx`; `AuthContext` se define en `src/context/AuthContext.jsx`.

El contexto ofrece `usuario`, `login`, `registro` y `logout` para mantener el estado de sesión compartido.

## Datos de ejemplo y contrato de API

El frontend incluye historias y notificaciones de ejemplo en `src/data/`. Favoritos, comentarios, tema y usuario se guardan en `localStorage`. El login y el registro son simulados: actualmente no se envían credenciales a un servidor ni se crea una cuenta remota.



## Estructura del proyecto

```text
public/                 Recursos estáticos e íconos
src/
  components/           Componentes compartidos y navegación
  context/              Context API de autenticación
  data/                 Datos de ejemplo
  pages/                Vistas de la aplicación
  utils/                Utilidades, incluido almacenamiento local
  App.jsx               Rutas y composición principal
  index.css             Estilos globales
  main.jsx              Entrada: Router, Context y estilos
index.html              Documento HTML de entrada
package.json            Dependencias y scripts npm
package-lock.json       Versiones fijadas de dependencias
vite.config.js          Configuración de Vite
  styles.css            Importa el CSS original y contiene ajustes de componentes
public/
  css/styles.css        Hoja de estilos original
 
```

## Avance adicional: pantallas migradas a React

Las pantallas `favoritos`, `perfil`, `escribir`, `notificaciones`, `login` y `registro` ya tienen componentes React propios. `Explorar` incluye búsqueda por texto y filtros de género; las tarjetas de historias usan props y permiten guardar favoritos mediante Context API.

### Límites importantes

- Login/registro son una demostración local con `localStorage`; no implementan autenticación real ni deben usarse con contraseñas reales.
- El borrador de escritura solo permanece en el estado de la sesión; no se guarda en un servidor.
- Los datos de historias son de ejemplo. La conexión al contrato/API del Hito 1 sigue pendiente porque no se ha integrado aquí una especificación verificable de ese contrato.
- Las vistas de detalle de historia y lector aún usan el cargador de HTML original.
- La compilación con `npm run build` debe ejecutarse en un entorno con las dependencias instaladas antes de considerar validada la entrega.
