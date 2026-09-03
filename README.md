# Pancasila Tarik Tambang (Kuis Adu Cepat)

Kuis Adu Cepat Tarik Tambang: Ideologi Pancasila adalah sebuah permainan edukasi berbasis web (multiplayer) yang menguji pengetahuan tentang Pancasila. Permainan ini mensimulasikan lomba tarik tambang secara virtual, di mana tim yang menjawab pertanyaan dengan cepat dan benar akan menarik tambang ke arah mereka.

## Fitur
* **Multiplayer Real-time:** Ditenagai oleh Socket.IO, memungkinkan host dan dua pemain (Tim Merah dan Tim Putih) berinteraksi secara langsung dalam satu *room*.
* **Sistem Room Code:** Pemain dapat bergabung menggunakan kode unik yang dibuat oleh host (layar proyektor).
* **Game Mekanik Tarik Tambang:** Setiap jawaban benar akan menambah skor dan menarik indikator tambang ke arah tim.
* **Tipe Soal:** Terdapat pengaturan variasi tipe soal yang bisa dipilih host saat membuat *room*.

## Teknologi yang Digunakan
* Frontend: HTML5, CSS3, Vanilla JavaScript
* Backend: Node.js, Express.js
* Komunikasi Real-time: Socket.IO

## Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) di sistem Anda.

## Instalasi dan Menjalankan Game

1. Clone repositori ini atau ekstrak folder game ke komputer Anda.
2. Buka terminal atau command prompt, lalu arahkan direktori ke folder proyek ini.
3. Instal semua dependensi yang dibutuhkan dengan menjalankan perintah:
   ```bash
   npm install
   ```
4. Jalankan server lokal:
   ```bash
   node server.js
   ```
   *(Atau sesuaikan jika Anda menggunakan perintah `npm start`)*
5. Buka browser dan akses alamat lokal, biasanya di:
   ```
   http://localhost:3000
   ```
   *(Perhatikan pesan log di terminal untuk mengetahui port yang digunakan server)*

## Cara Bermain

1. **Host (Proyektor):**
   * Buka game di browser.
   * Pada layar lobby, pilih opsi **"Buat Room Baru"**.
   * Pilih tipe soal yang diinginkan.
   * Klik tombol **"Buat Room (Host)"**.
   * Host akan mendapatkan **Kode Room** (misal: `AB12CD`) dan layar akan menampilkan status menunggu pemain. Layar ini idealnya ditampilkan di proyektor.

2. **Pemain (Tim Merah / Tim Putih):**
   * Buka game di perangkat masing-masing (smartphone atau laptop).
   * Pada layar lobby, masukkan **Kode Room** yang diberikan oleh host.
   * Klik tombol **"Gabung (Pemain)"**.
   * Sistem akan otomatis memasukkan pemain ke Tim Merah (Player 1) atau Tim Putih (Player 2) berdasarkan urutan masuk.

3. **Mulai Permainan:**
   * Setelah dua pemain bergabung, permainan akan otomatis menghitung mundur dan dimulai.
   * Jawab pertanyaan yang muncul di layar secepat mungkin. Jawaban yang benar akan menarik tambang ke arah Anda!
   * Tim yang berhasil menarik tambang sepenuhnya atau memiliki skor tertinggi saat waktu habis adalah pemenangnya.

## Lisensi
ISC License
