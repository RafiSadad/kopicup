# KopiCup ☕️📸

Prototipe alat penyortir biji kopi otomatis menggunakan **ESP32-CAM** untuk *computer vision* dan terintegrasi dengan platform **IoT**.

Dibuat dengan semangat belajar dalam waktu kurang dari 3 hari untuk kompetisi **OLIVIA**. Proyek ini adalah bukti bahwa pengalaman belajar bisa sama berharganya dengan kemenangan. Rasanya seperti *hackathon* pertama kami!

---

## ✨ Deskripsi Singkat

**KopiCup** adalah sebuah sistem cerdas yang dirancang untuk menyortir buah kopi pascapanen berdasarkan tingkat kematangannya. Alat ini memanfaatkan kamera pada ESP32 untuk mengambil gambar buah kopi, kemudian menganalisisnya untuk memisahkan biji yang matang dan yang belum.

-   **Hardware**: ESP32-CAM
-   **Software**: Arduino IDE (`.ino`) & JavaScript (`.js`)
-   **Fitur Utama**: Klasifikasi gambar sederhana untuk penyortiran.

---

## 🚀 Cara Menggunakan (Versi Prototipe)

Karena ini masih dalam tahap pengembangan awal, langkah-langkahnya masih manual:

1.  **Upload Firmware ke ESP32-CAM**:
    * Buka Arduino IDE.
    * Hubungkan ESP32-CAM ke komputermu.
    * Buka file `.ino` yang tersedia di repositori ini.
    * Upload script tersebut ke board ESP32-CAM kamu.

2.  **Jalankan Aplikasi Web**:
    * Pastikan kamu sudah memiliki Node.js ter-install.
    * Buka terminal atau command prompt.
    * Arahkan ke direktori tempat file `.js` berada.
    * Jalankan script dengan perintah: `node nama_file_aplikasi.js` (ganti `nama_file_aplikasi.js` dengan nama file JavaScript kamu yang sebenarnya).
    * Buka browser dan akses alamat yang ditampilkan di terminal (biasanya `http://localhost:PORT_APLIKASI_ANDA`).

---

## ⚠️ Status Proyek & Disclaimer

Harap dicatat bahwa ini adalah **prototipe kasar** yang dibangun dalam waktu sangat singkat (< 3 hari).

-   **Kode Belum Matang**: File JavaScript masih mentah dan belum dioptimalkan.
-   **Database Belum Ada**: Belum ada implementasi database. Data bersifat sementara.
-   **Tujuan Utama**: Proyek ini dibuat sebagai bukti konsep (*Proof of Concept*) dan media pembelajaran, bukan produk jadi. Kami tidak menargetkan kemenangan, namun kami sangat bersyukur atas pengalaman belajar yang didapat.

---

## 💡 Konsep & Pengembangan Lanjutan

Penasaran dengan konsep awal dan visi jangka panjang dari proyek ini?

-   [**Link Demonstrasi Konsep**](URL_DEMO_VIDEO_ANDA) *(Ganti dengan link video demo KopiCup)*
-   [**Link Proposal Penelitian**](URL_PROPOSAL_PENELITIAN_ANDA) *(Ganti dengan link proposal penelitian)*

---

## 🙏 Ucapan Terima Kasih

Proyek ini tidak akan terwujud tanpa inspirasi dan dukungan. Terima kasih sebesar-besarnya kepada:

-   **Khadijah Rindang Maghriba**, yang telah mengizinkan ide brilian dari penelitiannya **"RANCANG BANGUN ALAT SORTIR BUAH KOPI PASCAPANEN BERDASARKAN TINGKAT KEMATANGAN"** untuk kami kembangkan lebih lanjut menggunakan ESP32-CAM.
-   **Kompetisi OLIVIA**, yang telah memberikan kami kesempatan dan tekanan positif untuk belajar dan berkembang dalam suasana yang terasa seperti *hackathon*.

---

*Repositori ini didedikasikan untuk semangat mencoba, belajar, dan berinovasi.*
