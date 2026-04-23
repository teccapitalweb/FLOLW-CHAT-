/* ═══ FLOWCHAT DB — Backend simulado con localStorage ═══ */

const DB_KEY = 'flowchat_db_v1';

const seedData = () => ({
  user: {
    id: 'u1', name: 'Jesús Alberto', email: 'jesus@teccapital.mx',
    role: 'Owner', phone: '+52 238 165 2786',
    avatar: 'JA', company: 'TEC CAPITAL',
    plan: 'Pro', plan_price: 1799
  },

  team: [
    { id: 'a1', name: 'Laura Pérez', role: 'Admin', email: 'laura@teccapital.mx', status: 'online', avatar: 'LP', color: '#22C55E', responses_today: 47, cx_score: 92 },
    { id: 'a2', name: 'Miguel Torres', role: 'Seller', email: 'miguel@teccapital.mx', status: 'online', avatar: 'MT', color: '#0EA5E9', responses_today: 38, cx_score: 88 },
    { id: 'a3', name: 'Sofía García', role: 'Seller', email: 'sofia@teccapital.mx', status: 'away', avatar: 'SG', color: '#F97316', responses_today: 29, cx_score: 85 },
    { id: 'a4', name: 'Carlos Ruiz', role: 'Seller', email: 'carlos@teccapital.mx', status: 'offline', avatar: 'CR', color: '#8B5CF6', responses_today: 15, cx_score: 79 }
  ],

  contacts: [
    { id: 'c1', name: 'Ana Martínez', phone: '+52 55 1234 5678', email: 'ana@mail.com', stage: 'interesado', tags: ['Facebook Ads', 'curso MKT'], channel: 'whatsapp', value: 3200, assigned: 'a1', created: Date.now() - 2*86400000, archived: false, source: 'Meta Ads · Campaña MKT Digital', notes: 'Quiere inscribirse al curso de marketing digital. Tiene dudas sobre el certificado.', last_msg: '¿Tiene certificado?', unread: 2 },
    { id: 'c2', name: 'Brid García', phone: '+52 81 9876 5432', email: 'brid@mail.com', stage: 'cotizado', tags: ['Instagram', 'consultoría'], channel: 'instagram', value: 15000, assigned: 'a2', created: Date.now() - 5*86400000, archived: false, source: 'DM Instagram', notes: 'Empresaria interesada en consultoría de ventas.', last_msg: '¿Cuánto cuesta el paquete completo?', unread: 1 },
    { id: 'c3', name: 'Nico Cisneros', phone: '+52 33 5555 1111', email: 'nico@mail.com', stage: 'pagado', tags: ['referido', 'premium'], channel: 'whatsapp', value: 4500, assigned: 'a1', created: Date.now() - 10*86400000, archived: false, source: 'Referido de cliente', notes: 'Ya pagó la primera mensualidad. Seguimiento mensual.', last_msg: 'Perfecto, gracias por todo 🙌', unread: 0 },
    { id: 'c4', name: 'María López', phone: '+52 55 7777 8888', email: 'maria@mail.com', stage: 'nuevo', tags: ['WhatsApp orgánico'], channel: 'whatsapp', value: 0, assigned: null, created: Date.now() - 1*3600000, archived: false, source: 'Click-to-WhatsApp', notes: '', last_msg: 'Hola, vi su anuncio', unread: 3 },
    { id: 'c5', name: 'Roberto Jiménez', phone: '+52 998 321 4567', email: 'roberto@mail.com', stage: 'interesado', tags: ['Facebook Ads', 'programa anual'], channel: 'messenger', value: 24000, assigned: 'a3', created: Date.now() - 3*86400000, archived: false, source: 'Meta Ads · Campaña Anual', notes: 'Empresario del sector hotelero.', last_msg: 'Me interesa ver el temario', unread: 0 },
    { id: 'c6', name: 'Laura Fernández', phone: '+52 55 4455 6677', email: 'laura.f@mail.com', stage: 'pagado', tags: ['email marketing'], channel: 'whatsapp', value: 8900, assigned: 'a2', created: Date.now() - 15*86400000, archived: false, source: 'Newsletter', notes: 'Cliente recurrente, 3 compras previas.', last_msg: 'Todo perfecto ✨', unread: 0 },
    { id: 'c7', name: 'Pedro Vázquez', phone: '+52 722 888 9999', email: 'pedro@mail.com', stage: 'perdido', tags: ['no respondió'], channel: 'whatsapp', value: 0, assigned: 'a1', created: Date.now() - 20*86400000, archived: true, source: 'Landing form', notes: 'No respondió después de 7 seguimientos.', last_msg: '', unread: 0 },
    { id: 'c8', name: 'Valentina Ortega', phone: '+52 55 3322 1100', email: 'vale@mail.com', stage: 'cotizado', tags: ['Instagram Shop', 'VIP'], channel: 'instagram', value: 12500, assigned: 'a3', created: Date.now() - 6*86400000, archived: false, source: 'Instagram Shop', notes: 'Prefiere pago en cuotas.', last_msg: '¿Aceptan MSI?', unread: 1 },
    { id: 'c9', name: 'Diego Ramírez', phone: '+52 81 2211 3344', email: 'diego@mail.com', stage: 'nuevo', tags: ['QR offline'], channel: 'whatsapp', value: 0, assigned: null, created: Date.now() - 4*3600000, archived: false, source: 'QR en evento CDMX', notes: 'Escaneó QR en expo del fin de semana.', last_msg: 'Hola, nos vimos en la expo', unread: 1 },
    { id: 'c10', name: 'Paola Suárez', phone: '+52 33 7788 9900', email: 'paola@mail.com', stage: 'interesado', tags: ['referido'], channel: 'whatsapp', value: 5600, assigned: 'a2', created: Date.now() - 4*86400000, archived: false, source: 'Referido', notes: '', last_msg: 'Te llamo mañana', unread: 0 },
    { id: 'c11', name: 'Javier Mendoza', phone: '+52 55 1122 3344', email: 'javier@mail.com', stage: 'pagado', tags: ['repeat'], channel: 'whatsapp', value: 15800, assigned: 'a1', created: Date.now() - 45*86400000, archived: false, source: 'Google Ads', notes: 'Cliente desde hace 6 meses.', last_msg: 'Renovación confirmada 👍', unread: 0 },
    { id: 'c12', name: 'Carmen Delgado', phone: '+52 81 5544 3322', email: 'carmen@mail.com', stage: 'perdido', tags: ['objetó precio'], channel: 'whatsapp', value: 0, assigned: 'a3', created: Date.now() - 25*86400000, archived: true, source: 'Meta Ads', notes: 'Objetó el precio. No cerró.', last_msg: '', unread: 0 }
  ],

  conversations: {
    'c1': [
      { from: 'contact', text: 'Hola, vi su anuncio en Facebook sobre el curso de marketing digital', time: Date.now() - 2*86400000 - 3600000 },
      { from: 'bot', text: '¡Hola Ana! 👋 Gracias por tu interés. Soy el asistente de Flowchat. ¿Qué tipo de marketing te interesa más: redes sociales, email marketing o SEO?', time: Date.now() - 2*86400000 - 3500000 },
      { from: 'contact', text: 'Redes sociales sobre todo, me interesa para mi negocio', time: Date.now() - 2*86400000 - 3400000 },
      { from: 'bot', text: 'Perfecto. Te comparto el link del curso más popular: 📚 Marketing Digital 360° (4 semanas, $3,200 MXN). ¿Te envío el temario completo?', time: Date.now() - 2*86400000 - 3300000 },
      { from: 'contact', text: 'Sí por favor', time: Date.now() - 86400000 },
      { from: 'agent', text: '¡Hola Ana! Soy Laura de TEC CAPITAL 😊 Te adjunto el temario completo del curso. Cualquier duda te ayudo.', time: Date.now() - 86400000 + 300000, agent_id: 'a1' },
      { from: 'contact', text: '¿Tiene certificado?', time: Date.now() - 1800000 }
    ],
    'c2': [
      { from: 'contact', text: 'Hola, me recomendaron su servicio', time: Date.now() - 5*86400000 },
      { from: 'agent', text: '¡Hola Brid! Gracias por contactarnos. ¿Nos cuentas un poco de tu negocio para ver cómo te podemos ayudar?', time: Date.now() - 5*86400000 + 600000, agent_id: 'a2' },
      { from: 'contact', text: 'Tengo una tienda online de ropa y quiero escalar ventas', time: Date.now() - 5*86400000 + 900000 },
      { from: 'contact', text: '¿Cuánto cuesta el paquete completo?', time: Date.now() - 300000 }
    ],
    'c4': [
      { from: 'contact', text: 'Hola, vi su anuncio', time: Date.now() - 3600000 },
      { from: 'contact', text: 'Me pueden dar info?', time: Date.now() - 3500000 },
      { from: 'contact', text: 'Hola?', time: Date.now() - 1800000 }
    ],
    'c9': [
      { from: 'contact', text: 'Hola, nos vimos en la expo del fin de semana', time: Date.now() - 4*3600000 }
    ],
    'c5': [
      { from: 'contact', text: 'Saludos, vi el programa anual', time: Date.now() - 3*86400000 },
      { from: 'bot', text: '¡Hola! 👋 El programa anual incluye mentoría mensual, acceso a comunidad y certificación. ¿Te interesa conocer el detalle?', time: Date.now() - 3*86400000 + 120000 },
      { from: 'contact', text: 'Me interesa ver el temario', time: Date.now() - 2*86400000 }
    ]
  },

  campaigns: [
    { id: 'cm1', name: 'Black Friday 2025', sent: Date.now() - 7*86400000, status: 'completed', contacts: 2847, delivered: 2791, read: 1523, replied: 387, template: 'promo_bf_2025', channel: 'whatsapp' },
    { id: 'cm2', name: 'Reactivación clientes', sent: Date.now() - 14*86400000, status: 'completed', contacts: 1612, delivered: 1584, read: 892, replied: 156, template: 'winback_v2', channel: 'whatsapp' },
    { id: 'cm3', name: 'Lanzamiento programa anual', sent: Date.now() - 3*86400000, status: 'completed', contacts: 574, delivered: 561, read: 308, replied: 73, template: 'anual_launch', channel: 'whatsapp' },
    { id: 'cm4', name: 'Flash Sale · Marzo', sent: null, status: 'draft', contacts: 0, delivered: 0, read: 0, replied: 0, template: 'flash_sale', channel: 'whatsapp' },
    { id: 'cm5', name: 'Recordatorio webinar', sent: Date.now() - 2*3600000, status: 'sending', contacts: 450, delivered: 287, read: 102, replied: 18, template: 'webinar_reminder', channel: 'whatsapp' },
    { id: 'cm6', name: 'Newsletter semanal IG', sent: Date.now() - 1*86400000, status: 'completed', contacts: 1200, delivered: 1180, read: 856, replied: 124, template: 'newsletter_ig', channel: 'instagram' }
  ],

  automations: [
    { id: 'at1', name: 'Bienvenida nuevos leads', type: 'rule', trigger: 'Primer mensaje recibido', action: 'Enviar mensaje de bienvenida y tag "Nuevo"', active: true, runs: 1247, created: Date.now() - 30*86400000 },
    { id: 'at2', name: 'Seguimiento 24h sin respuesta', type: 'sequence', trigger: 'Sin respuesta 24h', action: 'Enviar recordatorio + oferta', active: true, runs: 342, created: Date.now() - 25*86400000 },
    { id: 'at3', name: 'Chatbot menú principal', type: 'chatbot', trigger: 'Palabra clave: "info"', action: 'Mostrar menú interactivo de servicios', active: true, runs: 890, created: Date.now() - 20*86400000 },
    { id: 'at4', name: 'Alerta lead caliente', type: 'rule', trigger: 'Contacto escribe "pagar" o "precio"', action: 'Notificar al equipo + mover a "Cotizado"', active: true, runs: 156, created: Date.now() - 15*86400000 },
    { id: 'at5', name: 'Chatbot pre-calificación', type: 'chatbot', trigger: 'Campaña Facebook CTWA', action: 'Preguntar presupuesto + zona + timing', active: true, runs: 534, created: Date.now() - 40*86400000 },
    { id: 'at6', name: 'Recordatorio de cita', type: 'sequence', trigger: '24h antes de cita agendada', action: 'Enviar recordatorio con botón confirmar', active: false, runs: 89, created: Date.now() - 10*86400000 },
    { id: 'at7', name: 'Post-venta satisfacción', type: 'sequence', trigger: '3 días después de pago', action: 'Solicitar reseña + upsell', active: true, runs: 67, created: Date.now() - 18*86400000 },
    { id: 'at8', name: 'Auto-respuesta fuera de horario', type: 'rule', trigger: 'Mensaje recibido 22:00-08:00', action: 'Responder con horario + IA', active: true, runs: 423, created: Date.now() - 5*86400000 }
  ],

  notifications: [
    { id: 'n1', text: '🔥 Ana Martínez preguntó por precio', time: Date.now() - 1800000, read: false, contact_id: 'c1', type: 'hot_lead' },
    { id: 'n2', text: 'Campaña "Black Friday" terminó de enviarse', time: Date.now() - 2*3600000, read: false, type: 'campaign' },
    { id: 'n3', text: 'María López lleva 30min sin respuesta', time: Date.now() - 1*3600000, read: false, contact_id: 'c4', type: 'alert' },
    { id: 'n4', text: 'Laura Pérez cerró una venta de $3,200', time: Date.now() - 4*3600000, read: true, type: 'sale' },
    { id: 'n5', text: 'Nueva automatización "Bienvenida" activada', time: Date.now() - 86400000, read: true, type: 'system' }
  ],

  integrations: [
    { id: 'i1', name: 'Meta (WhatsApp + IG + FB)', connected: true, icon: '📱', last_sync: Date.now() - 300000, color: '#1877F2' },
    { id: 'i2', name: 'Shopify', connected: false, icon: '🛒', color: '#95BF47' },
    { id: 'i3', name: 'Google Sheets', connected: true, icon: '📊', last_sync: Date.now() - 3600000, color: '#0F9D58' },
    { id: 'i4', name: 'HubSpot', connected: false, icon: '🎯', color: '#FF7A59' },
    { id: 'i5', name: 'Zapier', connected: true, icon: '⚡', last_sync: Date.now() - 7200000, color: '#FF4A00' },
    { id: 'i6', name: 'Calendly', connected: false, icon: '📅', color: '#006BFF' }
  ],

  settings: {
    out_of_office: false,
    out_of_office_msg: '¡Hola! Estamos fuera de horario. Te responderemos en cuanto regresemos (Lun-Vie 9am-7pm).',
    auto_assign: true,
    auto_assign_mode: 'round_robin',
    ai_agent_enabled: true,
    notifications_sound: true,
    notifications_desktop: true,
    alerts_hot_leads: true,
    alerts_sla_minutes: 5,
    working_hours_start: '09:00',
    working_hours_end: '19:00',
    timezone: 'America/Mexico_City',
    language: 'es-MX'
  }
});

const DB = {
  _data: null,

  init() {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
      try { this._data = JSON.parse(stored); }
      catch { this._data = seedData(); this._save(); }
    } else {
      this._data = seedData();
      this._save();
    }
    return this._data;
  },

  _save() {
    localStorage.setItem(DB_KEY, JSON.stringify(this._data));
  },

  reset() {
    this._data = seedData();
    this._save();
    return this._data;
  },

  get() { return this._data; },

  // USER
  getUser() { return this._data.user; },
  updateUser(patch) { Object.assign(this._data.user, patch); this._save(); },

  // TEAM
  getTeam() { return this._data.team; },

  // CONTACTS
  getContacts(includeArchived=false) {
    return this._data.contacts.filter(c => includeArchived || !c.archived);
  },
  getContact(id) { return this._data.contacts.find(c => c.id === id); },
  addContact(contact) {
    const id = 'c' + Date.now();
    const c = { id, stage:'nuevo', tags:[], channel:'whatsapp', value:0, assigned:null, archived:false, unread:0, created:Date.now(), notes:'', source:'Manual', last_msg:'', ...contact };
    this._data.contacts.unshift(c);
    this._save();
    return c;
  },
  updateContact(id, patch) {
    const c = this._data.contacts.find(c => c.id === id);
    if (c) { Object.assign(c, patch); this._save(); return c; }
    return null;
  },
  deleteContact(id) {
    this._data.contacts = this._data.contacts.filter(c => c.id !== id);
    delete this._data.conversations[id];
    this._save();
  },
  archiveContact(id) { return this.updateContact(id, { archived: true }); },
  unarchiveContact(id) { return this.updateContact(id, { archived: false }); },
  moveContactStage(id, stage) { return this.updateContact(id, { stage }); },

  // CONVERSATIONS
  getConversation(contactId) {
    return this._data.conversations[contactId] || [];
  },
  sendMessage(contactId, text, from='agent', agentId=null) {
    if (!this._data.conversations[contactId]) this._data.conversations[contactId] = [];
    const msg = { from, text, time: Date.now(), agent_id: agentId };
    this._data.conversations[contactId].push(msg);
    this.updateContact(contactId, { last_msg: text, unread: from === 'contact' ? (this.getContact(contactId).unread + 1) : 0 });
    return msg;
  },
  markContactRead(contactId) { return this.updateContact(contactId, { unread: 0 }); },

  // CAMPAIGNS
  getCampaigns() { return this._data.campaigns; },
  addCampaign(c) {
    const id = 'cm' + Date.now();
    const campaign = { id, status:'draft', sent:null, contacts:0, delivered:0, read:0, replied:0, ...c };
    this._data.campaigns.unshift(campaign);
    this._save();
    return campaign;
  },
  deleteCampaign(id) {
    this._data.campaigns = this._data.campaigns.filter(c => c.id !== id);
    this._save();
  },
  sendCampaign(id) {
    const c = this._data.campaigns.find(c => c.id === id);
    if (c) {
      c.status = 'sending';
      c.sent = Date.now();
      c.contacts = c.contacts || 500;
      this._save();
      setTimeout(() => {
        c.status = 'completed';
        c.delivered = Math.floor(c.contacts * (0.95 + Math.random()*0.04));
        c.read = Math.floor(c.delivered * (0.5 + Math.random()*0.2));
        c.replied = Math.floor(c.read * (0.15 + Math.random()*0.1));
        this._save();
      }, 3000);
    }
    return c;
  },

  // AUTOMATIONS
  getAutomations() { return this._data.automations; },
  toggleAutomation(id) {
    const a = this._data.automations.find(a => a.id === id);
    if (a) { a.active = !a.active; this._save(); return a; }
    return null;
  },
  addAutomation(a) {
    const id = 'at' + Date.now();
    const auto = { id, active:true, runs:0, created:Date.now(), ...a };
    this._data.automations.unshift(auto);
    this._save();
    return auto;
  },
  deleteAutomation(id) {
    this._data.automations = this._data.automations.filter(a => a.id !== id);
    this._save();
  },

  // NOTIFICATIONS
  getNotifications() { return this._data.notifications; },
  unreadNotifications() { return this._data.notifications.filter(n => !n.read).length; },
  markNotificationRead(id) {
    const n = this._data.notifications.find(n => n.id === id);
    if (n) { n.read = true; this._save(); }
  },
  markAllNotificationsRead() {
    this._data.notifications.forEach(n => n.read = true);
    this._save();
  },

  // INTEGRATIONS
  getIntegrations() { return this._data.integrations; },
  toggleIntegration(id) {
    const i = this._data.integrations.find(i => i.id === id);
    if (i) {
      i.connected = !i.connected;
      if (i.connected) i.last_sync = Date.now();
      this._save();
      return i;
    }
    return null;
  },

  // SETTINGS
  getSettings() { return this._data.settings; },
  updateSettings(patch) { Object.assign(this._data.settings, patch); this._save(); },

  // STATS
  getStats() {
    const contacts = this._data.contacts.filter(c => !c.archived);
    const pagados = contacts.filter(c => c.stage === 'pagado');
    const totalRevenue = pagados.reduce((s,c) => s + c.value, 0);
    const totalMessages = Object.values(this._data.conversations).reduce((s,msgs) => s + msgs.length, 0);
    return {
      total_contacts: contacts.length,
      nuevos: contacts.filter(c => c.stage === 'nuevo').length,
      interesados: contacts.filter(c => c.stage === 'interesado').length,
      cotizados: contacts.filter(c => c.stage === 'cotizado').length,
      pagados: pagados.length,
      perdidos: this._data.contacts.filter(c => c.stage === 'perdido').length,
      revenue: totalRevenue,
      total_messages: totalMessages,
      active_automations: this._data.automations.filter(a => a.active).length,
      campaigns_sent: this._data.campaigns.filter(c => c.status === 'completed').length,
      cx_score: 87,
      response_time_avg: 3.2,
      conversion_rate: contacts.length ? ((pagados.length / contacts.length) * 100).toFixed(1) : 0
    };
  }
};

// Auto-init al cargar
if (typeof window !== 'undefined') {
  DB.init();
  window.DB = DB;
}
