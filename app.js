const i18n = {
  en: {
    missionControl: 'Mission Control', systemOnline: 'System Online', modeLabel: 'Mode', languageLabel: 'Language',
    botsTitle: 'Bot Control & Monitoring', swarmBtn: 'Swarm View', sensorTitle: 'Sensor Intelligence',
    mapTitle: 'Ocean Map', alertsTitle: 'Alerts', aiDetection: 'AI Detection', analyzeBtn: 'Analyze Scene',
    assistant: 'Assistant', sendBtn: 'Send', eventsTitle: 'Live Mission Logs', coralHealth: 'Coral Health',
    activeBots: 'Active Bots', criticalAlerts: 'Critical Alerts', reefScoreLabel: 'Reef Score', networkLabel: 'Network',
    inputPlaceholder: 'Ask something...', reefSummary: 'C-7 coral zone is under thermal stress with high bleaching risk.',
    prediction: 'Prediction: pollution plume likely to shift northeast over the next 6 hours.',
    modeFocus: {
      Monitoring: 'Monitoring: balanced operations and complete telemetry.',
      Alert: 'Alert: critical incidents prioritized with hotspot auto-focus.',
      Exploration: 'Exploration: wider map scan and swarm routing priority.',
      Prediction: 'Prediction: forecast overlays enabled for future risk.',
      Engineer: 'Engineer: pipeline/infrastructure monitoring emphasized.',
      Ecology: 'Ecology: coral + biodiversity insights emphasized.'
    }
  },
  ta: {
    missionControl: 'மிஷன் கட்டுப்பாட்டு மையம்', systemOnline: 'அமைப்பு செயல்பாட்டில் உள்ளது', modeLabel: 'செயல் முறை', languageLabel: 'மொழி',
    botsTitle: 'பாட் கட்டுப்பாடு மற்றும் கண்காணிப்பு', swarmBtn: 'குழு பாட்கள் காட்சி', sensorTitle: 'சென்சார் நுண்ணறிவு',
    mapTitle: 'கடல் வரைபடம்', alertsTitle: 'எச்சரிக்கைகள்', aiDetection: 'செயற்கை நுண்ணறிவு கண்டறிதல்', analyzeBtn: 'காட்சியை பகுப்பாய்வு செய்',
    assistant: 'உதவி அமைப்பு', sendBtn: 'அனுப்பு', eventsTitle: 'நேரடி மிஷன் பதிவுகள்', coralHealth: 'பவள ஆரோக்கியம்',
    activeBots: 'செயலில் உள்ள பாட்கள்', criticalAlerts: 'முக்கிய எச்சரிக்கைகள்', reefScoreLabel: 'பவள மதிப்பெண்', networkLabel: 'நெட்வொர்க்',
    inputPlaceholder: 'ஏதாவது கேளுங்கள்...', reefSummary: 'C-7 பவள பகுதியில் வெண்மைப்படுதல் அபாயம் அதிகரித்துள்ளது.',
    prediction: 'முன்கணிப்பு: அடுத்த 6 மணி நேரத்தில் மாசு மேகம் வடகிழக்கு திசைக்கு நகரலாம்.',
    modeFocus: {
      Monitoring: 'கண்காணிப்பு: அனைத்து தரவுகளும் சமநிலை காட்சியில்.',
      Alert: 'எச்சரிக்கை: முக்கிய அபாயங்கள் முன்னுரிமையுடன் காட்டப்படுகின்றன.',
      Exploration: 'ஆய்வு: பரந்த வரைபட ஸ்கேன் மற்றும் பாட் வழிசெலுத்தல்.',
      Prediction: 'முன்கணிப்பு: எதிர்கால அபாய ஓவர்லே காட்டப்படுகிறது.',
      Engineer: 'பொறியாளர்: குழாய் மற்றும் கட்டமைப்பு கண்காணிப்பு முன்னுரிமை.',
      Ecology: 'சூழலியல்: பவள மற்றும் உயிரியல் சுட்டிகள் முன்னுரிமை.'
    }
  }
};

const modes = ['Monitoring', 'Alert', 'Exploration', 'Prediction', 'Engineer', 'Ecology'];
const sensors = [
  { key: 'Temperature', unit: '°C', min: 24, max: 32, warn: 29, crit: 30.5, ta: 'வெப்பநிலை' },
  { key: 'pH Level', unit: '', min: 7.7, max: 8.5, warn: 7.9, crit: 7.8, ta: 'அமிலத்தன்மை (pH)' },
  { key: 'Turbidity', unit: 'NTU', min: 1, max: 4.5, warn: 3.4, crit: 3.9, ta: 'நீர் மங்கல் அளவு' },
  { key: 'Oxygen', unit: 'mg/L', min: 4.5, max: 8.6, warn: 5.2, crit: 4.9, ta: 'கரைந்த ஆக்சிஜன்' },
  { key: 'Salinity', unit: 'PSU', min: 32, max: 38, warn: 36.5, crit: 37.4, ta: 'உப்பு அளவு' }
];

const bots = Array.from({ length: 5 }, (_, i) => ({
  id: `BOT-${i + 1}`,
  lat: 9.8 + Math.random() * 0.7,
  lng: 79.8 + Math.random() * 0.7,
  battery: 65 + Math.random() * 30,
  health: 70 + Math.random() * 30,
  damage: Math.random() > 0.75 ? 'Minor' : 'None',
  task: ['Reef Scan', 'Leak Patrol', 'Bio Survey', 'Anomaly Sweep'][Math.floor(Math.random() * 4)]
}));

const e = id => document.getElementById(id);
let map, activeLang = 'en', selectedBot, simTimer, mode = 'Monitoring';
const botMarkers = {}, botTracks = {};
const modeSelect = e('modeSelect');
const layers = {};
let alertFilter = 'all';

const alertHotspots = [
  { text: 'Oil Spill Detected', latlng: [10.05, 80.2], critical: true },
  { text: 'Coral Bleaching Risk', latlng: [10.12, 79.95], critical: false },
  { text: 'Pipeline Leak', latlng: [10.33, 80.18], critical: true }
];

modes.forEach(m => modeSelect.append(new Option(m, m)));

function initMap() {
  map = L.map('map').setView([10.2, 80.1], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

  layers.coral = L.layerGroup([
    L.circle([10.35, 80.25], { radius: 26000, color: '#6ef6bf', fillOpacity: 0.22 }).bindPopup('Coral Zone • Healthy'),
    L.circle([10.1, 79.96], { radius: 18000, color: '#ffd76f', fillOpacity: 0.2 }).bindPopup('Coral Zone • Moderate')
  ]).addTo(map);
  layers.pipeline = L.layerGroup([L.polyline([[10.6, 79.9], [10.35, 80.15], [10.1, 80.5]], { color: '#ff9f70', weight: 4 }).bindPopup('Pipeline Route')]).addTo(map);
  layers.pollution = L.layerGroup([L.circle([10.05, 80.2], { radius: 15000, color: '#ff667a', fillOpacity: 0.24 }).bindPopup('Pollution Zone')]).addTo(map);
  layers.prediction = L.layerGroup([L.circle([10.22, 80.32], { radius: 19000, color: '#ffd76f', dashArray: '5,8', fillOpacity: 0.08 }).bindPopup('Forecast plume spread')]);

  L.control.layers({}, { 'Coral Zone': layers.coral, Pipeline: layers.pipeline, Pollution: layers.pollution, Forecast: layers.prediction }).addTo(map);

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
  const s = sensors.find(x => x.key === name); if (!s) return 'good';
  const highBad = !name.includes('pH') && name !== 'Oxygen';
  return highBad ? (val >= s.crit ? 'crit' : val >= s.warn ? 'warn' : 'good') : (val <= s.crit ? 'crit' : val <= s.warn ? 'warn' : 'good');
}

function renderSensors() {
  e('sensorGrid').innerHTML = '';
  sensors.forEach(s => {
    const val = +(s.min + Math.random() * (s.max - s.min)).toFixed(s.key.includes('pH') ? 2 : 1);
    const label = activeLang === 'ta' ? s.ta : s.key;
    const card = document.createElement('div');
    card.className = `sensor-card ${sensorClass(s.key, val)}`;
    card.innerHTML = `<strong>${label}</strong><div>${val} ${s.unit}</div>`;
    e('sensorGrid').append(card);
  });
}

function renderAlerts() {
  e('alertList').innerHTML = '';
  const visible = alertHotspots.filter(a => alertFilter === 'all' || a.critical);
  visible.forEach(a => {
    const text = activeLang === 'ta'
      ? (a.text === 'Oil Spill Detected' ? 'எண்ணெய் கசிவு கண்டறியப்பட்டது' : a.text === 'Coral Bleaching Risk' ? 'பவள வெண்மைப்படுதல் அபாயம்' : 'குழாய் கசிவு')
      : a.text;
    const div = document.createElement('div');
    div.className = `alert ${a.critical ? 'critical' : ''}`;
    div.textContent = text;
    div.onclick = () => map.flyTo(a.latlng, 11);
    e('alertList').append(div);
  });
  e('statAlerts').textContent = String(alertHotspots.filter(a => a.critical).length);
}

function pushLog(msg) {
  const li = document.createElement('li');
  li.textContent = `${new Date().toLocaleTimeString()} — ${msg}`;
  e('eventLog').prepend(li);
  while (e('eventLog').children.length > 12) e('eventLog').lastChild.remove();
}

function updateStats() {
  e('statBots').textContent = String(bots.filter(b => b.battery > 15).length);
  e('statReef').textContent = String(70 + Math.floor(Math.random() * 25));
  e('statNet').textContent = mode === 'Alert' ? 'Degraded' : mode === 'Exploration' ? 'Adaptive' : 'Stable';
}

function showToast(message) {
  const t = e('toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 1500);
}

function applyLanguage(lang) {
  activeLang = lang;
  const d = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(node => node.textContent = d[node.dataset.i18n]);
  e('chatInput').placeholder = d.inputPlaceholder;
  e('reefSummary').textContent = d.reefSummary;
  e('predictionText').textContent = d.prediction;
  e('modeFocus').textContent = d.modeFocus[mode];
  e('visionText').textContent = lang === 'ta' ? 'YOLO போன்ற கண்டறிதல்: மீன், பிளாஸ்டிக், குழாய் சேதம், எண்ணெய் அடுக்கு.' : 'YOLO-style detection: fish, plastic, pipeline damage, oil film.';
  renderBots();
  renderSensors();
  renderAlerts();
}

function setLayerVisibility(currentMode) {
  const show = (layer, yes) => yes ? map.addLayer(layer) : map.removeLayer(layer);
  show(layers.coral, ['Monitoring', 'Ecology', 'Exploration'].includes(currentMode));
  show(layers.pipeline, ['Monitoring', 'Engineer', 'Alert'].includes(currentMode));
  show(layers.pollution, ['Monitoring', 'Alert', 'Prediction'].includes(currentMode));
  show(layers.prediction, currentMode === 'Prediction');
}

function applyMode(nextMode) {
  mode = nextMode;
  document.body.className = `mode-${nextMode.toLowerCase()}`;
  e('activeModePill').textContent = nextMode;
  e('modeFocus').textContent = i18n[activeLang].modeFocus[nextMode];

  setLayerVisibility(nextMode);
  if (nextMode === 'Alert') map.flyTo(alertHotspots[0].latlng, 10);
  if (nextMode === 'Exploration') map.setView([10.25, 80.05], 7);
  if (nextMode === 'Engineer') map.flyTo([10.33, 80.18], 10);
  if (nextMode === 'Ecology') map.flyTo([10.1, 79.96], 10);
  if (nextMode === 'Prediction') map.flyTo([10.22, 80.32], 9);

  pushLog(`${nextMode} mode enabled.`);
  showToast(`${nextMode} mode applied`);
  updateStats();
}

function simulate() {
  bots.forEach(b => {
    b.lat += (Math.random() - .5) * (mode === 'Exploration' ? .03 : .018);
    b.lng += (Math.random() - .5) * (mode === 'Exploration' ? .03 : .018);
    b.battery = Math.max(15, b.battery - Math.random() * .35);
    b.health = Math.max(40, Math.min(100, b.health + (Math.random() - .5) * 1.5));
    botMarkers[b.id].setLatLng([b.lat, b.lng]);
    const pts = botTracks[b.id].getLatLngs();
    pts.push([b.lat, b.lng]);
    if (pts.length > 26) pts.shift();
    botTracks[b.id].setLatLngs(pts);
  });
  renderBots();
  renderSensors();
  updateStats();
}

function chatReply(q) {
  const p = q.toLowerCase();
  if (p.includes('coral') || p.includes('பவள')) return activeLang === 'ta' ? 'C-7 பகுதியில் ஆபத்து உயர்ந்துள்ளது; சூழலியல் முறைக்கு மாறவும்.' : 'C-7 has the highest bleaching risk; switch to Ecology mode.';
  if (p.includes('leak') || p.includes('கசிவு')) return activeLang === 'ta' ? 'P-12 வழித்தடத்தில் அழுத்த மாற்றம் கண்டறியப்பட்டது.' : 'Pressure fluctuation detected on P-12 route.';
  return activeLang === 'ta' ? 'நேரடி தரவின் அடிப்படையில் சுருக்கம் தயாராகிறது.' : 'Generating insight from live telemetry.';
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

function openBotDialog(bot) {
  selectedBot = bot.id;
  renderBots();
  e('dialogTitle').textContent = bot.id;
  e('dialogStats').textContent = `Battery ${bot.battery.toFixed(0)}% • Health ${bot.health.toFixed(0)}% • Task ${bot.task}`;
  e('dialogDetections').innerHTML = ['Fish 91%', 'Plastic 73%', 'Coral 86%'].map(x => `<span>${x}</span>`).join('');
  if (e('botDialog').showModal) e('botDialog').showModal();
}

function wireEvents() {
  e('launchBtn').onclick = () => {
    e('landing').classList.remove('active');
    e('dashboard').classList.add('active');
    setTimeout(() => map.invalidateSize(), 100);
  };
  e('swarmBtn').onclick = () => {
    map.fitBounds(L.latLngBounds(bots.map(b => [b.lat, b.lng])).pad(.45));
    pushLog('Swarm view enabled.');
  };
  e('alertAll').onclick = () => { alertFilter = 'all'; renderAlerts(); showToast('Showing all alerts'); };
  e('alertCritical').onclick = () => { alertFilter = 'critical'; renderAlerts(); showToast('Showing critical alerts'); };
  e('analyzeBtn').onclick = () => {
    const out = ['Fish Detected 93%', 'Plastic Detected 78%', 'Pipeline Fracture 71%'].sort(() => .5 - Math.random()).slice(0, 2);
    e('detections').innerHTML = out.map(x => `<span>${x}</span>`).join('');
    pushLog(activeLang === 'ta' ? 'AI காட்சி பகுப்பாய்வு முடிந்தது.' : 'AI scene analysis completed.');
  };
  modeSelect.onchange = () => applyMode(modeSelect.value);
  e('langSelect').onchange = evt => applyLanguage(evt.target.value);
  e('chatSend').onclick = () => {
    const q = e('chatInput').value.trim();
    if (!q) return;
    const u = document.createElement('div');
    u.textContent = `You: ${q}`;
    e('chatLog').append(u);
    typeReply(chatReply(q));
    e('chatInput').value = '';
  };
  e('closeDialog').onclick = () => e('botDialog').close();
  document.addEventListener('keydown', ev => {
    if (ev.key >= '1' && ev.key <= '6') {
      modeSelect.value = modes[Number(ev.key) - 1];
      applyMode(modeSelect.value);
    }
    if (ev.key.toLowerCase() === 'l') {
      const next = e('langSelect').value === 'en' ? 'ta' : 'en';
      e('langSelect').value = next;
      applyLanguage(next);
      showToast(next === 'en' ? 'Language: English' : 'மொழி: தமிழ்');
    }
  });
}

initMap();
wireEvents();
modeSelect.value = 'Monitoring';
applyLanguage('en');
applyMode('Monitoring');
pushLog('Mission initialized. Live stream connected.');
updateStats();
simTimer = setInterval(simulate, 1000);
