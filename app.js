const i18n = {
  en: {
    botsTitle: 'Bot Control & Tracking',
    mapTitle: 'Live GIS Ocean Map',
    aiTitle: 'AI Vision + Alerts',
    chatTitle: 'Mission Assistant',
    eventsTitle: 'Live Mission Logs',
    reefTitle: 'Coral Reef Monitoring',
    reefSummary: 'High bleaching risk due to persistent heat stress near Reef Cluster C-7.'
  },
  ta: {
    botsTitle: 'பாட் கட்டுப்பாடு & கண்காணிப்பு',
    mapTitle: 'நேரடி GIS கடல் வரைபடம்',
    aiTitle: 'AI பார்வை + எச்சரிக்கைகள்',
    chatTitle: 'மிஷன் உதவியாளர்',
    eventsTitle: 'நேரடி மிஷன் பதிவுகள்',
    reefTitle: 'பவளப்பாறை கண்காணிப்பு',
    reefSummary: 'Reef Cluster C-7 பகுதியில் வெப்ப அழுத்தம் காரணமாக அதிக வெண்மைப்படுதல் அபாயம்.'
  }
};

const modes = ['Monitoring', 'Alert', 'Exploration', 'Prediction', 'Engineer', 'Ecology'];
const sensors = ['Temperature', 'pH', 'Turbidity', 'Dissolved Oxygen'];
const detectionsPool = ['Fish 93%', 'Coral 88%', 'Plastic 81%', 'Pipeline 91%', 'Obstacle 79%'];

const bots = Array.from({ length: 5 }, (_, i) => ({
  id: `BOT-${i + 1}`,
  lat: 9.8 + Math.random() * 0.7,
  lng: 79.8 + Math.random() * 0.7,
  battery: 70 + Math.floor(Math.random() * 28),
  status: 'Active',
  temp: 25 + Math.random() * 3,
  ph: 8 + Math.random() * 0.4,
  turbidity: 2 + Math.random() * 2,
  insight: 'Stable coral transect'
}));

const launchBtn = document.getElementById('launchBtn');
const landing = document.getElementById('landing');
const dashboard = document.getElementById('dashboard');
const botList = document.getElementById('botList');
const alertList = document.getElementById('alertList');
const sensorGrid = document.getElementById('sensorGrid');
const eventLog = document.getElementById('eventLog');
const reefSummary = document.getElementById('reefSummary');
const modeSelect = document.getElementById('modeSelect');
const activeModePill = document.getElementById('activeModePill');
const langSelect = document.getElementById('langSelect');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');

let map;
const botMarkers = {};
const botTracks = {};
let selectedBot = null;

modes.forEach(mode => {
  const option = document.createElement('option');
  option.value = mode;
  option.textContent = mode;
  modeSelect.append(option);
});

function initMap() {
  map = L.map('map').setView([10.2, 80.1], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const reefs = L.layerGroup([
    L.circle([10.4, 80.3], { radius: 28000, color: '#69ffd0' }).bindPopup('Reef A • Health: 86/100'),
    L.circle([9.95, 80.55], { radius: 22000, color: '#ffe168' }).bindPopup('Reef B • Bleaching risk: Medium')
  ]).addTo(map);

  const pipelines = L.layerGroup([
    L.polyline([[10.6, 79.9], [10.35, 80.15], [10.1, 80.5]], { color: '#ff995c' }).bindPopup('Pipeline P-12')
  ]).addTo(map);

  const pollution = L.layerGroup([
    L.circle([10.05, 80.18], { radius: 15000, color: '#ff5f83' }).bindPopup('Oil spill anomaly')
  ]).addTo(map);

  const zones = L.layerGroup([
    L.rectangle([[9.85, 79.85], [10.15, 80.1]], { color: '#4ec3ff' }).bindPopup('Sensor Zone Alpha')
  ]).addTo(map);

  L.control.layers({}, { Reefs: reefs, Pipelines: pipelines, Pollution: pollution, 'Sensor Zones': zones }).addTo(map);

  bots.forEach(bot => {
    const marker = L.circleMarker([bot.lat, bot.lng], { radius: 8, color: '#3ee4ff' })
      .addTo(map)
      .bindPopup(`${bot.id} | Battery ${bot.battery}%`);

    marker.on('click', () => {
      selectedBot = bot.id;
      renderBots();
    });

    botMarkers[bot.id] = marker;
    botTracks[bot.id] = L.polyline([[bot.lat, bot.lng]], { color: '#6be6ff', weight: 2 }).addTo(map);
  });
}

function renderBots() {
  botList.innerHTML = '';
  bots.forEach(bot => {
    const card = document.createElement('div');
    card.className = `bot-card ${selectedBot === bot.id ? 'active' : ''}`;
    card.innerHTML = `
      <strong>${bot.id}</strong><br>
      📍 ${bot.lat.toFixed(3)}, ${bot.lng.toFixed(3)}<br>
      🔋 ${bot.battery}% | ⚙️ ${bot.status}<br>
      🌡️ ${bot.temp.toFixed(1)}°C | ⚗️ ${bot.ph.toFixed(2)} | 🌊 ${bot.turbidity.toFixed(2)} NTU<br>
      🧠 ${bot.insight}
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
  sensors.forEach(name => {
    const value = (Math.random() * 20 + 10).toFixed(1);
    const card = document.createElement('div');
    card.className = 'sensor-card';
    card.innerHTML = `<strong>${name}</strong><div>${value}</div><div class="sparkline"></div>`;
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
    '☣️ Oil spill detected near Sector 4B',
    '🪸 Coral bleaching trend rising in Reef Cluster C-7',
    '🛢️ Pipeline P-12 leakage detected',
    '🤖 BOT-3 anomaly: actuator stress high'
  ];
  alertList.innerHTML = alerts.map(a => `<div class="alert">${a}</div>`).join('');
}

function simulateRealtime() {
  bots.forEach(bot => {
    bot.lat += (Math.random() - 0.5) * 0.02;
    bot.lng += (Math.random() - 0.5) * 0.02;
    bot.battery = Math.max(20, bot.battery - Math.random() * 0.3);
    bot.temp += (Math.random() - 0.5) * 0.2;
    bot.turbidity += (Math.random() - 0.5) * 0.15;

    botMarkers[bot.id].setLatLng([bot.lat, bot.lng]);
    const path = botTracks[bot.id].getLatLngs();
    path.push([bot.lat, bot.lng]);
    if (path.length > 20) path.shift();
    botTracks[bot.id].setLatLngs(path);
  });

  renderBots();
  renderSensors();

  if (Math.random() > 0.75) {
    const bot = bots[Math.floor(Math.random() * bots.length)];
    pushLog(`${bot.id} detected microplastic plume signature.`);
  }
}

function applyLanguage(lang) {
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = dict[el.dataset.i18n] || el.textContent;
  });
  reefSummary.textContent = dict.reefSummary;
}

function botReply(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('pollution')) return 'Highest pollution is concentrated in Sector 4B with rising turbidity and hydrocarbon traces.';
  if (p.includes('which bot') || p.includes('anomaly')) return 'BOT-3 reported an actuator anomaly and BOT-5 flagged a thermal deviation.';
  if (p.includes('reef')) return 'Reef Cluster C-7 has the highest bleaching risk due to prolonged heat stress.';
  return 'Mission AI suggests switching to Prediction mode for projected risk overlays.';
}

launchBtn.onclick = () => {
  landing.classList.remove('active');
  dashboard.classList.add('active');
  setTimeout(() => map.invalidateSize(), 120);
};

document.getElementById('swarmBtn').onclick = () => {
  const bounds = L.latLngBounds(bots.map(b => [b.lat, b.lng]));
  map.fitBounds(bounds.pad(0.4));
  pushLog('Swarm view engaged for coordinated bot operations.');
};

langSelect.onchange = () => applyLanguage(langSelect.value);
modeSelect.onchange = () => {
  activeModePill.textContent = modeSelect.value;
  pushLog(`Mode switched to ${modeSelect.value}.`);
};

document.getElementById('analyzeBtn').onclick = () => {
  const sample = detectionsPool.sort(() => 0.5 - Math.random()).slice(0, 4);
  document.getElementById('detections').innerHTML = sample.map(d => `<span>${d}</span>`).join('');
  document.getElementById('visionText').textContent = 'Scene analysis: Pipeline corridor clear, plastic debris and fish cluster detected near coral shelf.';
  pushLog('AI vision inference completed on latest frame.');
};

document.getElementById('chatSend').onclick = () => {
  const prompt = chatInput.value.trim();
  if (!prompt) return;
  const userMsg = document.createElement('div');
  userMsg.textContent = `You: ${prompt}`;
  chatLog.append(userMsg);

  const aiMsg = document.createElement('div');
  aiMsg.textContent = `AquaMind: ${botReply(prompt)}`;
  chatLog.append(aiMsg);
  chatInput.value = '';
  chatLog.scrollTop = chatLog.scrollHeight;
};

initMap();
renderBots();
renderAlerts();
renderSensors();
applyLanguage('en');
modeSelect.value = modes[0];
setInterval(simulateRealtime, 2500);
pushLog('Mission initialized. Real-time stream connected via WebSocket bridge.');
