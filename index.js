// index.js

const { app, BrowserWindow } = require('electron');
const path = require('node:path'); // Menggunakan 'node:path' untuk modul built-in Node.js

function createWindow () {
  // Buat jendela browser.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js') // Jika kamu akan punya preload script, aktifkan ini nanti
    }
  });

  // dan muat index.html dari aplikasi.
  mainWindow.loadFile('index.html');

  // Buka DevTools jika kamu mau.
  // mainWindow.webContents.openDevTools();
}

// Metode ini akan dipanggil ketika Electron selesai
// inisialisasi dan siap untuk membuat jendela browser.
// Beberapa API hanya dapat digunakan setelah event ini terjadi.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // Di macOS biasanya membuat ulang jendela di aplikasi ketika
    // ikon dock diklik dan tidak ada jendela lain yang terbuka.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Keluar ketika semua jendela ditutup, kecuali di macOS. Di sana, itu umum
// untuk aplikasi dan bilah menu mereka tetap aktif sampai pengguna keluar secara eksplisit dengan Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Di file ini Anda dapat menyertakan sisa kode proses utama
// spesifik aplikasi Anda. Anda juga dapat menempatkannya di file terpisah dan memerlukannya di sini.