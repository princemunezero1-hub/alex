// Connect to Public MQTT Broker over WebSockets
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';

const client = mqtt.connect(brokerUrl, {
    clientId: 'web_dashboard_' + Math.random().toString(16).substring(2, 8),
    clean: true
});

const statusDiv = document.getElementById('connection-status');

client.on('connect', () => {
    statusDiv.style.color = 'green';
    statusDiv.textContent = 'Status: Connected to MQTT Broker';
    
    // Subscribe to all 4 individual topics from your ESP32
    client.subscribe('esp32/sensors/humidity');
    client.subscribe('esp32/sensors/voltage');
    client.subscribe('esp32/leds/red');
    client.subscribe('esp32/leds/green');
});

client.on('error', (err) => {
    statusDiv.style.color = 'red';
    statusDiv.textContent = 'Connection Error: ' + err;
});

// Handle incoming live data messages
client.on('message', (topic, message) => {
    const payload = message.toString();

    if (topic === 'esp32/sensors/humidity') {
        document.getElementById('humidity-val').textContent = payload + ' %';
    } 
    else if (topic === 'esp32/sensors/voltage') {
        document.getElementById('voltage-val').textContent = payload + ' V';
    } 
    else if (topic === 'esp32/leds/red') {
        const redBadge = document.getElementById('red-led-status');
        redBadge.textContent = payload;
        redBadge.className = 'status-badge ' + (payload === 'HIGH' ? 'badge-on' : 'badge-off');
    } 
    else if (topic === 'esp32/leds/green') {
        const greenBadge = document.getElementById('green-led-status');
        greenBadge.textContent = payload;
        greenBadge.className = 'status-badge ' + (payload === 'ON' ? 'badge-on' : 'badge-off');
    }
});