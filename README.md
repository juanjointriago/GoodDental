# Good Dental – Sistema de Gestión de Clínica Dental

Good Dental es una **aplicación web moderna para la gestión de clínicas dentales** construida con React 19, TypeScript y Vite. Centraliza las tareas diarias de una clínica (pacientes, historiales médicos, ventas, inventario, finanzas, empleados, reportes, configuraciones y más) en una interfaz única, rápida y responsiva.

El proyecto está orientado hacia **Firebase** como BaaS (Autenticación, Firestore, Storage) y **Zustand** para el manejo de estado del lado del cliente. El estilo está proporcionado por **TailwindCSS** junto con los primitivos de componentes de **Radix-UI**.

> ⚠️  El repositorio es actualmente un prototipo en desarrollo que utiliza datos simulados para varios módulos (por ejemplo _pacientes_) y **no debe considerarse listo para producción**. Siéntete libre de hacer fork, extender y adaptarlo a tus propias necesidades.

---

## ✨  Características

| Módulo | Descripción |
| ------ | ----------- |
| Autenticación | Inicio de sesión con email/contraseña y Google impulsado por Firebase Auth. El estado se persiste localmente con Zustand + `localStorage`. |
| Dashboard | Vista rápida de los KPIs más relevantes de la clínica. |
| Pacientes | Operaciones CRUD, búsqueda y filtrado de pacientes. Utiliza store de Zustand y (opcionalmente) colección de Firestore `patients`. |
| Historiales Médicos | Módulo placeholder para adjuntar y visualizar historial clínico. |
| Ventas y Cierre de Caja | Registro básico de ventas y reconciliación de caja al final del día. |
| Inventario | Seguimiento de stock, proveedores y movimientos. |
| Empleados | Directorio de personal y gestión de roles/permisos. |
| Reportes | Lugar central para exportar reportes financieros y operacionales. |
| Configuraciones | Control detallado de configuración global, temas, etc. |
| Temas | Modo claro/oscuro con detección opcional de preferencia del sistema. |

_(La mayoría de los módulos anteriores son componentes esqueleto que puedes desarrollar según tus propios requerimientos.)_

---

## 🛠️  Stack Tecnológico

* **React 19 + Vite** – servidor de desarrollo ultrarrápido y HMR
* **TypeScript 5** – código base con tipado seguro
* **Zustand 5** – store global ligero y escalable
  * Middlewares utilizados: `persist`, `immer`, `devtools`
* **Firebase 12** – Auth, Firestore, Storage
* **TailwindCSS 4** & `tailwind-merge` – estilo utility-first
* **Radix UI (primitivos React)** – componentes UI accesibles
* **React-Hook-Form + Zod** – manejo y validación de formularios
* **Sonner** – notificaciones toast hermosas
* **Recharts** – gráficos y visualización de datos
* **Eslint 9** – linting con reglas conscientes de tipos

---

## 📂  Estructura del Proyecto (extracto)

```
├── src
│   ├── assets/              # Assets estáticos (SVG, imágenes…)
│   ├── components/          # Componentes UI reutilizables + de características
│   │   ├── auth/            # Vistas de login/registro/recuperar contraseña
│   │   ├── dashboard/       # Widgets del dashboard
│   │   ├── patients/        # PatientTable, PatientForm…
│   │   └── …
│   ├── db/                  # Helpers de inicialización de Firebase
│   ├── services/            # Clases de servicio API y Firebase (ej. AuthService)
│   ├── stores/              # Stores de Zustand (auth, patients, theme, router…)
│   ├── lib/                 # Utilidades genéricas y helpers
│   ├── App.tsx              # Componente raíz incluyendo routing
│   ├── main.tsx             # Punto de entrada de Vite
│   └── index.css            # Capa base de Tailwind
├── public/                  # Archivos públicos estáticos servidos tal como están
├── .env                     # **¡No commitear secretos!**
└── README.md
```

---

## 🔧  Comenzando

### Prerrequisitos

* **Node ≥ 20** y **npm ≥ 10** (o `pnpm`, `yarn`) instalados.
* Un proyecto de Firebase si quieres conectar a un backend real.

### Instalación

```bash
# Clonar el repositorio
$ git clone https://github.com/tu-usuario/good-dental.git
$ cd good-dental

# Instalar dependencias
$ npm install        # o pnpm install / yarn install
```

### Variables de Entorno

Crea un archivo `.env` en la carpeta raíz (copia `.env.example` si está presente) y llénalo con tus credenciales de Firebase y nombres de colecciones:

```
VITE_APIKEY=<tu-api-key>
VITE_AUTHDOMAIN=<tu-auth-domain>
VITE_PROJECTID=<tu-project-id>
VITE_STORAGEBUCKET=<tu-bucket>
VITE_MESSAGINGSENDERID=<id>
VITE_APPID=<app-id>

VITE_COLLECTION_USERS=users
# … resto de las colecciones
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo de Vite con HMR
$ npm run dev
```

Abre `http://localhost:5173` (o el puerto mostrado en la consola) para ver la aplicación.

### Construcción para Producción

```bash
$ npm run build   # Build de producción con TypeScript y Vite
$ npm run preview # Servir el build de producción localmente
```

### Linting

```bash
$ npm run lint
```

---

## 🚀  Gestión de Estado

El proyecto aprovecha **Zustand** para el estado global. Un store típico se ve así:

```ts
export const usePatientsStore = create<PatientsState>()(
  persist(
    immer((set, get) => ({
      patients: [],
      loading: false,
      /* … acciones … */
    })),
    { name: 'goodent-patients-storage' }
  )
);
```

* **persist** – guarda automáticamente porciones del store en `localStorage`.
* **immer** – permite mutar el estado de manera amigable con la inmutabilidad.
* **devtools** – integrado para depuración más fácil con Redux DevTools.

---

## 🧩  Extendiendo el Proyecto

1. **Crear nuevas páginas/módulos** dentro de `src/components/<tu-modulo>`.
2. **Agregar una ruta** (string literal) en `stores/router.store.ts` y actualizar el gran `switch` dentro de `AppRouter` (ver `src/App.tsx`).
3. **Crear un store de Zustand** (si es necesario) dentro de `src/stores` siguiendo el mismo patrón.
4. **Conectar servicios de Firebase** en `src/services` (opcional).

---

## 🤝  Contribuyendo

¡Las contribuciones son bienvenidas! Por favor abre un issue o un pull request con mejoras, correcciones de bugs o nuevas características.

1. Haz fork del proyecto
2. Crea tu rama de característica: `git checkout -b feature/caracteristica-increible`
3. Commitea tus cambios: `git commit -m 'feat: agregar característica increíble'`
4. Push a la rama: `git push origin feature/caracteristica-increible`
5. Abre un pull request

---

## 📄  Licencia

Este proyecto está liberado bajo la **Licencia MIT**. Ver el archivo [LICENSE](LICENSE) para detalles.