# Flowchat — CRM de mensajería avanzada

Landing + Panel CRM funcional 100% frontend listo para GitHub Pages.

## 🚀 Subir a GitHub Pages en 3 minutos

### Opción A — Vía navegador (sin terminal)

1. Crea un repo nuevo en [github.com/new](https://github.com/new), por ejemplo `flowchat`
2. Marca **Public** y haz click en **Create repository**
3. En la página del repo nuevo, click en **uploading an existing file**
4. Arrastra TODOS los archivos de esta carpeta (index.html, login.html, app.html, assets/) al área de drop
5. Click en **Commit changes**
6. Ve a **Settings → Pages** (menú lateral izquierdo)
7. En **Source** elige:
   - Branch: `main`
   - Folder: `/ (root)`
8. Click **Save**
9. Espera 1-2 minutos y listo — tu URL será: `https://TU_USUARIO.github.io/flowchat/`

### Opción B — Vía terminal (Git)

```bash
cd flowchat-app
git init
git add .
git commit -m "Flowchat CRM inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/flowchat.git
git push -u origin main
```

Luego activa GitHub Pages desde Settings → Pages como en la Opción A (pasos 6-9).

---

## 📁 Estructura

```
flowchat-app/
├── index.html        ← Landing page principal
├── login.html        ← Pantalla de acceso (demo: cualquier email/password)
├── app.html          ← Panel CRM con 9 vistas
├── assets/
│   ├── common.css    ← Design system compartido
│   ├── app.css       ← Estilos del panel CRM
│   ├── db.js         ← Backend simulado (localStorage)
│   └── app.js        ← Toda la lógica del CRM
└── README.md
```

---

## 🔑 Demo

- **Login:** cualquier email + cualquier contraseña funciona
- **Datos:** 12 contactos pre-cargados, 6 campañas, 8 automatizaciones
- **Storage:** los cambios se guardan en localStorage del navegador
- **Reset:** Ajustes → Datos y seguridad → "Resetear datos demo"

---

## ✅ Funcionalidades incluidas

### Landing (`index.html`)
- Hero con 3 mockups flotantes animados
- Stats bar con 4 métricas
- Comparativa sutil "Otros CRMs vs Flowchat"
- 5 tabs de sectores (e-commerce, servicios, educación, salud, inmobiliaria)
- 3 pasos de implementación
- 8 integraciones con badges NUEVO
- Pricing con toggle Mensual/Anual -25%
- 8 FAQs con acordeón
- CTA final + footer completo

### Panel CRM (`app.html`)
1. **Dashboard** — Saludo + 4 stats + embudo vertical + CX Score ring + integraciones + equipo
2. **Bandeja (Chat)** — Layout 3 columnas estilo WhatsApp con tabs, enviar mensajes con respuesta auto simulada
3. **Embudos** — Kanban 5 columnas con drag & drop funcional
4. **Contactos** — Tabla con buscador live, 4 acciones por fila, modal crear/editar
5. **Campañas** — 3 límites Meta + 7 stat tiles + lista con envío simulado
6. **Automatizaciones** — 4 tipos + lista con toggles y eliminar
7. **Analítica** — 4 big stats + embudo horizontal + chart SVG + ranking
8. **Archivados** — Lista tipo WhatsApp con desarchivar
9. **Ajustes** — 7 secciones (perfil, equipo, notificaciones, auto, integraciones, facturación, datos)

### Elementos globales
- Sidebar dark con badge de no leídos
- Topbar con search, notificaciones dropdown y botón nuevo contacto
- Toast notifications (success/warning/error/info)
- Modales con animación
- 100% responsive

---

## 🎨 Marca

- **Colores:** Azul cielo (`#0EA5E9`) + Amarillo (`#FACC15`) + Verde (`#22C55E`)
- **Fuentes:** Plus Jakarta Sans (display) + Inter (body) + JetBrains Mono (código)
- **Logo:** "Flow" navy + "chat" sky en SVG inline

---

## 🛠️ Sin dependencias

- No usa frameworks (Vanilla JS, HTML y CSS puro)
- No requiere backend (localStorage simula la DB)
- No requiere build step
- Se puede abrir localmente con doble-click en `index.html`

---

## 📱 Flujo de uso

1. Usuario llega a `index.html` (landing)
2. Hace click en "Empieza gratis" → va a `login.html`
3. Ingresa cualquier email/password → se guarda `flowchat_session` en localStorage
4. Redirige a `app.html` con datos demo precargados
5. Al cerrar sesión, se borra la sesión y vuelve a `login.html`

---

Hecho con 💙 para **TEC CAPITAL** por IPCI · Tehuacán, Puebla 🇲🇽
