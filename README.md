# Sistema de Gestión PQRS

Este proyecto es una aplicación web desarrollada en React para la gestión de PQRS (Peticiones, Quejas, Reclamos y Sugerencias). La aplicación se integra con una API REST desarrollada en Laravel para el manejo de datos y autenticación.

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- API REST Laravel corriendo en localhost:8000

## Instalación

1. Clonar el repositorio:
\```bash
git clone [url-del-repositorio]
cd api_pqrs
\```

2. Instalar dependencias:
\```bash
npm install
# o
yarn install
\```

3. Crear archivo de variables de entorno:
- Copiar el archivo `.env.example` a `.env`
- Configurar las variables de entorno necesarias:
\```env
REACT_APP_URL_API=http://localhost:8000/api/
\```

## Configuración

El proyecto utiliza las siguientes tecnologías y librerías principales:

- React
- React Router DOM para la navegación
- Formik para manejo de formularios
- Yup para validación de formularios
- Reactstrap para componentes de UI
- Redux para manejo del estado (store)

## Estructura del Proyecto

\```
src/
  ├── assets/         # Recursos estáticos (imágenes, estilos)
  ├── components/     # Componentes reutilizables
  ├── layouts/        # Layouts de la aplicación
  ├── views/          # Vistas/páginas de la aplicación
  ├── routes/         # Configuración de rutas
  ├── store/          # Estado global (Redux)
  └── data/          # Datos mock y configuraciones
\```

## Scripts Disponibles

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

## Autenticación

La aplicación utiliza autenticación basada en tokens JWT:

- Endpoint de login: `${API_URL}/login`
- Credenciales de prueba:
  - Email: admin@example.com
  - Password: 123456789

## Características Principales

- Sistema de autenticación con JWT
- Dashboard interactivo
- Gestión de PQRS
- Interfaz responsive
- Tema claro/oscuro
- Múltiples layouts disponibles

## Contribución

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE.md para más detalles.
