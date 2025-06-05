// renderer.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Renderer] DOM sepenuhnya dimuat dan di-parse.');

    const mqttStatusElement = document.getElementById('mqttStatus');
    const esp32ImageElement = document.getElementById('esp32Image');
    const currentClassificationElement = document.getElementById('currentClassification');
    const currentHueElement = document.getElementById('currentHue');

    const countMatangElement = document.getElementById('countMatang');
    const countMengkalElement = document.getElementById('countMengkal');
    const countMentahElement = document.getElementById('countMentah');
    const countTuaElement = document.getElementById('countTua');
    const countTotalElement = document.getElementById('countTotal');

    let esp32IpAddress = null;
    let imageStreamActive = false;

    // --- SESUAIKAN ENDPOINT INI DENGAN YANG ADA DI ESP32-CAM MU ---
    const MJPEG_STREAM_ENDPOINT = "/stream"; // Jika ESP32-CAM menyediakan MJPEG stream
    const SNAPSHOT_ENDPOINT = "/capture";   // Jika ESP32-CAM menyediakan single snapshot

    // Fungsi untuk memulai/mengupdate feed gambar dari ESP32-CAM
    function setupImageFeed() {
        if (esp32ImageElement && esp32IpAddress) {
            // --- PILIH METODE YANG KAMU IMPLEMENTASIKAN DI ESP32-CAM ---

            // **UNTUK MJPEG STREAM:**
            const streamUrl = `http://${esp32IpAddress}${MJPEG_STREAM_ENDPOINT}`;
            console.log(`[Renderer] Mencoba memulai MJPEG stream dari: ${streamUrl}`);
            esp32ImageElement.src = streamUrl;
            esp32ImageElement.alt = `Live stream dari ${esp32IpAddress}`;
            imageStreamActive = true;

            // **UNTUK SNAPSHOT BERKALA (HAPUS ATAU KOMEN BAGIAN MJPEG DI ATAS JIKA PAKAI INI):**
            /*
            function refreshSnapshot() {
                if (esp32ImageElement && esp32IpAddress) {
                    const snapshotUrl = `http://${esp32IpAddress}${SNAPSHOT_ENDPOINT}?_cache_buster=${new Date().getTime()}`;
                    console.log(`[Renderer] Mengambil snapshot dari: ${snapshotUrl}`);
                    esp32ImageElement.src = snapshotUrl;
                    esp32ImageElement.alt = `Snapshot dari ${esp32IpAddress}`;
                }
            }
            refreshSnapshot(); // Panggil pertama kali
            // setInterval(refreshSnapshot, 2000); // Refresh setiap 2 detik, sesuaikan intervalnya
            // imageStreamActive = true; // Bisa diset true agar tidak ada konflik dengan gambar MQTT
            */


            esp32ImageElement.onerror = () => {
                console.error(`[Renderer] Gagal memuat gambar dari http://${esp32IpAddress}. Pastikan ESP32-CAM aktif dan endpoint benar.`);
                esp32ImageElement.alt = `Gagal memuat feed dari ${esp32IpAddress}.`;
                imageStreamActive = false; // Izinkan mencoba lagi jika IP diupdate atau ada trigger lain
            };
            esp32ImageElement.onload = () => {
                console.log(`[Renderer] Feed gambar berhasil dimuat dari http://${esp32IpAddress}`);
            };

        } else if (esp32ImageElement && !esp32IpAddress) {
            console.warn("[Renderer] Alamat IP ESP32-CAM belum diterima.");
            esp32ImageElement.alt = "Menunggu alamat IP ESP32-CAM...";
        }
    }

    if (window.electronAPI) {
        console.log('[Renderer] electronAPI ditemukan.');

        window.electronAPI.onMqttStatus((status) => {
            console.log("[Renderer] Status MQTT diterima:", status);
            if (mqttStatusElement) {
                mqttStatusElement.textContent = `Status MQTT: ${status.message}`;
                mqttStatusElement.className = 'status-box ' + (status.connected ? 'connected' : 'disconnected');
            }
        });

        window.electronAPI.onUpdateStats((stats) => {
            console.log("[Renderer] Data statistik diterima:", stats);
            if (countMatangElement) countMatangElement.textContent = stats.matang !== undefined ? stats.matang : '0';
            if (countMengkalElement) countMengkalElement.textContent = stats.mengkal !== undefined ? stats.mengkal : '0';
            if (countMentahElement) countMentahElement.textContent = stats.mentah !== undefined ? stats.mentah : '0';
            if (countTuaElement) countTuaElement.textContent = stats.tua !== undefined ? stats.tua : '0';
            if (countTotalElement) countTotalElement.textContent = stats.total !== undefined ? stats.total : '0';
        });

        // Listener untuk gambar yang dikirim via MQTT (bisa jadi fallback)
        window.electronAPI.onUpdateImageMqtt((imageData) => {
            console.log("[Renderer] Data gambar MQTT diterima, panjang string:", imageData ? imageData.length : 0);
            if (esp32ImageElement && !imageStreamActive) { // Hanya update jika stream/snapshot IP tidak aktif
                if (imageData && imageData.startsWith('http')) {
                    esp32ImageElement.src = imageData;
                    esp32ImageElement.alt = "Gambar dari ESP32-CAM (MQTT URL)";
                } else if (imageData) {
                    esp32ImageElement.src = imageData.startsWith('data:image') ? imageData : `data:image/jpeg;base64,${imageData}`;
                    esp32ImageElement.alt = "Gambar dari ESP32-CAM (MQTT Base64)";
                } else {
                    esp32ImageElement.src = "";
                    esp32ImageElement.alt = "Tidak ada gambar via MQTT atau data kosong";
                }
            } else if (imageStreamActive) {
                console.log("[Renderer] Feed gambar via IP aktif, mengabaikan update gambar dari MQTT.");
            }
        });

        window.electronAPI.onUpdateCurrentBean((beanInfo) => {
            console.log("[Renderer] Info buah saat ini diterima:", beanInfo);
            if (currentClassificationElement) currentClassificationElement.textContent = beanInfo.classification || '-';
            if (currentHueElement) currentHueElement.textContent = beanInfo.hue_value !== undefined ? beanInfo.hue_value : '-';
        });

        window.electronAPI.onUpdateEsp32Ip((ip) => {
            console.log(`[Renderer] Alamat IP ESP32-CAM diterima: ${ip}`);
            if (ip && ip.match(/^(\d{1,3}\.){3}\d{1,3}$/)) { // Validasi format IP sederhana
                if (ip !== esp32IpAddress || !imageStreamActive) {
                    esp32IpAddress = ip;
                    imageStreamActive = false; // Reset agar setupImageFeed bisa berjalan lagi
                    setupImageFeed();
                }
            } else {
                console.warn("[Renderer] Menerima format IP tidak valid atau IP kosong:", ip);
                esp32IpAddress = null;
                imageStreamActive = false;
                if (esp32ImageElement) {
                    esp32ImageElement.src = "";
                    esp32ImageElement.alt = "Alamat IP ESP32-CAM tidak valid.";
                }
            }
        });

    } else {
        console.error('[Renderer] electronAPI TIDAK ditemukan!');
        if(mqttStatusElement) {
            mqttStatusElement.textContent = 'Error Kritis: Gagal memuat API internal aplikasi.';
            mqttStatusElement.className = 'status-box disconnected';
        }
    }
});