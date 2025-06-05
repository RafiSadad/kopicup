// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const mqtt = require('mqtt');

let mainWindow;

const MQTT_BROKER_URL = 'mqtt://test.mosquitto.org';
const MQTT_CLIENT_ID = `olivia_dashboard_${Date.now()}_${Math.random().toString(16).substr(2, 8)}`;

const TOPIC_STATS = 'olivia/sorter/stats';
const TOPIC_IMAGE_MQTT = 'olivia/sorter/image'; // Untuk gambar via MQTT (URL/Base64) - bisa jadi fallback
const TOPIC_CURRENT_BEAN = 'olivia/sorter/current';
const TOPIC_ESP32_IP = 'olivia/sorter/ip_address'; // Topik untuk menerima IP ESP32-CAM

console.log(`[Main] Mencoba terhubung ke MQTT Broker: ${MQTT_BROKER_URL} dengan Client ID: ${MQTT_CLIENT_ID}`);
const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    clientId: MQTT_CLIENT_ID,
    connectTimeout: 5000,
    reconnectPeriod: 2000,
    clean: true,
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        // icon: path.join(__dirname, 'assets/icon.png') // Opsional
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools(); // Buka DevTools untuk debugging

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    console.log('[Main] Semua jendela ditutup.');
    if (process.platform !== 'darwin') {
        if (mqttClient && mqttClient.connected) {
            console.log('[Main] Menutup koneksi MQTT sebelum aplikasi keluar...');
            mqttClient.end(true, () => {
                console.log('[Main] Koneksi MQTT berhasil ditutup.');
                app.quit();
            });
        } else {
            console.log('[Main] Aplikasi keluar tanpa menutup koneksi MQTT (karena tidak terhubung).');
            app.quit();
        }
    }
});

mqttClient.on('connect', () => {
    console.log('[Main] BERHASIL terhubung ke MQTT Broker!');
    if (mainWindow) {
        mainWindow.webContents.send('mqtt-status', { connected: true, message: 'Terhubung ke Broker' });
    }
    // Tambahkan TOPIC_ESP32_IP ke daftar subscribe
    const topicsToSubscribe = [TOPIC_STATS, TOPIC_IMAGE_MQTT, TOPIC_CURRENT_BEAN, TOPIC_ESP32_IP];
    mqttClient.subscribe(topicsToSubscribe, { qos: 0 }, (err, granted) => {
        if (err) {
            console.error('[Main] Gagal subscribe ke topik:', err);
        } else {
            console.log('[Main] Berhasil subscribe ke topik:');
            granted.forEach(grant => console.log(`  - Topik: ${grant.topic}, QoS: ${grant.qos}`));
        }
    });
});

mqttClient.on('error', (error) => {
    console.error('[Main] Koneksi MQTT GAGAL atau Error:', error.message);
    if (mainWindow) {
        mainWindow.webContents.send('mqtt-status', { connected: false, message: `Error: ${error.message}` });
    }
});

mqttClient.on('reconnect', () => {
    console.log('[Main] Mencoba menghubungkan ulang ke MQTT Broker...');
    if (mainWindow) {
        mainWindow.webContents.send('mqtt-status', { connected: false, message: 'Mencoba menghubungkan ulang...' });
    }
});

mqttClient.on('close', () => {
    console.log('[Main] Koneksi MQTT ditutup.');
    if (mainWindow && !mqttClient.reconnecting) {
        mainWindow.webContents.send('mqtt-status', { connected: false, message: 'Koneksi ditutup' });
    }
});

mqttClient.on('offline', () => {
    console.log('[Main] MQTT Client offline.');
     if (mainWindow) {
        mainWindow.webContents.send('mqtt-status', { connected: false, message: 'Client offline' });
    }
});

mqttClient.on('message', (topic, message) => {
    const messageString = message.toString();
    console.log(`[Main] Pesan diterima dari topik [${topic}], panjang: ${messageString.length}`);

    if (!mainWindow || mainWindow.isDestroyed()) return;

    try {
        if (topic === TOPIC_STATS) {
            const statsData = JSON.parse(messageString);
            mainWindow.webContents.send('update-stats', statsData);
        } else if (topic === TOPIC_IMAGE_MQTT) { // Untuk gambar yang dikirim via MQTT (URL atau Base64)
            mainWindow.webContents.send('update-image-mqtt', messageString); // Channel IPC baru atau gunakan yang lama
        } else if (topic === TOPIC_CURRENT_BEAN) {
            const currentBeanData = JSON.parse(messageString);
            mainWindow.webContents.send('update-current-bean', currentBeanData);
        } else if (topic === TOPIC_ESP32_IP) { // Handler untuk IP ESP32-CAM
            const esp32Ip = messageString.trim();
            console.log("[Main] Alamat IP ESP32-CAM diterima:", esp32Ip);
            mainWindow.webContents.send('update-esp32-ip', esp32Ip);
        }
    } catch (e) {
        console.error(`[Main] Error memproses pesan dari topik ${topic}:`, e);
        console.error("[Main] Pesan asli (awal):", messageString.substring(0, 100) + "...");
    }
});