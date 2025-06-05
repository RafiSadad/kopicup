// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onMqttStatus: (callback) => ipcRenderer.on('mqtt-status', (_event, value) => callback(value)),
    onUpdateStats: (callback) => ipcRenderer.on('update-stats', (_event, value) => callback(value)),
    onUpdateImageMqtt: (callback) => ipcRenderer.on('update-image-mqtt', (_event, value) => callback(value)), // Untuk gambar via MQTT
    onUpdateCurrentBean: (callback) => ipcRenderer.on('update-current-bean', (_event, value) => callback(value)),
    onUpdateEsp32Ip: (callback) => ipcRenderer.on('update-esp32-ip', (_event, value) => callback(value)), // Untuk IP ESP32

    removeAllListeners: (channel) => {
        console.log(`[Preload] Menghapus semua listener untuk channel: ${channel}`);
        ipcRenderer.removeAllListeners(channel);
    }
});