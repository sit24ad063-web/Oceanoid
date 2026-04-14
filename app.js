const i18n = {
  en: {
    missionControl: 'Mission Control', systemOnline: 'System Online', modeLabel: 'Mode', languageLabel: 'Language',
    botsTitle: 'Bot Control & Monitoring', swarmBtn: 'Swarm View', sensorTitle: 'Sensor Intelligence',
    mapTitle: 'Ocean Map', alertsTitle: 'Alerts', aiDetection: 'AI Detection', analyzeBtn: 'Analyze Scene',
    assistant: 'Assistant', sendBtn: 'Send', eventsTitle: 'Live Mission Logs', coralHealth: 'Coral Health',
    inputPlaceholder: 'Ask something...', reefSummary: 'C-7 coral zone is under thermal stress with high bleaching risk.',
    prediction: 'Prediction: pollution plume likely to shift northeast over the next 6 hours.',
    showCoralStatus: 'Show coral status', anyLeaks: 'Any leaks?',
    modeFocus: {
      Monitoring: 'Live tracking mode active: balanced operations overview.',
      Alert: 'Emergency mode active: alerts highlighted and auto-focus enabled.',
      Exploration: 'Exploration mode active: swarm routes and unknown region scan priority.',
      Prediction: 'Prediction mode active: future anomaly paths and risk trend overlays.',
      Engineer: 'Engineer mode active: pipelines and infrastructure diagnostics prioritized.',
      Ecology: 'Ecology mode active: reef and biodiversity indicators prioritized.'
    }
  },
  ta: {
    missionControl: 'மிஷன் கட்டுப்பாட்டு மையம்', systemOnline: 'அமைப்பு செயல்பாட்டில் உள்ளது', modeLabel: 'செயல் முறை', languageLabel: 'மொழி',
    botsTitle: 'பாட் கட்டுப்பாடு மற்றும் கண்காணிப்பு', swarmBtn: 'குழு பாட்கள் காட்சி', sensorTitle: 'சென்சார் நுண்ணறிவு',
    mapTitle: 'கடல் வரைபடம்', alertsTitle: 'எச்சரிக்கைகள்', aiDetection: 'செயற்கை நுண்ணறிவு கண்டறிதல்', analyzeBtn: 'காட்சியை பகுப்பாய்வு செய்',
    assistant: 'உதவி அமைப்பு', sendBtn: 'அனுப்பு', eventsTitle: 'நேரடி மிஷன் பதிவுகள்', coralHealth: 'பவள ஆரோக்கியம்',
    inputPlaceholder: 'ஏதாவது கேளுங்கள்...', reefSummary: 'C-7 பவள பகுதியில் வெப்ப அழுத்தம் அதிகமாக இருப்பதால் வெண்மைப்படுதல் அபாயம் உயர்ந்துள்ளது.',
    prediction: 'முன்கணிப்பு: அடுத்த 6 மணி நேரத்தில் மாசு மேகம் வடகிழக்கு திசைக்கு நகரலாம்.',
    showCoralStatus: 'பவள நிலை காட்டு', anyLeaks: 'கசிவு ஏதாவது உள்ளதா?',
    modeFocus: {
      Monitoring: 'நேரடி கண்காணிப்பு செயலில் உள்ளது: சமநிலை செயல்பாட்டு காட்சி.',
      Alert: 'அவசர முறை செயலில் உள்ளது: எச்சரிக்கைகள் முன்னிலைப்படுத்தப்பட்டுள்ளன.',
      Exploration: 'ஆய்வு முறை செயலில் உள்ளது: குழு பாட் வழிசெலுத்தல் முன்னுரிமை.',
      Prediction: 'முன்கணிப்பு முறை செயலில் உள்ளது: எதிர்கால அபாய ஓவர்லே காட்டப்படுகிறது.',
      Engineer: 'பொறியாளர் முறை செயலில் உள்ளது: குழாய் மற்றும் கட்டமைப்பு கண்காணிப்பு முன்னுரிமை.',
      Ecology: 'சூழலியல் முறை செயலில் உள்ளது: பவள மற்றும் உயிரியல் சுட்டிகள் முன்னுரிமை.'
    }
  }
};

const modes = ['Monitoring', 'Alert', 'Exploration', 'Prediction', 'Engineer', 'Ecology'];
const sensors = [
  { key: 'Temperature', unit: '°C', min: 24, max: 32, warn: 29, crit: 30.5, ta: 'வெப்பநிலை' },
  { key: 'pH Level', unit: '', min: 7.7, max: 8.5, warn: 7.9, crit: 7.8, ta: 'அமிலத்தன்மை (pH)' },
  { key: 'Turbidity', unit: 'NTU', min: 1.0, max: 4.5, warn: 3.4, crit: 3.9, ta: 'நீர் மங்கல் அளவு' },
  { key: 'Oxygen', unit: 'mg/L', min: 4.5, max: 8.6, warn: 5.2, crit: 4.9, ta: 'கரைந்த ஆக்சிஜன்' },
  { key: 'Salinity', unit: 'PSU', min: 32, max: 38, warn: 36.5, crit: 37.4, ta: 'உப்பு அளவு' }
];

const bots = Array.from({ length: 5 }, (_, i) => ({
  id: `BOT-${i + 1}`,
  lat: 9.8 + Math.random() * 0.7,
  lng: 79.8 + Math.random() * 0.7,
  battery: 65 + Math.random() * 30,
  health: 70 + Math.random() * 30,
  status: 'Active',
  damage: Math.random() > 0.75 ? 'Minor' : 'None',
  task: ['Reef Scan', 'Leak Patrol', 'Bio Survey', 'Anomaly Sweep'][Math.floor(Math.random() * 4)]
}));

const e = id => document.getElementById(id);
let map, activeLang = 'en', selectedBot;
const botMarkers = {}, botTracks = {};
const modeSelect = e('modeSelect');
const alertHotspots = [
  { text: 'Oil Spill Detected', latlng: [10.05, 80.2], critical: true },
  { text: 'Coral Bleaching Risk', latlng: [10.12, 79.95], critical: false },
  { text: 'Pipeline Leak', latlng: [10.33, 80.18], critical: true }
];

modes.forEach(m => modeSelect.append(new Option(m, m)));

function initMap() {
  map = L.map('map').setView([10.2, 80.1], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  const coral = L.layerGroup([
    L.circle([10.35, 80.25], { radius: 26000, color: '#6ef6bf', fillOpacity: 0.22 }).bindPopup('Coral Zone • Healthy'),
    L.circle([10.1, 79.96], { radius: 18000, color: '#ffd76f', fillOpacity: 0.2 }).bindPopup('Coral Zone • Moderate')
  ]).addTo(map);
  const pipeline = L.layerGroup([L.polyline([[10.6, 79.9], [10.35, 80.15], [10.1, 80.5]], { color: '#ff9f70', weight: 4 }).bindPopup('Pipeline Route')]).addTo(map);
  const pollution = L.layerGroup([L.circle([10.05, 80.2], { radius: 15000, color: '#ff667a', fillOpacity: 0.24 }).bindPopup('Pollution Zone')]).addTo(map);
  L.control.layers({}, { 'Coral Zone': coral, Pipeline: pipeline, Pollution: pollution }).addTo(map);

  bots.forEach(b => {
    botMarkers[b.id] = L.circleMarker([b.lat, b.lng], { radius: 8, color: '#39e9ff' }).addTo(map);
    botTracks[b.id] = L.polyline([[b.lat, b.lng]], { color: '#6fe9ff', weight: 2 }).addTo(map);
    botMarkers[b.id].on('mouseover', () => botMarkers[b.id].bindPopup(`${b.id}<br>Battery ${b.battery.toFixed(0)}%<br>Health ${b.health.toFixed(0)}%<br>Task: ${b.task}`).openPopup());
    botMarkers[b.id].on('click', () => openBotDialog(b));
  });
}

function renderBots() {
  e('botList').innerHTML = '';
  bots.forEach(b => {
    const card = document.createElement('div');
    card.className = `bot-card ${selectedBot === b.id ? 'active' : ''}`;
    card.innerHTML = `<strong>${b.id}</strong> • ${b.task}<br>📍 ${b.lat.toFixed(3)}, ${b.lng.toFixed(3)}<br>🔋 ${b.battery.toFixed(0)}% | ${activeLang==='ta'?'செயல்திறன் நிலை':'Health'} ${b.health.toFixed(0)}%<br>⚠️ ${activeLang==='ta'?'சேத தகவல்':'Damage'}: ${b.damage}`;
    card.onclick = () => openBotDialog(b);
    e('botList').append(card);
  });
}

function sensorClass(name, val) {
  const s = sensors.find(x => x.key === name);
  if (!s) return '';
  const highBad = !name.includes('pH') && name !== 'Oxygen';
  if (highBad) return val >= s.crit ? 'crit' : val >= s.warn ? 'warn' : 'good';
  return val <= s.crit ? 'crit' : val <= s.warn ? 'warn' : 'good';
}

function renderSensors() {
  e('sensorGrid').innerHTML = '';
  sensors.forEach(s => {
    const val = +(s.min + Math.random() * (s.max - s.min)).toFixed(s.key.includes('pH') ? 2 : 1);
    const label = activeLang === 'ta' ? s.ta : s.key;
    const cls = sensorClass(s.key, val);
    const card = document.createElement('div');
    card.className = `sensor-card ${cls}`;
    card.innerHTML = `<strong>${label}</strong><div>${val} ${s.unit}</div>`;
    e('sensorGrid').append(card);
  });
}

function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.frequency.value = 720; gain.gain.value = 0.04; osc.start(); osc.stop(ctx.currentTime + 0.12);
}

function renderAlerts() {
  e('alertList').innerHTML = '';
  alertHotspots.forEach((a, i) => {
    const div = document.createElement('div');
    const text = activeLang === 'ta'
      ? (a.text === 'Oil Spill Detected' ? 'எண்ணெய் கசிவு கண்டறியப்பட்டது' : a.text === 'Coral Bleaching Risk' ? 'பவள வெண்மைப்படுதல் அபாயம்' : 'குழாய் கசிவு')
      : a.text;
    div.className = `alert ${a.critical ? 'critical' : ''}`;
    div.textContent = text;
    div.onclick = () => map.flyTo(a.latlng, 11);
    e('alertList').append(div);
    if (a.critical && i === 0) setTimeout(() => { map.flyTo(a.latlng, 10); beep(); pushLog(`${text} - auto focus triggered.`); }, 900);
  });
}

function pushLog(msg) {
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleTimeString()} — ${msg}`;
  e('eventLog').prepend(li);
  while (e('eventLog').children.length > 12) e('eventLog').lastChild.remove();
}

function applyLanguage(lang) {
  activeLang = lang;
  const d = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(node => node.textContent = d[node.dataset.i18n]);
  e('chatInput').placeholder = d.inputPlaceholder;
  e('reefSummary').textContent = d.reefSummary;
  e('predictionText').textContent = d.prediction;
  e('modeFocus').textContent = d.modeFocus[modeSelect.value];
  e('visionText').textContent = lang === 'ta' ? 'YOLO போன்ற கண்டறிதல்: மீன், பிளாஸ்டிக், குழாய் சேதம், எண்ணெய் அடுக்கு.' : 'YOLO-style detection: fish, plastic, pipeline damage, oil film.';
  document.querySelectorAll('.suggest')[0].textContent = d.showCoralStatus;
  document.querySelectorAll('.suggest')[1].textContent = d.anyLeaks;
  renderBots();
  renderSensors();
  renderAlerts();
}

function applyMode(mode) {
  document.body.className = `mode-${mode}`;
  e('activeModePill').textContent = mode;
  e('modeFocus').textContent = i18n[activeLang].modeFocus[mode];
  pushLog(`${mode} mode enabled.`);
}

function simulate() {
  bots.forEach(b => {
    b.lat += (Math.random() - .5) * .018;
    b.lng += (Math.random() - .5) * .018;
    b.battery = Math.max(15, b.battery - Math.random() * .35);
    b.health = Math.max(40, Math.min(100, b.health + (Math.random() - .5) * 1.5));
    botMarkers[b.id].setLatLng([b.lat, b.lng]);
    const pts = botTracks[b.id].getLatLngs(); pts.push([b.lat, b.lng]); if (pts.length > 26) pts.shift(); botTracks[b.id].setLatLngs(pts);
  });
  renderBots(); renderSensors();
}

function typeReply(text) {
  const line = document.createElement('div');
  e('chatLog').append(line);
  let i = 0;
  const timer = setInterval(() => {
    line.textContent = `AquaMind: ${text.slice(0, ++i)}`;
    e('chatLog').scrollTop = e('chatLog').scrollHeight;
    if (i >= text.length) clearInterval(timer);
  }, 15);
}

function chatReply(q) {
  const p = q.toLowerCase();
  if (p.includes('coral') || p.includes('பவள')) return activeLang === 'ta' ? 'C-7 பகுதியில் ஆபத்து உயர்ந்துள்ளது; சூழலியல் முறைக்கு மாற பரிந்துரைக்கப்படுகிறது.' : 'C-7 has the highest bleaching risk; switch to Ecology mode for focused monitoring.';
  if (p.includes('leak') || p.includes('கசிவு')) return activeLang === 'ta' ? 'P-12 வழித்தடத்தில் அழுத்த மாற்றம் உள்ளது; உடனடி ஆய்வு தேவை.' : 'Pressure fluctuation detected on P-12 route; immediate inspection advised.';
  return activeLang === 'ta' ? 'நேரடி தரவின் அடிப்படையில் அறிக்கை தயாராகிறது.' : 'Generating insight from live telemetry.';
}

function openBotDialog(bot) {
  selectedBot = bot.id;
  renderBots();
  e('dialogTitle').textContent = bot.id;
  e('dialogStats').textContent = `Battery ${bot.battery.toFixed(0)}% • Health ${bot.health.toFixed(0)}% • Task ${bot.task}`;
  e('dialogDetections').innerHTML = ['Fish 91%', 'Plastic 73%', 'Coral 86%'].map(x => `<span>${x}</span>`).join('');
  if (e('botDialog').showModal) e('botDialog').showModal();
}

function wireEvents() {
  e('launchBtn').onclick = () => { e('landing').classList.remove('active'); e('dashboard').classList.add('active'); setTimeout(() => map.invalidateSize(), 100); };
  e('swarmBtn').onclick = () => { map.fitBounds(L.latLngBounds(bots.map(b => [b.lat, b.lng])).pad(.45)); pushLog('Swarm view enabled.'); };
  e('analyzeBtn').onclick = () => {
    const out = ['Fish Detected 93%', 'Plastic Detected 78%', 'Pipeline Fracture 71%'].sort(() => .5 - Math.random()).slice(0, 2);
    e('detections').innerHTML = out.map(x => `<span>${activeLang==='ta'?x.replace('Fish Detected','மீன் கண்டறியப்பட்டது').replace('Plastic Detected','பிளாஸ்டிக் கண்டறியப்பட்டது'):x}</span>`).join('');
    pushLog(activeLang === 'ta' ? 'AI காட்சி பகுப்பாய்வு முடிந்தது.' : 'AI scene analysis completed.');
  };
  modeSelect.onchange = () => applyMode(modeSelect.value);
  e('langSelect').onchange = v => applyLanguage(v.target.value);
  e('chatSend').onclick = () => {
    const q = e('chatInput').value.trim(); if (!q) return;
    const u = document.createElement('div'); u.textContent = `You: ${q}`; e('chatLog').append(u);
    typeReply(chatReply(q)); e('chatInput').value = '';
  };
  document.querySelectorAll('.suggest').forEach(btn => btn.onclick = () => { e('chatInput').value = btn.dataset.q; e('chatSend').click(); });
  e('closeDialog').onclick = () => e('botDialog').close();
}

initMap();
wireEvents();
modeSelect.value = 'Monitoring';
applyLanguage('en');
applyMode('Monitoring');
pushLog('Mission initialized. Live stream connected.');
setInterval(simulate, 1000);
