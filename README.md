# Victoria Yañez Asesorías — Plataforma Web de Asesoría en Planes de Salud e Isapres

Aplicación web 100% independiente (React 19 + TypeScript + Vite + Tailwind CSS v4 + TanStack Router), lista para compilarse y desplegarse en **cualquier hosting tradicional (cPanel / Apache en `public_html`)** o plataformas cloud modernas (Vercel, Netlify, Cloudflare Pages, VPS).

---

## 1. Requisitos y Compilación Rápida (`dist/`)

Para descargar el repositorio, instalar dependencias y generar la carpeta estática `dist/`:

```bash
git clone https://github.com/nexttazoom-sys/screenshot-exact-match.git
cd screenshot-exact-match
npm install
npm run build
```

Al finalizar `npm run build`, se genera la carpeta **`dist/`** con rutas relativas (`base: "./"`), que incluye:

- `dist/index.html` — Entrada principal de la SPA con metadatos y tipografía `Manrope`.
- `dist/.htaccess` — Reglas de reescritura para Apache / cPanel que redirigen las subrutas (`/beneficios`, `/preguntas-frecuentes`, `/asesoria`, `/privacidad`) hacia `index.html` evitando errores 404 al recargar.
- `dist/api/send-lead-email.php` — Endpoint SMTP SSL/TLS nativo para hostings cPanel/PHP que despacha los formularios directamente a través de `solu33.tuwebdns.net:465`.
- `dist/assets/` — Hojas de estilo, scripts optimizados y fotografía familiar (`familia-salud.jpg`).
- `dist/favicon.ico` y `dist/robots.txt`.

---

## 2. Despliegue en Hosting Tradicional (cPanel / Apache `public_html`)

1. Ejecuta `npm install && npm run build`.
2. Sube **todo el contenido de la carpeta `dist/`** (incluyendo el archivo oculto `.htaccess` y la carpeta `api/`) dentro de `public_html/` (o la subcarpeta deseada) en tu cPanel.
3. Para activar el envío directo de correos desde el mismo servidor cPanel (`vyplanesisapre.cl`), crea un archivo `.env` en `public_html/.env` (o un nivel arriba de `public_html` por seguridad) con:

```env
SMTP_HOST="solu33.tuwebdns.net"
SMTP_PORT="465"
SMTP_USER="notificaciones@vyplanesisapre.cl"
SMTP_PASS="TU_CONTRASENA_SMTP_AQUI"
```

---

## 3. Variables de Entorno y Configuración de Correo SMTP

Consulta el archivo [`.env.example`](./.env.example) para ver todas las variables soportadas:

| Variable                        | Descripción                                      | Valor Oficial / Ejemplo                     |
| :------------------------------ | :----------------------------------------------- | :------------------------------------------ |
| `SMTP_HOST`                     | Servidor de correo saliente (SSL/TLS)            | `solu33.tuwebdns.net`                       |
| `SMTP_PORT`                     | Puerto SMTP con SSL/TLS implícito                | `465`                                       |
| `SMTP_USER`                     | Cuenta remitente autenticada                     | `notificaciones@vyplanesisapre.cl`          |
| `SMTP_PASS`                     | Contraseña de `notificaciones@vyplanesisapre.cl` | _(Configurar en `.env` o Supabase Secrets)_ |
| `VITE_SUPABASE_URL`             | URL pública de Supabase (opcional)               | `https://oqnuwfeyszymfpcbgzww.supabase.co`  |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública de Supabase (opcional)             | `sb_publishable_...`                        |

### Destinatarios configurados en el envío de formularios

Cada solicitud del botón **"Solicitar Asesoría 100% Gratuita"** se envía simultáneamente desde `"Victoria Yañez Asesorías <notificaciones@vyplanesisapre.cl>"` hacia:

- `victoriayanezasesora@gmail.com`
- `victoriayanezasesora@vyplanesisapre.cl`

Y cuenta con respaldo directo e inmediato hacia **WhatsApp (+56 9 4000 9671)**.

---

## 4. Comandos Disponibles

- `npm run dev` — Inicia el servidor de desarrollo local con recarga en vivo.
- `npm run build` — Compila la aplicación optimizada para producción en la carpeta `dist/`.
- `npm run preview` — Previsualiza localmente el contenido compilado en `dist/`.
- `npm run test` — Ejecuta la suite de pruebas unitarias y de rutas.
- `npm run lint` — Verifica el código con ESLint y Prettier.
