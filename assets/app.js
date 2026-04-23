/* ═══ FLOWCHAT APP LOGIC ═══ */

// Guard: requiere login
if (!localStorage.getItem('flowchat_session')) {
  window.location.href = 'login.html';
}

// ═══ HELPERS ═══
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

const toast = (msg, type='info') => {
  let c = $('.toast-container');
  if (!c) { c = document.createElement('div'); c.className='toast-container'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icons = {
    success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
    error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    warning: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
    info: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  t.innerHTML = (icons[type] || icons.info) + `<div>${msg}</div>`;
  c.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 250); }, 3500);
};

const formatMXN = n => '$' + Number(n).toLocaleString('es-MX');
const formatNumber = n => Number(n).toLocaleString('es-MX');

const timeAgo = ts => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'ahora';
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(ts).toLocaleDateString('es-MX', { day:'numeric', month:'short' });
};

const formatHour = ts => new Date(ts).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', hour12:false });

const formatDate = ts => new Date(ts).toLocaleDateString('es-MX', { day:'numeric', month:'long', year:'numeric' });

const stageLabel = s => ({nuevo:'Nuevo',interesado:'Interesado',cotizado:'Cotizado',pagado:'Pagado',perdido:'Perdido',pendiente:'Pendiente'}[s] || s);
const stageColor = s => ({nuevo:'#6B7280',interesado:'#EAB308',cotizado:'#0EA5E9',pagado:'#22C55E',perdido:'#EF4444',pendiente:'#F97316'}[s]);

const channelIcon = c => {
  const icons = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="#25D366"><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4C8.7 21.5 10.3 22 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="#E1306C" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C"/></svg>',
    messenger: '<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M12 2C6.5 2 2 6.2 2 11.6c0 2.9 1.3 5.4 3.5 7.2V22l3.2-1.7c.8.2 1.6.3 2.5.3 5.5 0 9.8-4.2 9.8-9.6S17.5 2 12 2z"/></svg>'
  };
  return icons[c] || icons.whatsapp;
};

const modal = (title, body, footer=null, size='') => {
  const bd = document.createElement('div');
  bd.className = 'modal-backdrop';
  bd.innerHTML = `
    <div class="modal-content ${size}">
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close">✕</button>
      </div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  `;
  document.body.appendChild(bd);
  const close = () => bd.remove();
  bd.addEventListener('click', e => { if (e.target === bd) close(); });
  $('.modal-close', bd).addEventListener('click', close);
  return { bd, close };
};

// ═══ SIDEBAR LOGO ═══
const LOGO_SVG = `
<svg viewBox="0 0 200 200" fill="none">
  <defs><linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0369A1"/><stop offset="100%" stop-color="#38BDF8"/></linearGradient></defs>
  <path d="M100 20 A80 80 0 1 1 60 175 L60 180 L42 172 L55 160 A80 80 0 0 1 100 20 Z" stroke="url(#logoG)" stroke-width="14" stroke-linecap="round" fill="none"/>
  <circle cx="55" cy="125" r="8" fill="#0369A1"/><circle cx="95" cy="100" r="8" fill="#38BDF8"/><circle cx="125" cy="85" r="8" fill="#0369A1"/>
  <path d="M55 125 L95 100 L125 85" stroke="#0369A1" stroke-width="5" stroke-linecap="round"/>
</svg>`;

// ═══ ROUTER ═══
const VIEWS = {
  dashboard: 'Dashboard',
  chat: 'Bandeja',
  embudos: 'Embudos',
  contactos: 'Contactos',
  campanas: 'Campañas',
  automatizaciones: 'Automatizaciones',
  analitica: 'Analítica',
  archivados: 'Archivados',
  ajustes: 'Ajustes'
};

let currentView = 'dashboard';
let chatSelectedId = null;

const route = (view) => {
  currentView = view;
  $$('.sidebar-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $$('.view').forEach(v => v.classList.toggle('active', v.id === `view-${view}`));
  $('.topbar-title').textContent = VIEWS[view];
  renderView(view);
  window.location.hash = view;
};

// ═══ TOPBAR ═══
const renderTopbar = () => {
  const u = DB.getUser();
  const unread = DB.unreadNotifications();
  return `
    <div>
      <div class="topbar-title">Dashboard</div>
    </div>
    <div class="topbar-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" id="topbar-search-input" placeholder="Buscar contactos, conversaciones, campañas...">
    </div>
    <div class="topbar-actions">
      <div class="notif-wrap">
        <button class="btn-icon notif-btn" id="notif-btn" title="Notificaciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>
          ${unread > 0 ? '<span class="notif-dot"></span>' : ''}
        </button>
        <div class="notif-dropdown" id="notif-dropdown">
          <div class="notif-header">
            <div class="notif-title">Notificaciones</div>
            <button class="notif-markall" id="notif-markall">Marcar todas</button>
          </div>
          <div id="notif-list"></div>
        </div>
      </div>
      <button class="btn btn-sm btn-primary" id="topbar-new-contact">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nuevo contacto
      </button>
    </div>
  `;
};

const renderNotifList = () => {
  const notifs = DB.getNotifications().slice(0, 10);
  const list = $('#notif-list');
  if (!list) return;
  if (notifs.length === 0) {
    list.innerHTML = '<div style="padding:30px;text-align:center;color:var(--stone-500);font-size:13px">Sin notificaciones</div>';
    return;
  }
  const iconFor = t => ({hot_lead:'🔥',alert:'⚠️',campaign:'📢',sale:'💰',system:'⚙️'}[t] || '🔔');
  list.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.read ? '' : 'unread'} ${n.type}" data-notif-id="${n.id}">
      <div class="notif-item-icon">${iconFor(n.type)}</div>
      <div>
        <div class="notif-item-text">${n.text}</div>
        <div class="notif-item-time">${timeAgo(n.time)}</div>
      </div>
    </div>
  `).join('');
  $$('.notif-item', list).forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.notifId;
      DB.markNotificationRead(id);
      renderNotifList();
      updateNotifDot();
      const n = DB.getNotifications().find(n => n.id === id);
      if (n && n.contact_id) {
        chatSelectedId = n.contact_id;
        route('chat');
        $('#notif-dropdown').classList.remove('open');
      }
    });
  });
};

const updateNotifDot = () => {
  const btn = $('.notif-btn');
  if (!btn) return;
  const dot = btn.querySelector('.notif-dot');
  const unread = DB.unreadNotifications();
  if (unread > 0 && !dot) {
    btn.insertAdjacentHTML('beforeend', '<span class="notif-dot"></span>');
  } else if (unread === 0 && dot) {
    dot.remove();
  }
};

// ═══ VIEW RENDERERS ═══
const renderView = (view) => {
  const renderers = {
    dashboard: renderDashboard,
    chat: renderChat,
    embudos: renderEmbudos,
    contactos: renderContactos,
    campanas: renderCampanas,
    automatizaciones: renderAutomatizaciones,
    analitica: renderAnalitica,
    archivados: renderArchivados,
    ajustes: renderAjustes
  };
  if (renderers[view]) renderers[view]();
};

// ═══ DASHBOARD ═══
const renderDashboard = () => {
  const s = DB.getStats();
  const u = DB.getUser();
  const integrations = DB.getIntegrations();
  const team = DB.getTeam();

  const container = $('#view-dashboard .view-inner');
  container.innerHTML = `
    <div class="dashboard-hero">
      <div class="dashboard-hero-title">¡Hola ${u.name.split(' ')[0]}! 👋</div>
      <div class="dashboard-hero-sub">Tu panel está conectado y funcionando. Esto es lo que pasa hoy en tu negocio.</div>
      <div class="dashboard-hero-grid">
        <div class="dashboard-hero-stat">
          <div class="dashboard-hero-stat-label">Contactos activos</div>
          <div class="dashboard-hero-stat-value">${formatNumber(s.total_contacts)}</div>
          <div class="dashboard-hero-stat-delta">↑ 12% esta semana</div>
        </div>
        <div class="dashboard-hero-stat">
          <div class="dashboard-hero-stat-label">Ingresos mes</div>
          <div class="dashboard-hero-stat-value">${formatMXN(s.revenue)}</div>
          <div class="dashboard-hero-stat-delta">↑ 28% vs mes pasado</div>
        </div>
        <div class="dashboard-hero-stat">
          <div class="dashboard-hero-stat-label">Tiempo respuesta</div>
          <div class="dashboard-hero-stat-value">${s.response_time_avg}min</div>
          <div class="dashboard-hero-stat-delta">↓ 45% vs promedio</div>
        </div>
        <div class="dashboard-hero-stat">
          <div class="dashboard-hero-stat-label">Conversión</div>
          <div class="dashboard-hero-stat-value">${s.conversion_rate}%</div>
          <div class="dashboard-hero-stat-delta">↑ 3pp esta semana</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">Embudo de ventas</div>
            <div class="card-subtitle">Distribución actual de tus contactos</div>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="route('embudos')">Ver completo →</button>
        </div>
        <div class="funnel-vertical">
          ${[['nuevo','Nuevos'],['interesado','Interesados'],['cotizado','Cotizados'],['pagado','Pagados'],['perdido','Perdidos']].map(([key, label]) => {
            const count = s[key === 'nuevo' ? 'nuevos' : key === 'interesado' ? 'interesados' : key === 'cotizado' ? 'cotizados' : key === 'pagado' ? 'pagados' : 'perdidos'];
            const max = Math.max(s.nuevos, s.interesados, s.cotizados, s.pagados, s.perdidos, 1);
            const pct = (count / max) * 100;
            return `
              <div class="funnel-bar">
                <div class="funnel-bar-label">${label}</div>
                <div class="funnel-bar-track">
                  <div class="funnel-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,${stageColor(key)},${stageColor(key)}dd)">${count}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">CX Score</div>
        </div>
        <div class="cx-ring">
          <svg class="cx-ring-svg" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" stroke-width="10"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="url(#cxG)" stroke-width="10" stroke-linecap="round" stroke-dasharray="${2*Math.PI*50}" stroke-dashoffset="${2*Math.PI*50*(1-s.cx_score/100)}" transform="rotate(-90 60 60)"/>
            <defs><linearGradient id="cxG"><stop offset="0%" stop-color="#22C55E"/><stop offset="100%" stop-color="#0EA5E9"/></linearGradient></defs>
            <text x="60" y="58" text-anchor="middle" font-family="Plus Jakarta Sans" font-size="22" font-weight="900" fill="#0B1437">${s.cx_score}</text>
            <text x="60" y="75" text-anchor="middle" font-size="9" fill="#6B7280" font-weight="700">PUNTOS</text>
          </svg>
          <div class="cx-ring-info">
            <div class="cx-ring-label">Satisfacción</div>
            <div class="cx-ring-title">Excelente</div>
            <div class="cx-ring-desc">Tu equipo mantiene un nivel de satisfacción alto. Sigue así ✨</div>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Integraciones</div>
          <button class="btn btn-sm btn-ghost" onclick="route('ajustes')">Gestionar →</button>
        </div>
        <div class="integrations-mini">
          ${integrations.map(i => `
            <div class="integ-mini">
              <div class="integ-mini-icon" style="background:${i.color}">${i.icon}</div>
              <div class="integ-mini-info">
                <div class="integ-mini-name">${i.name}</div>
                <div class="integ-mini-status ${i.connected ? 'connected' : 'disconnected'}">
                  ${i.connected ? '● CONECTADO' : '○ NO CONECTADO'}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Equipo hoy</div>
        </div>
        <div class="team-list">
          ${team.map(m => `
            <div class="team-row">
              <div class="avatar avatar-sm ${m.status === 'online' ? 'avatar-online' : ''}" style="background:linear-gradient(135deg,${m.color},${m.color}cc)">${m.avatar}</div>
              <div class="team-row-info">
                <div class="team-row-name">${m.name}</div>
                <div class="team-row-meta">${m.role} · ${m.status === 'online' ? 'Disponible' : m.status === 'away' ? 'Ausente' : 'Desconectado'}</div>
              </div>
              <div class="team-row-stat">
                <div class="team-row-stat-value">${m.responses_today}</div>
                <div class="team-row-stat-label">resp. hoy</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

// ═══ CHAT ═══
const renderChat = () => {
  const contacts = DB.getContacts().filter(c => !c.archived);
  if (!chatSelectedId && contacts[0]) chatSelectedId = contacts[0].id;

  const container = $('#view-chat .view-inner');
  container.style.padding = '0';
  container.innerHTML = `
    <div class="chat-layout">
      <div class="chat-list">
        <div class="chat-list-header">
          <div style="font-family:var(--font-display);font-size:16px;font-weight:800">Bandeja</div>
          <div class="chat-list-tabs">
            <button class="chat-list-tab active" data-filter="all">Todos</button>
            <button class="chat-list-tab" data-filter="unread">No leídos</button>
            <button class="chat-list-tab" data-filter="mine">Míos</button>
          </div>
        </div>
        <div class="chat-list-scroll" id="chat-list-scroll"></div>
      </div>
      <div class="chat-main" id="chat-main"></div>
      <div class="chat-detail" id="chat-detail"></div>
    </div>
  `;

  renderChatList();
  renderChatMain();
  renderChatDetail();

  $$('.chat-list-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.chat-list-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderChatList(tab.dataset.filter);
    });
  });
};

const renderChatList = (filter='all') => {
  let contacts = DB.getContacts().filter(c => !c.archived);
  if (filter === 'unread') contacts = contacts.filter(c => c.unread > 0);
  if (filter === 'mine') contacts = contacts.filter(c => c.assigned === 'a1');
  contacts.sort((a,b) => (b.unread > 0 ? 1 : 0) - (a.unread > 0 ? 1 : 0));

  const list = $('#chat-list-scroll');
  if (!contacts.length) {
    list.innerHTML = '<div style="padding:30px 20px;text-align:center;color:var(--stone-500);font-size:13px">Sin conversaciones</div>';
    return;
  }
  list.innerHTML = contacts.map(c => `
    <div class="chat-item ${c.id === chatSelectedId ? 'active' : ''}" data-id="${c.id}">
      <div class="avatar avatar-sm" style="background:linear-gradient(135deg,${c.channel === 'instagram' ? '#E1306C,#833AB4' : c.channel === 'messenger' ? '#1877F2,#0C5FC7' : '#22C55E,#15803D'})">${c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
      <div class="chat-item-info">
        <div class="chat-item-top">
          <div class="chat-item-name">${c.name}</div>
          <div class="chat-item-time">${timeAgo(c.created)}</div>
        </div>
        <div class="chat-item-preview">${c.last_msg || '(sin mensajes)'}</div>
        <div style="display:flex;align-items:center;gap:6px">
          <div class="chat-item-channel-icon">${channelIcon(c.channel)}${c.channel}</div>
          <span class="stage-pill stage-${c.stage}">${stageLabel(c.stage)}</span>
          ${c.unread > 0 ? `<span class="chat-item-unread">${c.unread}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
  $$('.chat-item', list).forEach(el => {
    el.addEventListener('click', () => {
      chatSelectedId = el.dataset.id;
      DB.markContactRead(chatSelectedId);
      renderChatList(filter);
      renderChatMain();
      renderChatDetail();
    });
  });
};

const renderChatMain = () => {
  const main = $('#chat-main');
  if (!chatSelectedId) {
    main.innerHTML = `
      <div class="chat-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <div class="chat-empty-title">Selecciona una conversación</div>
        <div class="chat-empty-sub">Elige un chat de la izquierda para ver el historial</div>
      </div>
    `;
    return;
  }
  const c = DB.getContact(chatSelectedId);
  const messages = DB.getConversation(chatSelectedId);
  main.innerHTML = `
    <div class="chat-main-header">
      <div class="avatar avatar-sm avatar-online" style="background:linear-gradient(135deg,#22C55E,#15803D)">${c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
      <div class="chat-main-header-info">
        <div class="chat-main-header-name">${c.name}</div>
        <div class="chat-main-header-status">${c.phone} · ${c.channel}</div>
      </div>
      <div class="chat-main-header-actions">
        <button class="btn-icon" title="Llamar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg></button>
        <button class="btn-icon" id="chat-archive-btn" title="Archivar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg></button>
        <button class="btn-icon" title="Más"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages">
      ${messages.length === 0 ? '<div class="chat-date-sep">Sin mensajes aún</div>' : ''}
      ${messages.map(m => {
        const cls = m.from === 'contact' ? 'chat-bubble-in' : m.from === 'bot' ? 'chat-bubble-bot' : 'chat-bubble-out';
        return `
          <div class="chat-bubble ${cls}">
            ${m.from === 'bot' ? '🤖 <em>bot:</em> ' : ''}${m.text}
            <div class="chat-bubble-time">${formatHour(m.time)}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="chat-composer">
      <button class="btn-icon" title="Adjuntar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg></button>
      <button class="btn-icon" title="Emoji">😊</button>
      <textarea class="chat-composer-input" id="chat-input" placeholder="Escribe un mensaje..." rows="1"></textarea>
      <button class="chat-composer-send" id="chat-send" title="Enviar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  `;

  const messagesEl = $('#chat-messages');
  messagesEl.scrollTop = messagesEl.scrollHeight;

  const input = $('#chat-input');
  const send = $('#chat-send');
  const doSend = () => {
    const text = input.value.trim();
    if (!text) return;
    DB.sendMessage(chatSelectedId, text, 'agent', 'a1');
    input.value = '';
    renderChatMain();
    renderChatList();

    // Simular respuesta del contacto después de 2s
    setTimeout(() => {
      const autoReplies = ['Perfecto, gracias 🙌', 'Ok, lo reviso', 'Claro que sí', '¿Me mandas más info?', 'Te confirmo en un rato'];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      DB.sendMessage(chatSelectedId, reply, 'contact');
      if (currentView === 'chat') {
        renderChatMain();
        renderChatList();
      }
    }, 2000);
  };
  send.addEventListener('click', doSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); }
  });

  $('#chat-archive-btn').addEventListener('click', () => {
    DB.archiveContact(chatSelectedId);
    toast('Conversación archivada', 'success');
    chatSelectedId = null;
    renderChat();
  });
};

const renderChatDetail = () => {
  const detail = $('#chat-detail');
  if (!chatSelectedId) { detail.innerHTML = ''; return; }
  const c = DB.getContact(chatSelectedId);
  const team = DB.getTeam();
  const agent = c.assigned ? team.find(t => t.id === c.assigned) : null;
  detail.innerHTML = `
    <div class="chat-detail-header">
      <div class="avatar avatar-xl" style="background:linear-gradient(135deg,#22C55E,#15803D);margin:0 auto">${c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
      <div class="chat-detail-name">${c.name}</div>
      <div class="chat-detail-sub">${c.phone}</div>
      <div style="margin-top:10px"><span class="stage-pill stage-${c.stage}">${stageLabel(c.stage)}</span></div>
    </div>
    <div class="chat-detail-section">
      <div class="chat-detail-section-title">Información</div>
      <div class="chat-detail-row"><span class="chat-detail-row-label">Email</span><span class="chat-detail-row-value">${c.email || '—'}</span></div>
      <div class="chat-detail-row"><span class="chat-detail-row-label">Canal</span><span class="chat-detail-row-value">${c.channel}</span></div>
      <div class="chat-detail-row"><span class="chat-detail-row-label">Valor</span><span class="chat-detail-row-value">${c.value ? formatMXN(c.value) : '—'}</span></div>
      <div class="chat-detail-row"><span class="chat-detail-row-label">Fuente</span><span class="chat-detail-row-value">${c.source || '—'}</span></div>
      <div class="chat-detail-row"><span class="chat-detail-row-label">Asignado</span><span class="chat-detail-row-value">${agent ? agent.name : 'Sin asignar'}</span></div>
    </div>
    ${c.tags && c.tags.length ? `
    <div class="chat-detail-section">
      <div class="chat-detail-section-title">Etiquetas</div>
      <div class="chat-detail-tags">${c.tags.map(t => `<span class="chat-detail-tag">${t}</span>`).join('')}</div>
    </div>` : ''}
    ${c.notes ? `
    <div class="chat-detail-section">
      <div class="chat-detail-section-title">Notas internas</div>
      <div class="chat-detail-notes">${c.notes}</div>
    </div>` : ''}
    <div class="chat-detail-section">
      <div class="chat-detail-section-title">Acciones rápidas</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-sm btn-ghost" id="chat-detail-move">Mover etapa</button>
        <button class="btn btn-sm btn-ghost" id="chat-detail-edit">Editar contacto</button>
      </div>
    </div>
  `;

  $('#chat-detail-move').addEventListener('click', () => openStageModal(c.id));
  $('#chat-detail-edit').addEventListener('click', () => openContactModal(c.id));
};

// ═══ EMBUDOS ═══
const renderEmbudos = () => {
  const stages = ['nuevo','interesado','cotizado','pagado','perdido'];
  const container = $('#view-embudos .view-inner');
  const contacts = DB.getContacts();
  container.innerHTML = `
    <div class="kanban" id="kanban">
      ${stages.map(st => {
        const cs = contacts.filter(c => c.stage === st);
        const total = cs.reduce((s,c) => s + (c.value || 0), 0);
        return `
        <div class="kanban-col" data-stage="${st}">
          <div class="kanban-col-header">
            <div class="kanban-col-title">
              <span class="kanban-col-dot"></span>
              ${stageLabel(st)}
            </div>
            <span class="kanban-col-count">${cs.length}</span>
          </div>
          <div class="kanban-col-body">
            ${cs.map(c => `
              <div class="kanban-card" draggable="true" data-id="${c.id}">
                <div class="kanban-card-name">${c.name}</div>
                <div class="kanban-card-meta">
                  <span>${timeAgo(c.created)}</span>
                  ${c.value ? `<span class="kanban-card-value">${formatMXN(c.value)}</span>` : ''}
                </div>
                ${c.tags.length ? `<div class="kanban-card-tags">${c.tags.slice(0,3).map(t => `<span class="kanban-card-tag">${t}</span>`).join('')}</div>` : ''}
              </div>
            `).join('')}
          </div>
          <div class="kanban-col-total">Total: ${formatMXN(total)}</div>
        </div>
      `;}).join('')}
    </div>
  `;

  // DRAG & DROP
  let draggedId = null;
  $$('.kanban-card').forEach(card => {
    card.addEventListener('dragstart', (e) => {
      draggedId = card.dataset.id;
      card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('click', () => openContactModal(card.dataset.id));
  });
  $$('.kanban-col').forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (draggedId) {
        const newStage = col.dataset.stage;
        DB.moveContactStage(draggedId, newStage);
        toast(`Movido a "${stageLabel(newStage)}"`, 'success');
        renderEmbudos();
      }
    });
  });
};

// ═══ CONTACTOS ═══
const renderContactos = (filter='') => {
  let contacts = DB.getContacts();
  if (filter) {
    const f = filter.toLowerCase();
    contacts = contacts.filter(c =>
      c.name.toLowerCase().includes(f) ||
      (c.email || '').toLowerCase().includes(f) ||
      c.phone.includes(f) ||
      c.tags.some(t => t.toLowerCase().includes(f))
    );
  }

  const team = DB.getTeam();
  const container = $('#view-contactos .view-inner');
  container.innerHTML = `
    <div class="contacts-toolbar">
      <input class="form-input" style="max-width:320px" id="contacts-filter" placeholder="Buscar por nombre, email, teléfono..." value="${filter}">
      <button class="btn btn-ghost btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filtros
      </button>
      <button class="btn btn-ghost btn-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Exportar CSV
      </button>
      <button class="btn btn-primary btn-sm" id="contacts-add" style="margin-left:auto">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nuevo contacto
      </button>
    </div>
    <div class="contacts-table-wrap">
      <table class="contacts-table">
        <thead>
          <tr>
            <th style="width:26%">Contacto</th>
            <th style="width:14%">Canal</th>
            <th style="width:14%">Etapa</th>
            <th style="width:12%">Valor</th>
            <th style="width:14%">Asignado</th>
            <th style="width:10%">Creado</th>
            <th style="width:10%;text-align:right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${contacts.length === 0 ? '<tr><td colspan="7" class="contacts-table-empty">Sin contactos que coincidan</td></tr>' : contacts.map(c => {
            const agent = c.assigned ? team.find(t => t.id === c.assigned) : null;
            return `
            <tr data-id="${c.id}">
              <td>
                <div class="contacts-table-contact">
                  <div class="avatar avatar-sm" style="background:linear-gradient(135deg,#22C55E,#15803D)">${c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div>
                    <div class="contacts-table-name">${c.name}</div>
                    <div class="contacts-table-phone">${c.phone}</div>
                  </div>
                </div>
              </td>
              <td><span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--stone-600)"><span style="width:14px;height:14px">${channelIcon(c.channel)}</span>${c.channel}</span></td>
              <td><span class="stage-pill stage-${c.stage}">${stageLabel(c.stage)}</span></td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--navy-900)">${c.value ? formatMXN(c.value) : '—'}</td>
              <td>${agent ? `<span style="display:inline-flex;align-items:center;gap:6px"><span class="avatar avatar-sm" style="width:22px;height:22px;font-size:9px;background:linear-gradient(135deg,${agent.color},${agent.color}cc)">${agent.avatar}</span>${agent.name.split(' ')[0]}</span>` : '<span style="color:var(--stone-400)">—</span>'}</td>
              <td style="font-size:12px;color:var(--stone-500)">${timeAgo(c.created)}</td>
              <td>
                <div class="contacts-table-actions">
                  <button class="btn-icon" data-action="chat" title="Abrir chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></button>
                  <button class="btn-icon" data-action="edit" title="Editar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  <button class="btn-icon" data-action="archive" title="Archivar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg></button>
                  <button class="btn-icon" data-action="delete" title="Eliminar" style="color:var(--red-500)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
                </div>
              </td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  $('#contacts-filter').addEventListener('input', e => renderContactos(e.target.value));
  $('#contacts-add').addEventListener('click', () => openContactModal());

  $$('.contacts-table tbody tr').forEach(tr => {
    const id = tr.dataset.id;
    $$('button[data-action]', tr).forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        const act = b.dataset.action;
        if (act === 'chat') { chatSelectedId = id; route('chat'); }
        if (act === 'edit') openContactModal(id);
        if (act === 'archive') {
          if (confirm('¿Archivar este contacto?')) {
            DB.archiveContact(id);
            toast('Contacto archivado', 'success');
            renderContactos(filter);
          }
        }
        if (act === 'delete') {
          if (confirm('¿Eliminar contacto permanentemente?')) {
            DB.deleteContact(id);
            toast('Contacto eliminado', 'success');
            renderContactos(filter);
          }
        }
      });
    });
  });
};

// ═══ MODALES CONTACTO ═══
const openContactModal = (id=null) => {
  const c = id ? DB.getContact(id) : { name:'', phone:'', email:'', stage:'nuevo', channel:'whatsapp', value:0, tags:[], notes:'', source:'Manual' };
  const isEdit = !!id;
  const { bd, close } = modal(
    isEdit ? 'Editar contacto' : 'Nuevo contacto',
    `
      <div class="form-group">
        <label class="form-label">Nombre completo</label>
        <input class="form-input" id="cm-name" value="${c.name}" placeholder="Ej. Ana Martínez">
      </div>
      <div class="form-group">
        <label class="form-label">Teléfono</label>
        <input class="form-input" id="cm-phone" value="${c.phone}" placeholder="+52 55 1234 5678">
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input class="form-input" id="cm-email" value="${c.email || ''}" placeholder="correo@ejemplo.com">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Canal</label>
          <select class="form-select" id="cm-channel">
            <option value="whatsapp" ${c.channel==='whatsapp'?'selected':''}>WhatsApp</option>
            <option value="instagram" ${c.channel==='instagram'?'selected':''}>Instagram</option>
            <option value="messenger" ${c.channel==='messenger'?'selected':''}>Messenger</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Etapa</label>
          <select class="form-select" id="cm-stage">
            <option value="nuevo" ${c.stage==='nuevo'?'selected':''}>Nuevo</option>
            <option value="interesado" ${c.stage==='interesado'?'selected':''}>Interesado</option>
            <option value="cotizado" ${c.stage==='cotizado'?'selected':''}>Cotizado</option>
            <option value="pagado" ${c.stage==='pagado'?'selected':''}>Pagado</option>
            <option value="perdido" ${c.stage==='perdido'?'selected':''}>Perdido</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Valor estimado (MXN)</label>
        <input class="form-input" type="number" id="cm-value" value="${c.value || 0}" placeholder="0">
      </div>
      <div class="form-group">
        <label class="form-label">Etiquetas (separadas por coma)</label>
        <input class="form-input" id="cm-tags" value="${c.tags.join(', ')}" placeholder="Facebook Ads, VIP, consultoría">
      </div>
      <div class="form-group">
        <label class="form-label">Notas internas</label>
        <textarea class="form-textarea" id="cm-notes" placeholder="Contexto importante sobre este contacto...">${c.notes || ''}</textarea>
      </div>
    `,
    `
      <button class="btn btn-ghost" id="cm-cancel">Cancelar</button>
      <button class="btn btn-primary" id="cm-save">${isEdit ? 'Guardar cambios' : 'Crear contacto'}</button>
    `
  );
  $('#cm-cancel', bd).addEventListener('click', close);
  $('#cm-save', bd).addEventListener('click', () => {
    const name = $('#cm-name', bd).value.trim();
    const phone = $('#cm-phone', bd).value.trim();
    if (!name || !phone) { toast('Nombre y teléfono son requeridos', 'warning'); return; }
    const data = {
      name, phone,
      email: $('#cm-email', bd).value.trim(),
      channel: $('#cm-channel', bd).value,
      stage: $('#cm-stage', bd).value,
      value: parseInt($('#cm-value', bd).value) || 0,
      tags: $('#cm-tags', bd).value.split(',').map(t => t.trim()).filter(Boolean),
      notes: $('#cm-notes', bd).value.trim()
    };
    if (isEdit) { DB.updateContact(id, data); toast('Contacto actualizado', 'success'); }
    else { DB.addContact(data); toast('Contacto creado', 'success'); }
    close();
    renderView(currentView);
  });
};

const openStageModal = (id) => {
  const c = DB.getContact(id);
  const { bd, close } = modal(
    'Mover etapa',
    `
      <p style="color:var(--stone-600);margin-bottom:16px">¿A qué etapa quieres mover a <strong>${c.name}</strong>?</p>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${['nuevo','interesado','cotizado','pagado','perdido'].map(st => `
          <button class="btn btn-ghost" data-stage="${st}" style="justify-content:flex-start;padding:12px 16px">
            <span class="stage-pill stage-${st}">${stageLabel(st)}</span>
            ${st === c.stage ? '<span style="margin-left:auto;color:var(--green-600);font-weight:700">Actual</span>' : ''}
          </button>
        `).join('')}
      </div>
    `
  );
  $$('button[data-stage]', bd).forEach(b => {
    b.addEventListener('click', () => {
      DB.moveContactStage(id, b.dataset.stage);
      toast(`Movido a "${stageLabel(b.dataset.stage)}"`, 'success');
      close();
      renderView(currentView);
    });
  });
};

// ═══ CAMPAÑAS ═══
const renderCampanas = () => {
  const campaigns = DB.getCampaigns();
  const totalSent = campaigns.filter(c => c.status === 'completed').reduce((s,c) => s + c.contacts, 0);
  const totalDelivered = campaigns.reduce((s,c) => s + c.delivered, 0);
  const totalRead = campaigns.reduce((s,c) => s + c.read, 0);
  const totalReplied = campaigns.reduce((s,c) => s + c.replied, 0);

  const container = $('#view-campanas .view-inner');
  container.innerHTML = `
    <div class="campaigns-limits">
      <div class="limit-card">
        <div class="limit-card-icon" style="background:linear-gradient(135deg,var(--sky-500),var(--sky-700))">📊</div>
        <div class="limit-card-info">
          <div class="limit-card-title">Límite Meta diario</div>
          <div class="limit-card-value">1,250 / 10,000</div>
          <div class="limit-card-bar"><div class="limit-card-bar-fill" style="width:12.5%"></div></div>
          <div class="limit-card-hint">12.5% usado · renueva en 18h</div>
        </div>
      </div>
      <div class="limit-card">
        <div class="limit-card-icon" style="background:linear-gradient(135deg,var(--green-500),var(--green-700))">💬</div>
        <div class="limit-card-info">
          <div class="limit-card-title">Costo Meta del mes</div>
          <div class="limit-card-value">$3,480 MXN</div>
          <div class="limit-card-hint">Presupuesto: $8,000 MXN</div>
        </div>
      </div>
      <div class="limit-card">
        <div class="limit-card-icon" style="background:linear-gradient(135deg,var(--yellow-500),var(--yellow-600))">⭐</div>
        <div class="limit-card-info">
          <div class="limit-card-title">Calificación Meta</div>
          <div class="limit-card-value">Alta ✓</div>
          <div class="limit-card-hint">Sin reportes · mantén buenas prácticas</div>
        </div>
      </div>
    </div>

    <div class="campaigns-stats">
      <div class="stat-tile"><div class="stat-tile-label">Enviadas</div><div class="stat-tile-value">${campaigns.filter(c=>c.status==='completed').length}</div><div class="stat-tile-delta">↑ 3 este mes</div></div>
      <div class="stat-tile"><div class="stat-tile-label">Contactos</div><div class="stat-tile-value">${formatNumber(totalSent)}</div><div class="stat-tile-delta">alcance total</div></div>
      <div class="stat-tile"><div class="stat-tile-label">Entregados</div><div class="stat-tile-value">${formatNumber(totalDelivered)}</div><div class="stat-tile-delta">${totalSent ? Math.round(totalDelivered/totalSent*100) : 0}%</div></div>
      <div class="stat-tile"><div class="stat-tile-label">Leídos</div><div class="stat-tile-value">${formatNumber(totalRead)}</div><div class="stat-tile-delta">${totalDelivered ? Math.round(totalRead/totalDelivered*100) : 0}%</div></div>
      <div class="stat-tile"><div class="stat-tile-label">Respuestas</div><div class="stat-tile-value">${formatNumber(totalReplied)}</div><div class="stat-tile-delta">${totalRead ? Math.round(totalReplied/totalRead*100) : 0}%</div></div>
      <div class="stat-tile"><div class="stat-tile-label">Conversión</div><div class="stat-tile-value">14.2%</div><div class="stat-tile-delta">↑ 2.1pp</div></div>
      <div class="stat-tile"><div class="stat-tile-label">CTR</div><div class="stat-tile-value">8.7%</div><div class="stat-tile-delta">vs 6.3% promedio</div></div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div class="card-title">Todas las campañas</div>
        <div class="card-subtitle">Historial y rendimiento</div>
      </div>
      <button class="btn btn-primary btn-sm" id="campaign-new">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva campaña
      </button>
    </div>

    <div class="campaigns-list">
      <div class="campaign-row campaign-row-header">
        <div>Campaña</div><div>Estado</div><div>Contactos</div><div>Entreg.</div><div>Leídos</div><div>Resp.</div><div style="text-align:right">Acciones</div>
      </div>
      ${campaigns.map(c => `
        <div class="campaign-row">
          <div>
            <div class="campaign-name">${c.name}</div>
            <div class="campaign-sub">${c.sent ? formatDate(c.sent) : 'Sin enviar'} · ${c.channel}</div>
          </div>
          <div><span class="campaign-status ${c.status}">${c.status === 'completed' ? 'Enviada' : c.status === 'sending' ? 'Enviando' : c.status === 'scheduled' ? 'Programada' : 'Borrador'}</span></div>
          <div class="campaign-metric">${c.contacts ? formatNumber(c.contacts) : '—'}</div>
          <div class="campaign-metric">${c.delivered ? formatNumber(c.delivered) : '—'}<div class="campaign-metric-pct">${c.contacts ? Math.round(c.delivered/c.contacts*100) : 0}%</div></div>
          <div class="campaign-metric">${c.read ? formatNumber(c.read) : '—'}<div class="campaign-metric-pct">${c.delivered ? Math.round(c.read/c.delivered*100) : 0}%</div></div>
          <div class="campaign-metric">${c.replied ? formatNumber(c.replied) : '—'}<div class="campaign-metric-pct">${c.read ? Math.round(c.replied/c.read*100) : 0}%</div></div>
          <div style="text-align:right">
            ${c.status === 'draft' ? `<button class="btn btn-sm btn-primary" data-send="${c.id}">Enviar</button>` : ''}
            <button class="btn-icon" data-del="${c.id}" title="Eliminar" style="color:var(--red-500)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  $('#campaign-new').addEventListener('click', openCampaignModal);
  $$('[data-send]').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.send;
      DB.sendCampaign(id);
      toast('Campaña enviándose... (se completará en 3s)', 'info');
      renderCampanas();
      setTimeout(() => {
        if (currentView === 'campanas') renderCampanas();
        toast('Campaña enviada con éxito', 'success');
      }, 3500);
    });
  });
  $$('[data-del]').forEach(b => {
    b.addEventListener('click', () => {
      if (confirm('¿Eliminar esta campaña?')) {
        DB.deleteCampaign(b.dataset.del);
        toast('Campaña eliminada', 'success');
        renderCampanas();
      }
    });
  });
};

const openCampaignModal = () => {
  const { bd, close } = modal(
    'Nueva campaña',
    `
      <div class="form-group">
        <label class="form-label">Nombre de la campaña</label>
        <input class="form-input" id="cp-name" placeholder="Ej. Promo Verano 2026">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Canal</label>
          <select class="form-select" id="cp-channel">
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Plantilla</label>
          <select class="form-select" id="cp-template">
            <option value="promo_mxn">promo_mxn (aprobada)</option>
            <option value="winback_v2">winback_v2 (aprobada)</option>
            <option value="welcome_new">welcome_new (aprobada)</option>
            <option value="event_reminder">event_reminder (aprobada)</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Audiencia</label>
        <select class="form-select" id="cp-audience">
          <option value="all">Todos los contactos (${DB.getContacts().length})</option>
          <option value="interesado">Solo interesados</option>
          <option value="cotizado">Solo cotizados</option>
          <option value="pagado">Solo clientes pagados</option>
          <option value="winback">Winback (sin actividad 30d)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Mensaje</label>
        <textarea class="form-textarea" id="cp-body" placeholder="¡Hola {{1}}! Tenemos una promoción especial para ti...">¡Hola {{1}}! Tenemos una oferta especial esta semana. ¿Te interesa conocerla? Responde SÍ para más info. 🎁</textarea>
        <div class="form-hint">Variables disponibles: {{1}} nombre · {{2}} empresa</div>
      </div>
    `,
    `
      <button class="btn btn-ghost" id="cp-cancel">Cancelar</button>
      <button class="btn btn-ghost" id="cp-draft">Guardar borrador</button>
      <button class="btn btn-yellow" id="cp-send">Enviar ahora</button>
    `
  );
  $('#cp-cancel', bd).addEventListener('click', close);
  const getData = () => ({
    name: $('#cp-name', bd).value.trim(),
    channel: $('#cp-channel', bd).value,
    template: $('#cp-template', bd).value,
    contacts: Math.floor(300 + Math.random()*700)
  });
  $('#cp-draft', bd).addEventListener('click', () => {
    const d = getData();
    if (!d.name) { toast('El nombre es requerido', 'warning'); return; }
    DB.addCampaign({ ...d, status:'draft' });
    toast('Borrador guardado', 'success');
    close(); renderCampanas();
  });
  $('#cp-send', bd).addEventListener('click', () => {
    const d = getData();
    if (!d.name) { toast('El nombre es requerido', 'warning'); return; }
    const c = DB.addCampaign(d);
    DB.sendCampaign(c.id);
    toast('Campaña enviándose...', 'info');
    close(); renderCampanas();
    setTimeout(() => { if (currentView==='campanas') renderCampanas(); toast('Campaña enviada ✓', 'success'); }, 3500);
  });
};

// ═══ AUTOMATIZACIONES ═══
const renderAutomatizaciones = () => {
  const autos = DB.getAutomations();
  const container = $('#view-automatizaciones .view-inner');
  container.innerHTML = `
    <div class="automations-types">
      <div class="type-card" data-new="rule">
        <div class="type-card-icon rule">⚡</div>
        <h3>Reglas WHEN → THEN</h3>
        <p>Dispara acciones cuando pase algo. Ej: "Si llega msg nuevo → asignar agente".</p>
        <span class="type-card-btn">+ Crear →</span>
      </div>
      <div class="type-card" data-new="chatbot">
        <div class="type-card-icon chatbot">🤖</div>
        <h3>Chatbots conversacionales</h3>
        <p>Flujos visuales con preguntas, opciones y bifurcaciones.</p>
        <span class="type-card-btn">+ Crear →</span>
      </div>
      <div class="type-card" data-new="sequence">
        <div class="type-card-icon sequence">⏰</div>
        <h3>Secuencias programadas</h3>
        <p>Cadenas de mensajes con delays para nurturing y seguimiento.</p>
        <span class="type-card-btn">+ Crear →</span>
      </div>
      <div class="type-card" data-new="keyword">
        <div class="type-card-icon keyword">🔑</div>
        <h3>Keywords con fuzzy match</h3>
        <p>Palabras clave con sinónimos y tolerancia a errores.</p>
        <span class="type-card-btn">+ Crear →</span>
      </div>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div class="card-title">Automatizaciones activas</div>
        <div class="card-subtitle">${autos.filter(a=>a.active).length} activas · ${autos.length} totales</div>
      </div>
    </div>

    <div class="automations-list">
      <div class="automations-row automations-row-header">
        <div>Nombre</div><div>Trigger</div><div>Acción</div><div>Ejecuciones</div><div style="text-align:right">Estado</div>
      </div>
      ${autos.map(a => `
        <div class="automations-row">
          <div>
            <div class="automation-name">${a.name}</div>
            <span class="automation-type-pill ${a.type}">${a.type}</span>
          </div>
          <div style="font-size:12px;color:var(--stone-600)">${a.trigger}</div>
          <div style="font-size:12px;color:var(--stone-600)">${a.action}</div>
          <div style="font-family:var(--font-mono);font-weight:700">${formatNumber(a.runs)}</div>
          <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px">
            <label class="toggle">
              <input type="checkbox" data-toggle="${a.id}" ${a.active ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-del-auto="${a.id}" title="Eliminar" style="color:var(--red-500)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg></button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  $$('[data-toggle]').forEach(inp => {
    inp.addEventListener('change', () => {
      const a = DB.toggleAutomation(inp.dataset.toggle);
      toast(`Automatización ${a.active ? 'activada' : 'desactivada'}`, 'success');
    });
  });
  $$('[data-del-auto]').forEach(b => {
    b.addEventListener('click', () => {
      if (confirm('¿Eliminar esta automatización?')) {
        DB.deleteAutomation(b.dataset.delAuto);
        toast('Eliminada', 'success');
        renderAutomatizaciones();
      }
    });
  });
  $$('[data-new]').forEach(c => {
    c.addEventListener('click', () => {
      const type = c.dataset.new;
      openAutomationModal(type);
    });
  });
};

const openAutomationModal = (type) => {
  const labels = {rule:'Regla WHEN → THEN', chatbot:'Chatbot conversacional', sequence:'Secuencia programada', keyword:'Keyword con fuzzy match'};
  const { bd, close } = modal(
    `Nueva ${labels[type]}`,
    `
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" id="au-name" placeholder="Ej. Bienvenida nuevos leads">
      </div>
      <div class="form-group">
        <label class="form-label">Trigger (cuándo se ejecuta)</label>
        <input class="form-input" id="au-trigger" placeholder="Ej. Primer mensaje recibido">
      </div>
      <div class="form-group">
        <label class="form-label">Acción (qué hace)</label>
        <textarea class="form-textarea" id="au-action" placeholder="Ej. Enviar mensaje de bienvenida y etiqueta"></textarea>
      </div>
    `,
    `
      <button class="btn btn-ghost" id="au-cancel">Cancelar</button>
      <button class="btn btn-primary" id="au-save">Crear automatización</button>
    `
  );
  $('#au-cancel', bd).addEventListener('click', close);
  $('#au-save', bd).addEventListener('click', () => {
    const name = $('#au-name', bd).value.trim();
    const trigger = $('#au-trigger', bd).value.trim();
    const action = $('#au-action', bd).value.trim();
    if (!name || !trigger || !action) { toast('Completa todos los campos', 'warning'); return; }
    DB.addAutomation({ name, trigger, action, type });
    toast('Automatización creada', 'success');
    close(); renderAutomatizaciones();
  });
};

// ═══ ANALÍTICA ═══
const renderAnalitica = () => {
  const s = DB.getStats();
  const container = $('#view-analitica .view-inner');
  container.innerHTML = `
    <div class="analytics-bigstats">
      <div class="big-stat sky">
        <div class="big-stat-label">Mensajes totales</div>
        <div class="big-stat-value">${formatNumber(s.total_messages * 14)}</div>
        <div class="big-stat-delta up">↑ 23% vs mes anterior</div>
      </div>
      <div class="big-stat green">
        <div class="big-stat-label">Ingresos mes</div>
        <div class="big-stat-value">${formatMXN(s.revenue)}</div>
        <div class="big-stat-delta up">↑ 28% vs mes anterior</div>
      </div>
      <div class="big-stat yellow">
        <div class="big-stat-label">Conversión</div>
        <div class="big-stat-value">${s.conversion_rate}%</div>
        <div class="big-stat-delta up">↑ 3.2pp</div>
      </div>
      <div class="big-stat violet">
        <div class="big-stat-label">Respuesta prom.</div>
        <div class="big-stat-value">${s.response_time_avg} min</div>
        <div class="big-stat-delta down">↓ 45%</div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header">
        <div>
          <div class="card-title">Embudo de conversión</div>
          <div class="card-subtitle">Análisis del ciclo de vida de tus leads</div>
        </div>
      </div>
      <div class="funnel-horizontal">
        ${[
          ['nuevos','Nuevos',s.nuevos,'#6B7280'],
          ['interesados','Interesados',s.interesados,'#EAB308'],
          ['cotizados','Cotizados',s.cotizados,'#0EA5E9'],
          ['pagados','Pagados',s.pagados,'#22C55E']
        ].map(([k,l,v,color], i, arr) => {
          const total = arr[0][2] || 1;
          const pct = Math.round((v / total) * 100);
          return `
            <div class="funnel-stage" style="background:linear-gradient(135deg,${color},${color}cc)">
              <div class="funnel-stage-label">${l}</div>
              <div class="funnel-stage-value">${v}</div>
              <div class="funnel-stage-pct">${pct}%</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <div class="card-title">Mensajes por día (últimos 7 días)</div>
        </div>
        <svg viewBox="0 0 700 200" style="width:100%;height:200px">
          <defs>
            <linearGradient id="chartG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#0EA5E9" stop-opacity=".3"/>
              <stop offset="100%" stop-color="#0EA5E9" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path d="M0,140 L100,120 L200,100 L300,80 L400,70 L500,50 L600,40 L700,30 L700,200 L0,200 Z" fill="url(#chartG)"/>
          <path d="M0,140 L100,120 L200,100 L300,80 L400,70 L500,50 L600,40 L700,30" fill="none" stroke="#0EA5E9" stroke-width="3" stroke-linecap="round"/>
          ${['L','M','Mi','J','V','S','D'].map((d,i) => `<text x="${i*100+50}" y="195" text-anchor="middle" font-size="11" fill="#6B7280">${d}</text>`).join('')}
        </svg>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Ranking de agentes</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${DB.getTeam().sort((a,b) => b.responses_today - a.responses_today).map((m,i) => `
            <div style="display:flex;align-items:center;gap:12px">
              <div style="width:24px;text-align:center;font-family:var(--font-display);font-weight:800;color:var(--navy-900)">${i+1}</div>
              <div class="avatar avatar-sm" style="background:linear-gradient(135deg,${m.color},${m.color}cc)">${m.avatar}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:700">${m.name}</div>
                <div style="font-size:11px;color:var(--stone-500)">${m.responses_today} respuestas · CX ${m.cx_score}</div>
              </div>
              <div style="width:100px;height:6px;background:var(--stone-100);border-radius:3px;overflow:hidden">
                <div style="width:${(m.responses_today/50)*100}%;height:100%;background:linear-gradient(90deg,var(--sky-500),var(--green-500))"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

// ═══ ARCHIVADOS ═══
const renderArchivados = () => {
  const archived = DB.getContacts(true).filter(c => c.archived);
  const container = $('#view-archivados .view-inner');
  container.style.padding = '0';
  container.innerHTML = `
    <div class="archived-layout">
      <div class="archived-list">
        <div class="archived-header">
          <div style="font-family:var(--font-display);font-size:16px;font-weight:800;margin-bottom:4px">Archivados</div>
          <div style="font-size:12px;color:var(--stone-500)">${archived.length} conversaciones archivadas</div>
        </div>
        <div class="archived-scroll">
          ${archived.length === 0 ? '<div style="padding:40px 20px;text-align:center;color:var(--stone-500);font-size:13px">No hay archivados</div>' : archived.map(c => `
            <div class="chat-item" data-unarchive-id="${c.id}" style="margin:4px 8px">
              <div class="avatar avatar-sm" style="background:linear-gradient(135deg,${c.channel === 'instagram' ? '#E1306C,#833AB4' : '#22C55E,#15803D'})">${c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
              <div class="chat-item-info">
                <div class="chat-item-top">
                  <div class="chat-item-name">${c.name}</div>
                  <div class="chat-item-time">${timeAgo(c.created)}</div>
                </div>
                <div class="chat-item-preview">${c.last_msg || '(sin mensajes)'}</div>
                <div style="display:flex;gap:6px;align-items:center">
                  <span class="stage-pill stage-${c.stage}">${stageLabel(c.stage)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="chat-main" style="display:flex;align-items:center;justify-content:center">
        <div class="chat-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          <div class="chat-empty-title">Conversaciones archivadas</div>
          <div class="chat-empty-sub">Haz click en una para desarchivarla</div>
        </div>
      </div>
    </div>
  `;

  $$('[data-unarchive-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.unarchiveId;
      if (confirm('¿Desarchivar esta conversación?')) {
        DB.unarchiveContact(id);
        toast('Conversación desarchivada', 'success');
        renderArchivados();
      }
    });
  });
};

// ═══ AJUSTES ═══
let settingsSection = 'perfil';
const renderAjustes = () => {
  const u = DB.getUser();
  const settings = DB.getSettings();
  const integrations = DB.getIntegrations();
  const team = DB.getTeam();
  const container = $('#view-ajustes .view-inner');

  const sections = {
    perfil: () => `
      <div class="settings-section-title">Perfil de usuario</div>
      <div class="settings-section-sub">Datos personales y preferencias de cuenta</div>
      <div class="form-group"><label class="form-label">Nombre completo</label><input class="form-input" id="s-name" value="${u.name}"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="s-email" value="${u.email}"></div>
      <div class="form-group"><label class="form-label">Teléfono</label><input class="form-input" id="s-phone" value="${u.phone}"></div>
      <div class="form-group"><label class="form-label">Empresa</label><input class="form-input" id="s-company" value="${u.company}"></div>
      <button class="btn btn-primary" id="s-save-profile">Guardar cambios</button>
    `,
    equipo: () => `
      <div class="settings-section-title">Miembros del equipo</div>
      <div class="settings-section-sub">${team.length} miembros · Pro permite hasta 5</div>
      ${team.map(m => `
        <div class="settings-row">
          <div style="display:flex;gap:12px;align-items:center;flex:1">
            <div class="avatar avatar-sm ${m.status==='online'?'avatar-online':''}" style="background:linear-gradient(135deg,${m.color},${m.color}cc)">${m.avatar}</div>
            <div>
              <div class="settings-row-title">${m.name}</div>
              <div class="settings-row-desc">${m.email} · ${m.role}</div>
            </div>
          </div>
          <span class="badge badge-${m.status==='online'?'green':m.status==='away'?'yellow':'red'}">${m.status === 'online' ? 'EN LÍNEA' : m.status === 'away' ? 'AUSENTE' : 'OFFLINE'}</span>
        </div>
      `).join('')}
      <button class="btn btn-primary mt-4" onclick="toast('Invitación enviada (demo)','success')">+ Invitar miembro</button>
    `,
    notificaciones: () => `
      <div class="settings-section-title">Notificaciones</div>
      <div class="settings-section-sub">Controla qué alertas recibes y cómo</div>
      <div class="settings-row">
        <div class="settings-row-info">
          <div class="settings-row-title">Notificaciones de escritorio</div>
          <div class="settings-row-desc">Alertas en tu navegador cuando llegan mensajes</div>
        </div>
        <label class="toggle"><input type="checkbox" ${settings.notifications_desktop?'checked':''} data-setting="notifications_desktop"><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-row-info">
          <div class="settings-row-title">Sonido de alertas</div>
          <div class="settings-row-desc">Reproducir sonido al recibir mensajes nuevos</div>
        </div>
        <label class="toggle"><input type="checkbox" ${settings.notifications_sound?'checked':''} data-setting="notifications_sound"><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-row-info">
          <div class="settings-row-title">Alertas de leads calientes</div>
          <div class="settings-row-desc">Avisar inmediatamente cuando un lead menciona "pagar", "comprar", etc.</div>
        </div>
        <label class="toggle"><input type="checkbox" ${settings.alerts_hot_leads?'checked':''} data-setting="alerts_hot_leads"><span class="toggle-slider"></span></label>
      </div>
    `,
    automatico: () => `
      <div class="settings-section-title">Respuestas automáticas</div>
      <div class="settings-section-sub">Configuración de respuestas automatizadas y horarios</div>
      <div class="settings-row">
        <div class="settings-row-info">
          <div class="settings-row-title">Fuera de oficina</div>
          <div class="settings-row-desc">Enviar mensaje automático fuera de horario</div>
        </div>
        <label class="toggle"><input type="checkbox" ${settings.out_of_office?'checked':''} data-setting="out_of_office"><span class="toggle-slider"></span></label>
      </div>
      <div class="form-group mt-4">
        <label class="form-label">Mensaje fuera de oficina</label>
        <textarea class="form-textarea" id="s-ooo-msg">${settings.out_of_office_msg}</textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group"><label class="form-label">Hora de inicio</label><input class="form-input" type="time" id="s-hr-start" value="${settings.working_hours_start}"></div>
        <div class="form-group"><label class="form-label">Hora de cierre</label><input class="form-input" type="time" id="s-hr-end" value="${settings.working_hours_end}"></div>
      </div>
      <div class="settings-row">
        <div class="settings-row-info">
          <div class="settings-row-title">Auto-asignación</div>
          <div class="settings-row-desc">Asignar conversaciones nuevas automáticamente entre agentes</div>
        </div>
        <label class="toggle"><input type="checkbox" ${settings.auto_assign?'checked':''} data-setting="auto_assign"><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-row-info">
          <div class="settings-row-title">IA Support Agent</div>
          <div class="settings-row-desc">Respuestas automáticas con inteligencia artificial</div>
        </div>
        <label class="toggle"><input type="checkbox" ${settings.ai_agent_enabled?'checked':''} data-setting="ai_agent_enabled"><span class="toggle-slider"></span></label>
      </div>
      <button class="btn btn-primary mt-4" id="s-save-auto">Guardar cambios</button>
    `,
    integraciones: () => `
      <div class="settings-section-title">Integraciones</div>
      <div class="settings-section-sub">Conecta Flowchat con tus herramientas favoritas</div>
      ${integrations.map(i => `
        <div class="settings-row">
          <div style="display:flex;gap:14px;align-items:center;flex:1">
            <div style="width:44px;height:44px;border-radius:10px;background:${i.color};display:flex;align-items:center;justify-content:center;font-size:22px;color:white">${i.icon}</div>
            <div>
              <div class="settings-row-title">${i.name}</div>
              <div class="settings-row-desc">${i.connected ? `Conectado · última sync: ${timeAgo(i.last_sync)}` : 'No conectado'}</div>
            </div>
          </div>
          <button class="btn btn-sm ${i.connected ? 'btn-ghost' : 'btn-primary'}" data-integ="${i.id}">${i.connected ? 'Desconectar' : 'Conectar'}</button>
        </div>
      `).join('')}
    `,
    facturacion: () => `
      <div class="settings-section-title">Plan y facturación</div>
      <div class="settings-section-sub">Gestiona tu suscripción</div>
      <div style="background:linear-gradient(135deg,var(--navy-900),var(--sky-900));color:white;padding:24px;border-radius:var(--radius-lg);margin-bottom:20px">
        <div style="font-family:var(--font-mono);font-size:11px;letter-spacing:.1em;color:var(--sky-300);margin-bottom:6px">PLAN ACTUAL</div>
        <div style="font-family:var(--font-display);font-size:28px;font-weight:900">Pro</div>
        <div style="font-size:14px;color:rgba(255,255,255,.7);margin-top:4px">$1,799 MXN / mes · próximo cobro en 12 días</div>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><div class="settings-row-title">Método de pago</div><div class="settings-row-desc">Visa terminada en •••• 4242</div></div>
        <button class="btn btn-sm btn-ghost" onclick="toast('Redirigiendo (demo)','info')">Cambiar</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><div class="settings-row-title">Facturas</div><div class="settings-row-desc">Historial descargable en PDF</div></div>
        <button class="btn btn-sm btn-ghost" onclick="toast('Descargando últimas 12 facturas (demo)','info')">Ver todas</button>
      </div>
      <button class="btn btn-danger mt-6" onclick="if(confirm('¿Cancelar suscripción? Acceso hasta fin de ciclo.')){toast('Suscripción cancelada','warning')}">Cancelar plan</button>
    `,
    datos: () => `
      <div class="settings-section-title">Datos y seguridad</div>
      <div class="settings-section-sub">Exporta, importa o resetea tu información</div>
      <div class="settings-row">
        <div class="settings-row-info"><div class="settings-row-title">Exportar todos los datos</div><div class="settings-row-desc">Descarga contactos, conversaciones y configuración en JSON</div></div>
        <button class="btn btn-sm btn-ghost" id="s-export">Exportar</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><div class="settings-row-title">Autenticación en 2 pasos</div><div class="settings-row-desc">Mayor seguridad con código SMS o app</div></div>
        <button class="btn btn-sm btn-ghost" onclick="toast('2FA activado (demo)','success')">Activar</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><div class="settings-row-title" style="color:var(--red-600)">Resetear datos demo</div><div class="settings-row-desc">Restaura todos los datos de ejemplo (solo para esta demo)</div></div>
        <button class="btn btn-sm btn-danger" id="s-reset">Resetear</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><div class="settings-row-title" style="color:var(--red-600)">Cerrar sesión</div><div class="settings-row-desc">Cerrar sesión en este dispositivo</div></div>
        <button class="btn btn-sm btn-danger" id="s-logout">Cerrar sesión</button>
      </div>
    `
  };

  container.innerHTML = `
    <div class="settings-layout">
      <div class="settings-nav">
        <button class="settings-nav-item ${settingsSection==='perfil'?'active':''}" data-sec="perfil">👤 Perfil</button>
        <button class="settings-nav-item ${settingsSection==='equipo'?'active':''}" data-sec="equipo">👥 Equipo</button>
        <button class="settings-nav-item ${settingsSection==='notificaciones'?'active':''}" data-sec="notificaciones">🔔 Notificaciones</button>
        <button class="settings-nav-item ${settingsSection==='automatico'?'active':''}" data-sec="automatico">🤖 Respuestas auto</button>
        <button class="settings-nav-item ${settingsSection==='integraciones'?'active':''}" data-sec="integraciones">🔌 Integraciones</button>
        <button class="settings-nav-item ${settingsSection==='facturacion'?'active':''}" data-sec="facturacion">💳 Facturación</button>
        <button class="settings-nav-item ${settingsSection==='datos'?'active':''}" data-sec="datos">🔐 Datos y seguridad</button>
      </div>
      <div class="settings-content">${sections[settingsSection]()}</div>
    </div>
  `;

  $$('.settings-nav-item').forEach(b => {
    b.addEventListener('click', () => {
      settingsSection = b.dataset.sec;
      renderAjustes();
    });
  });

  $$('[data-setting]').forEach(inp => {
    inp.addEventListener('change', () => {
      DB.updateSettings({ [inp.dataset.setting]: inp.checked });
      toast('Preferencia guardada', 'success');
    });
  });

  const saveProf = $('#s-save-profile');
  if (saveProf) saveProf.addEventListener('click', () => {
    DB.updateUser({
      name: $('#s-name').value,
      email: $('#s-email').value,
      phone: $('#s-phone').value,
      company: $('#s-company').value
    });
    toast('Perfil actualizado', 'success');
  });

  const saveAuto = $('#s-save-auto');
  if (saveAuto) saveAuto.addEventListener('click', () => {
    DB.updateSettings({
      out_of_office_msg: $('#s-ooo-msg').value,
      working_hours_start: $('#s-hr-start').value,
      working_hours_end: $('#s-hr-end').value
    });
    toast('Ajustes guardados', 'success');
  });

  $$('[data-integ]').forEach(b => {
    b.addEventListener('click', () => {
      const i = DB.toggleIntegration(b.dataset.integ);
      toast(`${i.name} ${i.connected ? 'conectado' : 'desconectado'}`, 'success');
      renderAjustes();
    });
  });

  const exp = $('#s-export');
  if (exp) exp.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(DB.get(), null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'flowchat-export.json'; a.click();
    URL.revokeObjectURL(url);
    toast('Datos exportados', 'success');
  });

  const reset = $('#s-reset');
  if (reset) reset.addEventListener('click', () => {
    if (confirm('¿Resetear a datos demo? Esto borrará todos tus cambios.')) {
      DB.reset();
      toast('Datos reseteados', 'success');
      renderView(currentView);
    }
  });

  const logout = $('#s-logout');
  if (logout) logout.addEventListener('click', () => {
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem('flowchat_session');
      window.location.href = 'login.html';
    }
  });
};

// ═══ SIDEBAR ═══
const renderSidebar = () => {
  const u = DB.getUser();
  const unread = DB.getContacts().filter(c => c.unread > 0).length;
  return `
    <div class="sidebar-logo">
      <div class="sidebar-logo-mark">${LOGO_SVG}</div>
      <div class="sidebar-logo-text"><span class="flow">Flow</span><span class="chat">chat</span></div>
    </div>
    <div class="sidebar-section-label">Principal</div>
    <nav class="sidebar-nav">
      <button class="sidebar-item" data-view="dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </button>
      <button class="sidebar-item" data-view="chat">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Bandeja
        ${unread > 0 ? `<span class="sidebar-item-badge">${unread}</span>` : ''}
      </button>
      <button class="sidebar-item" data-view="embudos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
        Embudos
      </button>
      <button class="sidebar-item" data-view="contactos">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M23 11h-6"/></svg>
        Contactos
      </button>
    </nav>
    <div class="sidebar-section-label">Ventas y marketing</div>
    <nav class="sidebar-nav">
      <button class="sidebar-item" data-view="campanas">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6"/></svg>
        Campañas
      </button>
      <button class="sidebar-item" data-view="automatizaciones">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9z"/></svg>
        Automatizaciones
      </button>
      <button class="sidebar-item" data-view="analitica">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-6 4 4 5-8"/></svg>
        Analítica
      </button>
    </nav>
    <div class="sidebar-section-label">Otros</div>
    <nav class="sidebar-nav">
      <button class="sidebar-item" data-view="archivados">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
        Archivados
      </button>
      <button class="sidebar-item" data-view="ajustes">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        Ajustes
      </button>
    </nav>
    <div class="sidebar-user" id="sidebar-user-btn">
      <div class="avatar avatar-sm avatar-online">${u.avatar}</div>
      <div class="sidebar-user-info">
        <div class="sidebar-user-name">${u.name}</div>
        <div class="sidebar-user-role">${u.role} · ${u.plan}</div>
      </div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  `;
};

// ═══ INIT ═══
const init = () => {
  $('.sidebar').innerHTML = renderSidebar();
  $('.topbar').innerHTML = renderTopbar();

  $$('.sidebar-item').forEach(b => {
    b.addEventListener('click', () => route(b.dataset.view));
  });

  $('#sidebar-user-btn').addEventListener('click', () => {
    settingsSection = 'perfil';
    route('ajustes');
  });

  $('#topbar-new-contact').addEventListener('click', () => openContactModal());
  $('#topbar-search-input').addEventListener('input', e => {
    const v = e.target.value;
    if (v.length > 1) {
      route('contactos');
      setTimeout(() => {
        const filter = $('#contacts-filter');
        if (filter) { filter.value = v; renderContactos(v); }
      }, 100);
    }
  });

  // Notifications
  const notifBtn = $('#notif-btn');
  const notifDrop = $('#notif-dropdown');
  notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifDrop.classList.toggle('open');
    if (notifDrop.classList.contains('open')) renderNotifList();
  });
  document.addEventListener('click', () => notifDrop.classList.remove('open'));
  notifDrop.addEventListener('click', e => e.stopPropagation());
  $('#notif-markall').addEventListener('click', () => {
    DB.markAllNotificationsRead();
    renderNotifList();
    updateNotifDot();
    toast('Todas marcadas como leídas', 'success');
  });

  // Router inicial
  const hash = window.location.hash.slice(1);
  const startView = VIEWS[hash] ? hash : 'dashboard';
  route(startView);
};

// Start when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Make route global
window.route = route;
