const i18n = {
  en: {
    botsTitle: 'Bot Control & Tracking', mapTitle: 'Live GIS Ocean Map', aiTitle: 'AI Vision + Alerts',
    chatTitle: 'Mission Assistant', eventsTitle: 'Live Mission Logs', reefTitle: 'Coral Reef Monitoring',
    networkTitle: 'Hybrid Ocean Network', swarmBtn: 'Swarm View', analyzeBtn: 'Analyze Scene', sendBtn: 'Send',
    reefSummary: 'Cluster C-7 shows elevated bleaching risk due to heat stress and low oxygen.',
    prediction: 'Prediction (next 6h): bleaching risk +14%, spill spread heading east-northeast.',
    modeFocus: {
      Monitoring: 'Monitoring mode: balanced telemetry and map tracking.',
      Alert: 'Alert mode: critical events and hazard overlays prioritized.',
      Exploration: 'Exploration mode: swarm routing and unknown-zone scanning enabled.',
      Prediction: 'Prediction mode: future-risk simulation overlays and trend projections active.',
      Engineer: 'Engineer mode: pipeline and cable integrity given top priority.',
      Ecology: 'Ecology mode: coral habitats and marine biodiversity signals emphasized.'
    }
  },
  ta: {
    botsTitle: 'பாட் கட்டுப்பாடு & கண்காணிப்பு', mapTitle: 'நேரடி GIS கடல் வரைபடம்', aiTitle: 'AI பார்வை + எச்சரிக்கைகள்',
    chatTitle: 'மிஷன் உதவியாளர்', eventsTitle: 'நேரடி மிஷன் பதிவுகள்', reefTitle: 'பவளப்பாறை கண்காணிப்பு',
    networkTitle: 'கலப்பு கடல் நெட்வொர்க்', swarmBtn: 'Swarm காட்சி', analyzeBtn: 'காட்சி பகுப்பாய்வு', sendBtn: 'அனுப்பு',
    reefSummary: 'C-7 பகுதியில் வெப்ப அழுத்தம் மற்றும் குறைந்த ஆக்சிஜன் காரணமாக வெண்மைப்படுதல் அபாயம் அதிகம்.',
    prediction: 'அடுத்த 6 மணி: வெண்மைப்படுதல் அபாயம் +14%, கசிவு கிழக்கு-வடகிழக்கு திசைக்கு பரவும்.',
    modeFocus: {
      Monitoring: 'கண்காணிப்பு முறை: சமநிலை தரவு மற்றும் வரைபட கண்காணிப்பு.',
      Alert: 'எச்சரிக்கை முறை: அபாயங்கள் மற்றும் முக்கிய நிகழ்வுகள் முன்னுரிமை.',
      Exploration: 'ஆய்வு முறை: Swarm வழிசெலுத்தல் மற்றும் புதிய பகுதி ஸ்கேன்.',
      Prediction: 'முன்கணிப்பு முறை: எதிர்கால அபாய ஒவர்லே மற்றும் போக்கு கணிப்பு.',
      Engineer: 'பொறியாளர் முறை: குழாய்/கேபிள் ஒருங்கிணைப்பு முன்னுரிமை.',
      Ecology: 'சூழலியல் முறை: பவளப்பாறை மற்றும் உயிரியல் சிக்னல்கள் முன்னுரிமை.'
    }
  }
};

const modes = ['Monitoring', 'Alert', 'Exploration', 'Prediction', 'Engineer', 'Ecology'];
const sensors = [
  { name: 'Temperature', unit: '°C', min: 24, max: 31 },
  { name: 'pH', unit: '', min: 7.7, max: 8.5 },
  { name: 'Turbidity', unit: 'NTU', min: 1.2, max: 4.5 },
  { name: 'Oxygen', unit: 'mg/L', min: 5.4, max: 8.6 },
  { name: 'Salinity', unit: 'PSU', min: 32, max: 38 }
];
const detectionsPool = ['Fish 93%', 'Coral 88%', 'Plastic Waste 81%', 'Pipeline Crack 74%', 'Oil Film 79%'];
const tasks = ['Reef Scan', 'Leak Inspection', 'Anomaly Sweep', 'Bio Survey'];

const bots = Array.from({ length: 5 }, (_, i) => ({
  id: `BOT-${i + 1}`,
  lat: 9.8 + Math.random() * 0.7,
  lng: 79.8 + Math.random() * 0.7,
  battery: 70 + Math.floor(Math.random() * 28),
  status: 'Active',
  health: 78 + Math.floor(Math.random() * 20),
  damage: Math.random() < 0.22 ? 'Minor Hull Stress' : 'None',
  task: tasks[Math.floor(Math.random() * tasks.length)],
  temp: 25 + Math.random() * 3,
  ph: 8 + Math.random() * 0.4,
  turbidity: 2 + Math.random() * 2,
  insight: 'Stable sensor fusion confidence'
}));

const el = id => document.getElementById(id);
const launchBtn = el('launchBtn');
const landing = el('landing');
const dashboard = el('dashboard');
const botList = el('botList');
const alertList = el('alertList');
const sensorGrid = el('sensorGrid');
const eventLog = el('eventLog');
const reefSummary = el('reefSummary');
const predictionText = el('predictionText');
const modeSelect = el('modeSelect');
const activeModePill = el('activeModePill');
const modeFocus = el('modeFocus');
const langSelect = el('langSelect');
const chatLog = el('chatLog');
const chatInput = el('chatInput');

let map;
let activeLang = 'en';
let selectedBot = null;
const botMarkers = {};
const botTracks = {};

modes.forEach(mode => modeSelect.append(new Option(mode, mode)));

function initMap() {
  map = L.map('map').setView([10.2, 80.1], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

  const reefHealth = L.layerGroup([
    L.circle([10.38, 80.31], { radius: 28000, color: '#56f1c4', fillOpacity: 0.22 }).bindPopup('Reef A (Healthy) 88/100'),
    L.circle([9.95, 80.55], { radius: 22000, color: '#ffd166', fillOpacity: 0.2 }).bindPopup('Reef B (Moderate) 72/100'),
    L.circle([10.1, 79.93], { radius: 18000, color: '#ff6f91', fillOpacity: 0.25 }).bindPopup('Reef C (Critical) 49/100')
  ]).addTo(map);

  const pipelines = L.layerGroup([
    L.polyline([[10.6, 79.9], [10.35, 80.15], [10.1, 80.5]], { color: '#ff995c', weight: 4 }).bindPopup('Pipeline P-12'),
    L.polyline([[9.9, 79.95], [10.05, 80.2], [10.2, 80.4]], { color: '#f9ad6a', dashArray: '6,8' }).bindPopup('Cable C-4')
  ]).addTo(map);

  const pollution = L.layerGroup([
    L.circle([10.05, 80.18], { radius: 16000, color: '#ff5f83', fillOpacity: 0.25 }).bindPopup('Oil spill anomaly'),
    L.circle([9.9, 80.28], { radius: 12000, color: '#e84a5f', fillOpacity: 0.25 }).bindPopup('Plastic hotspot')
  ]).addTo(map);

  const zones = L.layerGroup([
    L.rectangle([[9.85, 79.85], [10.15, 80.1]], { color: '#4ec3ff' }).bindPopup('Sensor Zone Alpha'),
    L.rectangle([[10.2, 80.25], [10.45, 80.55]], { color: '#56ddff' }).bindPopup('Sensor Zone Beta')
  ]).addTo(map);

  L.control.layers({}, { 'Coral Reefs': reefHealth, Pipelines: pipelines, Pollution: pollution, 'Sensor Zones': zones }).addTo(map);

  bots.forEach(bot => {
    botMarkers[bot.id] = L.circleMarker([bot.lat, bot.lng], { radius: 8, color: '#3ee4ff' }).addTo(map).bindPopup(`${bot.id}: ${bot.task}`);
    botTracks[bot.id] = L.polyline([[bot.lat, bot.lng]], { color: '#6be6ff', weight: 2 }).addTo(map);
    botMarkers[bot.id].on('click', () => { selectedBot = bot.id; renderBots(); });
  });
}

function renderBots() {
  botList.innerHTML = '';
  bots.forEach(bot => {
    const card = document.createElement('div');
    card.className = `bot-card ${selectedBot === bot.id ? 'active' : ''}`;
    card.innerHTML = `
      <strong>${bot.id}</strong> • ${bot.task}<br>
      📍 ${bot.lat.toFixed(3)}, ${bot.lng.toFixed(3)}<br>
      🔋 ${bot.battery.toFixed(0)}% | ❤️ ${bot.health}% | ⚙️ ${bot.status}<br>
      ⚠️ Damage: ${bot.damage}<br>
      🌡️ ${bot.temp.toFixed(1)}°C | ⚗️ ${bot.ph.toFixed(2)} | 🌫️ ${bot.turbidity.toFixed(2)} NTU
    `;
    card.onclick = () => {
      selectedBot = bot.id;
      map.setView([bot.lat, bot.lng], 11);
      renderBots();
    };
    botList.append(card);
  });
}

function renderSensors() {
  sensorGrid.innerHTML = '';
  sensors.forEach(s => {
    const val = (s.min + Math.random() * (s.max - s.min)).toFixed(s.name === 'pH' ? 2 : 1);
    const card = document.createElement('div');
    card.className = 'sensor-card';
    card.innerHTML = `<strong>${s.name}</strong><div class='sensor-val'>${val} ${s.unit}</div><div class='sparkline'></div>`;
    sensorGrid.append(card);
  });
}

function pushLog(message) {
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleTimeString()} — ${message}`;
  eventLog.prepend(li);
  while (eventLog.children.length > 12) eventLog.removeChild(eventLog.lastChild);
}

function renderAlerts() {
  const alerts = [
    { text: '☣️ Oil spill plume expanding in Sector 4B', critical: true },
    { text: '🪸 Coral bleaching probability exceeded 70% at C-7', critical: false },
    { text: '🛢️ Pipeline P-12 pressure anomaly detected', critical: true },
    { text: '🤖 BOT-3 minor thruster imbalance', critical: false }
  ];
  alertList.innerHTML = alerts
    .map(a => `<div class='alert ${a.critical ? 'critical' : ''}'>${a.text}</div>`)
    .join('');
}

function applyLanguage(lang) {
  activeLang = lang;
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(node => node.textContent = dict[node.dataset.i18n] || node.textContent);
  reefSummary.textContent = dict.reefSummary;
  predictionText.textContent = dict.prediction;
  modeFocus.textContent = dict.modeFocus[modeSelect.value];
  el('visionText').textContent = 'Upload image / webcam frame for YOLO-style detections: fish, coral, plastic, oil, broken pipelines.';
}

function applyMode(mode) {
  document.body.classList.remove('mode-alert', 'mode-engineer', 'mode-ecology');
  if (mode === 'Alert') document.body.classList.add('mode-alert');
  if (mode === 'Engineer') document.body.classList.add('mode-engineer');
  if (mode === 'Ecology') document.body.classList.add('mode-ecology');
  activeModePill.textContent = mode;
  modeFocus.textContent = i18n[activeLang].modeFocus[mode];
  pushLog(`Mode switched to ${mode}.`);
}

function simulateRealtime() {
  bots.forEach(bot => {
    bot.lat += (Math.random() - 0.5) * 0.02;
    bot.lng += (Math.random() - 0.5) * 0.02;
    bot.battery = Math.max(18, bot.battery - Math.random() * 0.45);
    bot.health = Math.max(40, Math.min(100, bot.health + (Math.random() - 0.55) * 2));
    bot.temp += (Math.random() - 0.5) * 0.2;
    bot.turbidity += (Math.random() - 0.5) * 0.18;
    if (Math.random() > 0.95) bot.damage = 'Sensor Arm Stress';

    botMarkers[bot.id].setLatLng([bot.lat, bot.lng]);
    const path = botTracks[bot.id].getLatLngs();
    path.push([bot.lat, bot.lng]);
    if (path.length > 28) path.shift();
    botTracks[bot.id].setLatLngs(path);
  });

  renderBots();
  renderSensors();
  if (Math.random() > 0.76) pushLog(`${bots[Math.floor(Math.random() * bots.length)].id} detected microplastic signature.`);
}

function botReply(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('pollution')) return 'Highest pollution remains in Sector 4B; prediction engine shows eastward drift over next 6 hours.';
  if (p.includes('which bot') || p.includes('anomaly')) return 'BOT-3 flagged actuator stress; BOT-5 reports elevated turbidity near pipeline route.';
  if (p.includes('reef') || p.includes('bleaching')) return 'Cluster C-7 is highest risk. Recommend Ecology mode + adaptive patrol around thermal hotspot.';
  if (p.includes('predict')) return 'Predictive model indicates pipeline P-12 failure risk rising to 41% in 12 hours if pressure fluctuation persists.';
  return 'Try: “show high pollution areas”, “which bot detected anomaly?”, or “predict reef bleaching risk”.';
}

launchBtn.onclick = () => {
  landing.classList.remove('active');
  dashboard.classList.add('active');
  setTimeout(() => map.invalidateSize(), 120);
};

el('swarmBtn').onclick = () => {
  map.fitBounds(L.latLngBounds(bots.map(b => [b.lat, b.lng])).pad(0.4));
  pushLog('Swarm coordination view enabled.');
};
el('analyzeBtn').onclick = () => {
  const sample = detectionsPool.sort(() => 0.5 - Math.random()).slice(0, 4);
  el('detections').innerHTML = sample.map(d => `<span>${d}</span>`).join('');
  el('visionText').textContent = 'AI Vision: Fish cluster, plastic debris, and possible pipeline fracture detected. Confidence fused with turbidity spike.';
  pushLog('Vision + sensor fusion analysis completed.');
};
el('chatSend').onclick = () => {
  const q = chatInput.value.trim();
  if (!q) return;
  chatLog.append(Object.assign(document.createElement('div'), { textContent: `You: ${q}` }));
  chatLog.append(Object.assign(document.createElement('div'), { textContent: `AquaMind: ${botReply(q)}` }));
  chatInput.value = '';
  chatLog.scrollTop = chatLog.scrollHeight;
};

langSelect.onchange = () => applyLanguage(langSelect.value);
modeSelect.onchange = () => applyMode(modeSelect.value);

initMap();
renderBots();
renderAlerts();
renderSensors();
modeSelect.value = 'Monitoring';
applyLanguage('en');
applyMode('Monitoring');
pushLog('Mission initialized. WebSocket stream and edge cache synchronization online.');
setInterval(simulateRealtime, 2200);
