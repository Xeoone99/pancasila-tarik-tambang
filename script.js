import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove, get, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ==========================================
// 1. MASUKKAN KONFIGURASI FIREBASE ANDA DI SINI
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDkFaaq4Ey8WOK-gSUaGDztf4Cx7aZFVeM",
  authDomain: "game-tarik-tambang-11e67.firebaseapp.com",
  projectId: "game-tarik-tambang-11e67",
  storageBucket: "game-tarik-tambang-11e67.firebasestorage.app",
  messagingSenderId: "31237655152",
  appId: "1:31237655152:web:3b31f3b5a3d8b16effc2b5",
  // Karena Anda akan membuat Database di Singapore (Asia), URL-nya biasanya seperti ini:
  databaseURL: "https://game-tarik-tambang-11e67-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// ==========================================
// 2. INISIALISASI FIREBASE
// ==========================================
// Cek jika belum diisi agar tidak error
let app, db;
if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
} else {
    alert("PERHATIAN: Konfigurasi Firebase belum diisi di script.js! Game tidak akan berfungsi.");
}

// ==========================================
// 3. BANK SOAL (Pindah dari server.js)
// ==========================================
const questionsPool = {
    setA: [
        {
            q: "Pancasila bagi bangsa Indonesia berkedudukan sebagai ....",
            opts: [
                "dasar negara dan pandangan hidup bangsa",
                "peraturan pemerintah",
                "hukum daerah",
                "semboyan negara"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Sikap yang sesuai dengan sila pertama Pancasila di lingkungan sekolah adalah ....",
            opts: [
                "memaksakan agama kepada teman",
                "menghormati teman yang sedang menjalankan ibadah",
                "memilih teman berdasarkan agama",
                "melarang teman menjalankan ibadah"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Ketika terjadi perbedaan pendapat dalam kelompok, sikap yang sesuai dengan nilai Pancasila adalah ....",
            opts: [
                "memaksakan pendapat sendiri",
                "meninggalkan kelompok",
                "bermusyawarah untuk mencapai mufakat",
                "menyerahkan keputusan kepada satu orang"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Semboyan Bhinneka Tunggal Ika memiliki arti ....",
            opts: [
                "bersatu kita teguh",
                "berbeda-beda tetapi tetap satu",
                "satu bangsa satu budaya",
                "bersama membangun negara"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Indonesia memiliki banyak suku, agama, bahasa, dan budaya. Sikap yang tepat terhadap keberagaman tersebut adalah ....",
            opts: [
                "menganggap budaya sendiri paling unggul",
                "menghindari orang yang berbeda suku",
                "menghargai dan menghormati perbedaan",
                "memaksakan budaya sendiri kepada orang lain"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Contoh perilaku yang dapat memperkuat persatuan di sekolah adalah ....",
            opts: [
                "membentuk kelompok berdasarkan suku",
                "memilih teman berdasarkan status sosial",
                "bekerja sama dalam kegiatan gotong royong",
                "mengejek budaya daerah lain"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Negara Indonesia berbentuk ....",
            opts: [
                "kerajaan",
                "republik",
                "federasi",
                "monarki"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Salah satu bentuk bela negara yang dapat dilakukan oleh pelajar adalah ....",
            opts: [
                "mengikuti tawuran",
                "menaati tata tertib dan belajar dengan sungguh-sungguh",
                "menyebarkan berita bohong",
                "merusak fasilitas umum"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Menjaga keutuhan Negara Kesatuan Republik Indonesia merupakan tanggung jawab ....",
            opts: [
                "TNI saja",
                "pemerintah saja",
                "aparat keamanan saja",
                "seluruh warga negara"
            ],
            ans: 3 // (Indeks pilihan D: 3)
        },
        {
            q: "Perilaku yang menunjukkan rasa cinta tanah air adalah ....",
            opts: [
                "merusak fasilitas umum",
                "menghargai budaya dan produk dalam negeri",
                "merendahkan budaya daerah sendiri",
                "tidak peduli terhadap lingkungan"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "UUD Negara Republik Indonesia Tahun 1945 memiliki kedudukan sebagai ....",
            opts: [
                "hukum dasar negara",
                "peraturan sekolah",
                "hukum adat",
                "peraturan daerah"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Contoh kewajiban seorang pelajar sebagai bagian dari warga negara adalah ....",
            opts: [
                "mendapatkan pendidikan",
                "mendapatkan perlindungan",
                "menaati peraturan yang berlaku",
                "memperoleh penghargaan"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Seorang siswa menemukan informasi yang belum jelas kebenarannya di media sosial. Sikap yang tepat adalah ....",
            opts: [
                "langsung menyebarkannya",
                "menambahkan komentar provokatif",
                "memeriksa kebenarannya terlebih dahulu",
                "mengirimkannya ke semua grup"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Berita palsu yang sengaja dibuat dan disebarkan untuk menyesatkan masyarakat disebut ....",
            opts: [
                "fakta",
                "opini",
                "hoaks",
                "aspirasi"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Gotong royong merupakan salah satu sikap yang penting dalam kehidupan berbangsa karena ....",
            opts: [
                "menumbuhkan kerja sama dan persatuan",
                "membuat seseorang menjadi lebih berkuasa",
                "menghilangkan keberagaman",
                "mengutamakan kepentingan pribadi"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Jika ada teman yang berbeda suku atau budaya diejek oleh teman lainnya, tindakan yang paling tepat adalah ....",
            opts: [
                "ikut mengejek",
                "membiarkannya",
                "menegur dan mengajak menghargai perbedaan",
                "membalas dengan mengejek suku pelaku"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Dalam kehidupan demokratis, perbedaan pendapat sebaiknya diselesaikan melalui ....",
            opts: [
                "kekerasan",
                "musyawarah",
                "ancaman",
                "pemaksaan"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Salah satu bentuk penggunaan kemerdekaan berpendapat yang bertanggung jawab adalah ....",
            opts: [
                "menyampaikan pendapat dengan sopan dan berdasarkan fakta",
                "menghina orang yang berbeda pendapat",
                "menyebarkan fitnah",
                "memaksakan pendapat kepada orang lain"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Wawasan Nusantara mengajarkan bahwa wilayah Indonesia harus dipandang sebagai ....",
            opts: [
                "wilayah yang terpisah-pisah",
                "satu kesatuan wilayah dan bangsa",
                "kumpulan daerah yang berdiri sendiri",
                "wilayah yang hanya terdiri dari pulau-pulau besar"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Perhatikan tindakan berikut:\n1. Menghormati perbedaan agama.\n2. Melaksanakan gotong royong.\n3. Menyebarkan ujaran kebencian.\n4. Menjaga fasilitas umum.\nPerilaku yang mencerminkan wawasan kebangsaan ditunjukkan oleh nomor ....",
            opts: [
                "1, 2, dan 4",
                "1, 3, dan 4",
                "2 dan 3",
                "3 dan 4"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        }
    ],
    setB: [
        {
            q: "Semboyan Bhinneka Tunggal Ika memiliki makna, walaupun beragam?...",
            opts: [
                "Suku bangsa, agama, ras dan antar golongan tetapi tetap satu kesatuan",
                "Pemikiran tetapi tetap untuk kemajuan Indonesia",
                "Indonesia negara majemuk, tetapi mampu hidup rukun",
                "Peraturan tetapi tetap menjunjung hukum nasional"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Dengan adanya Ideologi Pancasila dimaksudkan untuk mendidik masyarakat agar ...",
            opts: [
                "Dapat mengemukakan pendapat sesuai dengan suara hati",
                "Tidak ada pemaksaan terhadap suatu peraturan",
                "Dapat meningkatkan kesejahteraan masyarakat",
                "Bertingkah laku sesuai dengan norma yang berlaku"
            ],
            ans: 3 // (Indeks pilihan D: 3)
        },
        {
            q: "Tugas utama BPUPKI adalah ....",
            opts: [
                "Menyelidiki dan mempersiapkan hal-hal terkait kemerdekaan",
                "Membentuk tentara nasional",
                "Merancang Undang-Undang Hukum Pidana",
                "Melatih rakyat untuk perang"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Ketua BPUPKI adalah ....",
            opts: [
                "Mohammad Hatta",
                "Soepomo",
                "Dr. Radjiman Wedyodiningrat",
                "Ahmad Subardjo"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Panitia Sembilan berhasil merumuskan ....",
            opts: [
                "Proklamasi Kemerdekaan",
                "Piagam Jakarta",
                "Undang-Undang Perang",
                "Tata Tertib Sidang"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Pancasila ditetapkan sebagai dasar negara pada tanggal ....",
            opts: [
                "1 Juni 1945",
                "17 Agustus 1945",
                "18 Agustus 1945",
                "19 Agustus 1945"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Sistematika atau susunan UUD 1945 saat disahkan adalah ....",
            opts: [
                "Pembukaan dan Batang Tubuh",
                "Pembukaan, Batang Tubuh, dan Penjelasan",
                "Pembukaan, Pasal-pasal, dan Lampiran",
                "Mukadimah dan Pasal-pasal"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Pasal UUD 1945 yang menegaskan bahwa bentuk negara Indonesia tidak dapat diubah adalah pasal ....",
            opts: [
                "1 ayat 1",
                "7",
                "37",
                "18"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Pembukaan UUD 1945 tidak dapat diubah karena ....",
            opts: [
                "Sudah ditetapkan MPR",
                "Mengandung dasar dan tujuan negara",
                "Sesuai Piagam Jakarta",
                "Berisi sila-sila Pancasila"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Pancasila sebagai dasar negara pertama kali dicetuskan oleh ....",
            opts: [
                "Dr. Radjiman Wedyodiningrat",
                "Ir. Soekarno",
                "Mohammad Yamin",
                "Soepomo"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Nilai sila pertama Pancasila adalah ....",
            opts: [
                "Keadilan sosial",
                "Persatuan Indonesia",
                "Ketuhanan Yang Maha Esa",
                "Kerakyatan yang dipimpin oleh hikmat kebijaksanaan"
            ],
            ans: 2 // (Indeks pilihan C: 2)
        },
        {
            q: "Makna persatuan dan kesatuan dapat ditunjukkan melalui ....",
            opts: [
                "Munculnya konflik di masyarakat",
                "Kerja sama dan sikap saling melengkapi",
                "Perpecahan antarwarga masyarakat",
                "Sikap intoleransi"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Berikut yang bukan manfaat persatuan dan kesatuan adalah ....",
            opts: [
                "Munculnya konflik",
                "Memperkuat jati diri bangsa",
                "Kerukunan dan silaturahmi terjaga",
                "Masyarakat merasa aman dan nyaman"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Contoh perilaku mempertahankan persatuan di sekolah adalah ....",
            opts: [
                "Tidak mematuhi aturan sekolah",
                "Kerja sama tanpa memandang suku dan agama",
                "Bangga terhadap diri sendiri",
                "Mementingkan kelompok tertentu"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Nilai persatuan dalam kehidupan bangsa tercermin dalam ....",
            opts: [
                "Menghormati hak orang lain",
                "Melakukan korupsi",
                "Membeda-bedakan suku dan agama",
                "Sikap individualisme"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Semangat persatuan ditunjukkan dalam Sumpah Pemuda pada tanggal ....",
            opts: [
                "28 Oktober 1928",
                "17 Agustus 1945",
                "18 Agustus 1945",
                "29 Mei 1945"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Lambang negara yang mencerminkan persatuan adalah ....",
            opts: [
                "Burung Garuda",
                "Bendera Merah Putih",
                "Pancasila",
                "Lagu Kebangsaan"
            ],
            ans: 0 // (Indeks pilihan A: 0)
        },
        {
            q: "Semboyan Bhinneka Tunggal Ika berarti ....",
            opts: [
                "Berbeda tetapi tetap satu tujuan",
                "Bersatu kita teguh",
                "Beraneka ragam budaya",
                "Kesatuan dalam keberagaman"
            ],
            ans: 3 // (Indeks pilihan D: 3)
        },
        {
            q: "Peran tokoh bangsa dalam persatuan tercermin melalui ....",
            opts: [
                "Pertikaian antar kelompok",
                "Perundingan dan diplomasi",
                "Sikap diskriminatif",
                "Konflik horizontal"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        },
        {
            q: "Konflik sosial dapat dihindari jika masyarakat mengedepankan nilai ....",
            opts: [
                "Kekuasaan",
                "Kesetaraan",
                "Individualisme",
                "Otoriterisme"
            ],
            ans: 1 // (Indeks pilihan B: 1)
        }
    ],
    setC: [
        {
            q: "Gambar seluruh atau sebagian permukaan bumi pada bidang datar dengan skala tertentu disebut ....",
            opts: [
                "globe",
                "peta",
                "atlas",
                "denah"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Komponen peta yang menjelaskan arti simbol-simbol pada peta disebut ....",
            opts: [
                "legenda",
                "skala",
                "judul",
                "garis astronomis"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Arah yang biasanya ditunjukkan pada bagian atas peta adalah ....",
            opts: [
                "selatan",
                "barat",
                "timur",
                "utara"
            ],
            ans: 3 // (Jawaban D: 3)
        },
        {
            q: "Perbandingan jarak pada peta dengan jarak sebenarnya disebut ....",
            opts: [
                "orientasi",
                "indeks",
                "skala",
                "inset"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Garis khayal mendatar yang digunakan untuk menentukan posisi suatu wilayah di utara atau selatan khatulistiwa disebut ....",
            opts: [
                "garis lintang",
                "garis bujur",
                "garis tepi",
                "garis kontur"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Kalimantan Timur terletak di bagian .... Pulau Kalimantan.",
            opts: [
                "barat",
                "timur",
                "selatan",
                "tengah"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Ibu kota Provinsi Kalimantan Timur adalah ....",
            opts: [
                "Balikpapan",
                "Bontang",
                "Samarinda",
                "Tenggarong"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Pulau Kalimantan berbatasan langsung di daratan dengan negara ....",
            opts: [
                "Malaysia",
                "Thailand",
                "Filipina",
                "Singapura"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Sungai besar yang mengalir melalui wilayah Kalimantan Timur dan Kota Samarinda adalah Sungai ....",
            opts: [
                "Kapuas",
                "Barito",
                "Mahakam",
                "Musi"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Ibu kota Provinsi Kalimantan Selatan adalah ....",
            opts: [
                "Banjarbaru",
                "Pontianak",
                "Palangka Raya",
                "Tanjung Selor"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Ibu kota Provinsi Kalimantan Barat adalah ....",
            opts: [
                "Samarinda",
                "Pontianak",
                "Banjarmasin",
                "Tarakan"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Tari Saman berasal dari Provinsi ....",
            opts: [
                "Aceh",
                "Bali",
                "Jawa Barat",
                "Papua"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Tari Kecak merupakan tarian tradisional yang berasal dari ....",
            opts: [
                "Sumatera Barat",
                "Kalimantan Timur",
                "Bali",
                "Sulawesi Selatan"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Tari Piring berasal dari daerah ....",
            opts: [
                "Jawa Tengah",
                "Sumatera Barat",
                "Maluku",
                "Nusa Tenggara Timur"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Tari Hudoq yang dikenal menggunakan topeng merupakan budaya masyarakat Dayak di wilayah ....",
            opts: [
                "Kalimantan Timur",
                "Jawa Timur",
                "Sulawesi Utara",
                "Lampung"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Tokoh yang membacakan teks Proklamasi Kemerdekaan Indonesia pada 17 Agustus 1945 adalah ....",
            opts: [
                "Mohammad Hatta",
                "Soekarno",
                "Jenderal Sudirman",
                "Ki Hajar Dewantara"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Tokoh yang mendampingi Soekarno saat Proklamasi Kemerdekaan dan kemudian menjadi Wakil Presiden pertama Indonesia adalah ....",
            opts: [
                "Mohammad Hatta",
                "Ahmad Yani",
                "Sutan Sjahrir",
                "Bung Tomo"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Pahlawan perempuan dari Aceh yang gigih melawan penjajahan Belanda adalah ....",
            opts: [
                "R.A. Kartini",
                "Martha Christina Tiahahu",
                "Cut Nyak Dien",
                "Dewi Sartika"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Tokoh yang terkenal membangkitkan semangat rakyat Surabaya dalam pertempuran 10 November 1945 adalah ....",
            opts: [
                "Pattimura",
                "Bung Tomo",
                "Tuanku Imam Bonjol",
                "Pangeran Diponegoro"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Sikap yang tepat untuk menghargai jasa para pahlawan adalah ....",
            opts: [
                "mengabaikan upacara bendera",
                "merusak fasilitas umum",
                "belajar sungguh-sungguh dan menjaga persatuan",
                "mementingkan kelompok sendiri"
            ],
            ans: 2 // (Jawaban C: 2)
        }
    ],
    setD: [
        {
            q: "Tari Gantar merupakan tarian tradisional masyarakat Dayak yang berkembang di daerah ....",
            opts: [
                "Kalimantan Timur",
                "Sumatera Utara",
                "Jawa Barat",
                "Bali"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Tari Kancet Ledo dari Kalimantan Timur dikenal juga dengan nama Tari ....",
            opts: [
                "Piring",
                "Gong",
                "Serimpi",
                "Kipas"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Tari Hudoq biasanya menggunakan perlengkapan utama berupa ....",
            opts: [
                "payung",
                "piring",
                "topeng",
                "kipas"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Lagu daerah 'Indung-Indung' berasal dari ....",
            opts: [
                "Kalimantan Timur",
                "Maluku",
                "Jawa Tengah",
                "Sulawesi Utara"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Lagu daerah 'Buah Bolok' dikenal sebagai lagu dari daerah ....",
            opts: [
                "Kutai, Kalimantan Timur",
                "Minangkabau, Sumatera Barat",
                "Betawi, DKI Jakarta",
                "Banyuwangi, Jawa Timur"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Lagu 'Ampar-Ampar Pisang' berasal dari Provinsi ....",
            opts: [
                "Kalimantan Barat",
                "Kalimantan Selatan",
                "Kalimantan Timur",
                "Kalimantan Utara"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Lagu daerah 'Apuse' berasal dari ....",
            opts: [
                "Papua",
                "Aceh",
                "Bali",
                "Lampung"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Lagu 'Yamko Rambe Yamko' dikenal sebagai lagu daerah dari ....",
            opts: [
                "Riau",
                "Papua",
                "Banten",
                "Bengkulu"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Jenderal Sudirman dikenal sebagai Panglima Besar yang memimpin perjuangan dengan strategi ....",
            opts: [
                "diplomasi dagang",
                "perang gerilya",
                "politik etis",
                "tanam paksa"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Walaupun sedang sakit, Jenderal Sudirman tetap berjuang dengan cara ....",
            opts: [
                "memimpin gerilya melawan Belanda",
                "meninggalkan Indonesia",
                "bekerja untuk pemerintah kolonial",
                "menghentikan seluruh perlawanan"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Bung Tomo dikenang karena membangkitkan semangat rakyat dalam pertempuran di Kota ....",
            opts: [
                "Bandung",
                "Surabaya",
                "Medan",
                "Semarang"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Pertempuran Surabaya yang diperingati sebagai Hari Pahlawan terjadi pada tanggal ....",
            opts: [
                "1 Juni",
                "17 Agustus",
                "10 November",
                "28 Oktober"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Tokoh yang dikenal sebagai Bapak Pendidikan Nasional adalah ....",
            opts: [
                "Ki Hajar Dewantara",
                "Mohammad Yamin",
                "Jenderal Sudirman",
                "Bung Tomo"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Semboyan pendidikan 'Tut Wuri Handayani' dikemukakan oleh ....",
            opts: [
                "R.A. Kartini",
                "Ki Hajar Dewantara",
                "Dewi Sartika",
                "Cut Nyak Dien"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Pahlawan perempuan yang mendirikan Sekolah Istri untuk pendidikan kaum perempuan adalah ....",
            opts: [
                "Dewi Sartika",
                "Cut Meutia",
                "Martha Christina Tiahahu",
                "Maria Walanda Maramis"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Proklamasi Kemerdekaan Republik Indonesia dibacakan pada tanggal ....",
            opts: [
                "20 Mei 1908",
                "28 Oktober 1928",
                "17 Agustus 1945",
                "10 November 1945"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Teks Proklamasi Kemerdekaan Indonesia dibacakan di ....",
            opts: [
                "Jalan Pegangsaan Timur Nomor 56, Jakarta",
                "Istana Bogor",
                "Gedung Sate, Bandung",
                "Tugu Pahlawan, Surabaya"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Tokoh yang mengetik naskah Proklamasi Kemerdekaan Indonesia adalah ....",
            opts: [
                "Sayuti Melik",
                "Sukarni",
                "Wikana",
                "B.M. Diah"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Tokoh yang turut merumuskan naskah Proklamasi bersama Soekarno dan Mohammad Hatta adalah ....",
            opts: [
                "Ahmad Soebardjo",
                "Bung Tomo",
                "Jenderal Sudirman",
                "Ki Hajar Dewantara"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Peristiwa Rengasdengklok bertujuan mendesak Soekarno dan Mohammad Hatta agar segera ....",
            opts: [
                "membentuk organisasi dagang",
                "memproklamasikan kemerdekaan Indonesia",
                "menyerahkan kekuasaan kepada Jepang",
                "meninggalkan Jakarta selamanya"
            ],
            ans: 1 // (Jawaban B: 1)
        }
    ],
    setE: [
        {
            q: "Tokoh yang dikenal sebagai pemimpin Perang Diponegoro adalah ...",
            opts: [
                "Pangeran Diponegoro",
                "Sultan Hasanuddin",
                "Pattimura",
                "Tuanku Imam Bonjol"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Pahlawan yang memimpin perlawanan rakyat Surabaya dan terkenal dengan pidato membakar semangat pada 10 November 1945 adalah ...",
            opts: [
                "Jenderal Sudirman",
                "Bung Tomo",
                "Mohammad Hatta",
                "Ki Hajar Dewantara"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Jenderal Sudirman dikenal dalam perjuangan mempertahankan kemerdekaan melalui strategi ...",
            opts: [
                "Politik etis",
                "Perang gerilya",
                "Perang laut",
                "Diplomasi dagang"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Kapitan Pattimura merupakan pahlawan yang berasal dari daerah ...",
            opts: [
                "Aceh",
                "Maluku",
                "Bali",
                "Kalimantan Timur"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Sultan Hasanuddin mendapat julukan dari Belanda sebagai ...",
            opts: [
                "Ayam Jantan dari Timur",
                "Macan dari Selatan",
                "Elang dari Barat",
                "Harimau Sumatra"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Pahlawan wanita dari Aceh yang berjuang melawan penjajahan Belanda adalah ...",
            opts: [
                "R.A. Kartini",
                "Dewi Sartika",
                "Cut Nyak Dien",
                "Martha Christina Tiahahu"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "R.A. Kartini dikenal sebagai pelopor ...",
            opts: [
                "Pendidikan dan kemajuan perempuan",
                "Perjuangan angkatan laut",
                "Pembangunan jalan raya",
                "Pertanian modern"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Dewi Sartika mendirikan sekolah bagi kaum perempuan yang dikenal dengan nama ...",
            opts: [
                "Taman Siswa",
                "Sekolah Isteri",
                "Sekolah Rakyat",
                "Perguruan Nasional"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Pahlawan wanita muda dari Maluku yang turut melawan Belanda adalah ...",
            opts: [
                "Martha Christina Tiahahu",
                "Maria Walanda Maramis",
                "Nyi Ageng Serang",
                "Opu Daeng Risaju"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Tokoh wanita yang menjahit Bendera Pusaka Merah Putih menjelang Proklamasi Kemerdekaan adalah ...",
            opts: [
                "R.A. Kartini",
                "Fatmawati",
                "Cut Meutia",
                "Dewi Sartika"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Presiden pertama Republik Indonesia adalah ...",
            opts: [
                "Mohammad Hatta",
                "Soekarno",
                "Sutan Sjahrir",
                "Soeharto"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Soekarno dan Mohammad Hatta membacakan teks Proklamasi Kemerdekaan pada tanggal ...",
            opts: [
                "1 Juni 1945",
                "17 Agustus 1945",
                "18 Agustus 1945",
                "10 November 1945"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Tokoh yang mengibarkan Bendera Pusaka Merah Putih pada saat Proklamasi Kemerdekaan 17 Agustus 1945 adalah ...",
            opts: [
                "Soekarno dan Mohammad Hatta",
                "Latief Hendraningrat dan Suhud",
                "Bung Tomo dan Jenderal Sudirman",
                "Ahmad Soebardjo dan Sutan Sjahrir"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Gambar pahlawan pada uang kertas Rp100.000 Tahun Emisi 2022 adalah ...",
            opts: [
                "Soekarno dan Mohammad Hatta",
                "Jenderal Sudirman dan Bung Tomo",
                "Ki Hajar Dewantara dan R.A. Kartini",
                "Pattimura dan Sultan Hasanuddin"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Pahlawan Ir. H. Djuanda Kartawidjaja terdapat pada uang kertas pecahan ...",
            opts: [
                "Rp20.000",
                "Rp50.000",
                "Rp10.000",
                "Rp5.000"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Gambar pahlawan pada uang kertas Rp20.000 Tahun Emisi 2022 adalah ...",
            opts: [
                "Frans Kaisiepo",
                "Dr. G.S.S.J. Ratulangi",
                "Oto Iskandar di Nata",
                "Mohammad Hoesni Thamrin"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Frans Kaisiepo terdapat pada uang kertas Rupiah pecahan ...",
            opts: [
                "Rp10.000",
                "Rp5.000",
                "Rp2.000",
                "Rp1.000"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "K.H. Idham Chalid terdapat pada uang kertas Rupiah pecahan ...",
            opts: [
                "Rp50.000",
                "Rp20.000",
                "Rp10.000",
                "Rp5.000"
            ],
            ans: 3 // (Jawaban D: 3)
        },
        {
            q: "Mohammad Hoesni Thamrin terdapat pada uang kertas Rupiah pecahan ...",
            opts: [
                "Rp1.000",
                "Rp2.000",
                "Rp5.000",
                "Rp10.000"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Pahlawan wanita Tjut Meutia terdapat pada uang kertas Rupiah pecahan ...",
            opts: [
                "Rp1.000",
                "Rp2.000",
                "Rp20.000",
                "Rp50.000"
            ],
            ans: 0 // (Jawaban A: 0)
        }
    ],
    setG: [
        {
            q: "Ibu kota Provinsi Kalimantan Timur adalah ...",
            opts: [
                "Balikpapan",
                "Samarinda",
                "Bontang",
                "Tenggarong"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Jumlah kabupaten dan kota di Provinsi Kalimantan Timur adalah ...",
            opts: [
                "7 kabupaten dan 3 kota",
                "6 kabupaten dan 4 kota",
                "8 kabupaten dan 2 kota",
                "9 kabupaten dan 1 kota"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Kabupaten yang beribu kota di Tanjung Redeb adalah ...",
            opts: [
                "Kabupaten Paser",
                "Kabupaten Berau",
                "Kabupaten Kutai Barat",
                "Kabupaten Penajam Paser Utara"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Ibu kota Kabupaten Kutai Kartanegara adalah ...",
            opts: [
                "Sangatta",
                "Sendawar",
                "Tenggarong",
                "Tanah Grogot"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Sangatta merupakan ibu kota Kabupaten ...",
            opts: [
                "Kutai Timur",
                "Kutai Barat",
                "Berau",
                "Paser"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Kabupaten termuda di Kalimantan Timur yang beribu kota di Ujoh Bilang adalah ...",
            opts: [
                "Mahakam Ulu",
                "Kutai Kartanegara",
                "Penajam Paser Utara",
                "Berau"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Kota di Kalimantan Timur yang terkenal sebagai Kota Minyak adalah ...",
            opts: [
                "Samarinda",
                "Bontang",
                "Balikpapan",
                "Tenggarong"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Kabupaten Penajam Paser Utara beribu kota di ...",
            opts: [
                "Penajam",
                "Tanah Grogot",
                "Sendawar",
                "Sangatta"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Kepulauan Derawan, yang terkenal dengan wisata baharinya, berada di Kabupaten ...",
            opts: [
                "Berau",
                "Paser",
                "Kutai Barat",
                "Mahakam Ulu"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Danau Labuan Cermin berada di kawasan Biduk-Biduk, Kabupaten ...",
            opts: [
                "Kutai Timur",
                "Berau",
                "Kutai Kartanegara",
                "Paser"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Museum Mulawarman yang merupakan bekas keraton Kesultanan Kutai terletak di ...",
            opts: [
                "Tenggarong",
                "Bontang",
                "Samarinda",
                "Balikpapan"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Wisata susur Sungai Mahakam paling erat dikaitkan dengan Kota ...",
            opts: [
                "Bontang",
                "Balikpapan",
                "Samarinda",
                "Penajam"
            ],
            ans: 2 // (Jawaban C: 2)
        },
        {
            q: "Pulau Kakaban di Kabupaten Berau terkenal karena memiliki ...",
            opts: [
                "Danau ubur-ubur",
                "Kawah gunung api",
                "Perkebunan teh",
                "Air terjun bertingkat"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Desa Budaya Pampang, tempat wisata budaya masyarakat Dayak, berada di Kota ...",
            opts: [
                "Samarinda",
                "Balikpapan",
                "Bontang",
                "Tenggarong"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Salah satu sektor yang memberikan kontribusi sangat besar terhadap perekonomian Kalimantan Timur adalah ...",
            opts: [
                "Pertambangan dan penggalian",
                "Industri tekstil",
                "Perkebunan teh",
                "Perikanan air dingin"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Komoditas tambang yang sangat menonjol di Kalimantan Timur adalah ...",
            opts: [
                "Timah",
                "Batubara",
                "Bauksit",
                "Emas putih"
            ],
            ans: 1 // (Jawaban B: 1)
        },
        {
            q: "Selain pertambangan, komoditas perkebunan yang banyak dikembangkan di Kalimantan Timur adalah ...",
            opts: [
                "Kelapa sawit",
                "Teh",
                "Apel",
                "Stroberi"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Makanan ringan khas Samarinda yang dibuat dari ikan dan tepung lalu digoreng adalah ...",
            opts: [
                "Amplang",
                "Gudeg",
                "Pempek",
                "Bika ambon"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Ayam cincane khas Samarinda memiliki ciri utama berupa ...",
            opts: [
                "Bumbu merah yang gurih",
                "Kuah santan putih",
                "Saus keju",
                "Balutan gula cair"
            ],
            ans: 0 // (Jawaban A: 0)
        },
        {
            q: "Makanan khas Samarinda berupa kue berlapis dari tepung beras, santan, dan pisang disebut ...",
            opts: [
                "Bubur peca",
                "Amparan tatak",
                "Lemper",
                "Serabi"
            ],
            ans: 1 // (Jawaban B: 1)
        }
    ]
};

const MAX_QUESTIONS = 20;

function generateQuestions(selectedSet) {
    let pool = questionsPool.setA;
    if (questionsPool[selectedSet]) {
        pool = questionsPool[selectedSet];
    } else if (selectedSet === 'random') {
        const sets = ['setA', 'setB', 'setC', 'setD', 'setE', 'setG'];
        const randomSet = sets[Math.floor(Math.random() * sets.length)];
        pool = questionsPool[randomSet];
    }
    // Randomize
    return [...pool].sort(() => Math.random() - 0.5).slice(0, MAX_QUESTIONS);
}

// ==========================================
// 4. UI ELEMENTS
// ==========================================
const lobbyScreen = document.getElementById('lobby-screen');
const waitingScreen = document.getElementById('waiting-screen');
const countdownScreen = document.getElementById('countdown-screen');
const roomCodeInput = document.getElementById('room-code-input');
const hostPasswordInput = document.getElementById('host-password-input');
const schoolSelect = document.getElementById('school-select');
const btnCreateRoom = document.getElementById('btn-create-room');
const btnJoinRoom = document.getElementById('btn-join-room');
const lobbyMessage = document.getElementById('lobby-message');
const displayRoomCode = document.getElementById('display-room-code');
const vsText = document.getElementById('vs-text');
const countdownText = document.getElementById('countdown-text');
const waitPlayerA = document.getElementById('wait-player-a');
const waitPlayerB = document.getElementById('wait-player-b');
const hostControls = document.getElementById('host-controls');
const btnStartGame = document.getElementById('btn-start-game');

const headerArea = document.getElementById('header-area');
const ropeArea = document.getElementById('rope-area');
const quizArea = document.getElementById('quiz-area');
const nameAEl = document.getElementById('name-a');
const nameBEl = document.getElementById('name-b');
const scoreAEl = document.getElementById('score-a');
const scoreBEl = document.getElementById('score-b');
const timerText = document.getElementById('timer-text');
const indicator = document.getElementById('indicator');
const questionTextEl = document.getElementById('question-text');
const questionImgEl = document.getElementById('question-img');
const boxHost = document.getElementById('box-host');
const boxA = document.getElementById('box-a');
const boxB = document.getElementById('box-b');
const optionsHostContainer = document.getElementById('options-host');
const optionsAContainer = document.getElementById('options-a');
const optionsBContainer = document.getElementById('options-b');
const bgA = document.getElementById('bg-a');
const bgB = document.getElementById('bg-b');
const endOverlay = document.getElementById('end-overlay');
const endTitle = document.getElementById('end-title');

// Stats Elements
const postGameStats = document.getElementById('post-game-stats');
const statNameA = document.getElementById('stat-name-a');
const statCorrectA = document.getElementById('stat-correct-a');
const statTimeA = document.getElementById('stat-time-a');
const statAvgA = document.getElementById('stat-avg-a');
const statNameB = document.getElementById('stat-name-b');
const statCorrectB = document.getElementById('stat-correct-b');
const statTimeB = document.getElementById('stat-time-b');
const statAvgB = document.getElementById('stat-avg-b');

// History Elements
const btnSettings = document.getElementById('btn-settings');
const historyModal = document.getElementById('history-modal');
const closeHistory = document.getElementById('close-history');
const historyList = document.getElementById('history-list');

// Audio Elements
const bgmAudio = document.getElementById('bgm-audio');
const sfxCorrect = document.getElementById('sfx-correct');
const sfxWrong = document.getElementById('sfx-wrong');
const btnMute = document.getElementById('btn-mute');

let isMuted = false;
if(btnMute) {
    btnMute.addEventListener('click', () => {
        isMuted = !isMuted;
        if(bgmAudio) bgmAudio.muted = isMuted;
        if(sfxCorrect) sfxCorrect.muted = isMuted;
        if(sfxWrong) sfxWrong.muted = isMuted;
        btnMute.innerHTML = isMuted ? '🔇' : '🔊';
    });
}

// Client State
let myRoom = '';
let myRole = ''; // 'host', 'A', or 'B'
let isLocked = true; 
let hostTimerInterval = null;

// ==========================================
// 4.5. HISTORY MODAL LOGIC
// ==========================================
btnSettings.addEventListener('click', async () => {
    if (!db) return alert("Firebase belum dikonfigurasi!");
    historyModal.style.display = 'flex';
    historyList.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:20px;">Memuat riwayat...</p>';
    
    try {
        const snap = await get(ref(db, 'history'));
        if (!snap.exists()) {
            historyList.innerHTML = '<p style="text-align:center; color:#aaa; margin-top:20px;">Belum ada riwayat pertandingan.</p>';
            return;
        }
        
        const historyData = snap.val();
        const historyArray = Object.values(historyData).sort((a, b) => b.timestamp - a.timestamp); // Sort by newest
        
        historyList.innerHTML = '';
        historyArray.forEach(match => {
            const dateStr = new Date(match.timestamp).toLocaleString('id-ID');
            let winnerClass = '';
            if (match.winner === match.teamA) winnerClass = 'win-a';
            else if (match.winner === match.teamB) winnerClass = 'win-b';
            
            historyList.innerHTML += `
                <div class="history-item ${winnerClass}">
                    <div class="history-info">
                        <p>${dateStr} - Room: ${match.roomCode}</p>
                        <strong>${match.teamA} (${match.scoreA}) vs ${match.teamB} (${match.scoreB})</strong>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size:14px; margin:0; color:#aaa;">Pemenang</p>
                        <strong style="color: #ffd700;">${match.winner}</strong>
                    </div>
                </div>
            `;
        });
    } catch (e) {
        historyList.innerHTML = '<p style="text-align:center; color:#ff4d4d; margin-top:20px;">Gagal memuat riwayat.</p>';
    }
});

closeHistory.addEventListener('click', () => {
    historyModal.style.display = 'none';
});

// Tutup modal jika klik di luar kotak
historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) historyModal.style.display = 'none';
});

// ==========================================
// 5. LOBBY LOGIC
// ==========================================

btnCreateRoom.addEventListener('click', async () => {
    if(!db) return alert("Firebase belum dikonfigurasi! Harap buka file script.js dan masukkan konfigurasi Anda.");
    
    if (hostPasswordInput.value !== 'kesbangumkt2026') {
        return lobbyMessage.innerText = "Password Host salah!";
    }

    const selectedSet = document.getElementById('question-set-select').value;
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    myRoom = roomCode;
    myRole = 'host';
    
    const initialState = {
        players: { A: null, B: null },
        state: {
            status: 'waiting',
            ropePos: 50,
            scoreA: 0,
            scoreB: 0,
            totalTimeA: 0,
            totalTimeB: 0,
            correctAnswersA: 0,
            correctAnswersB: 0,
            currentQIndex: 0,
            questions: generateQuestions(selectedSet),
            questionStartTime: 0,
            timeLeft: 20,
            actionTrigger: null // Untuk mentrigger animasi benar/salah
        },
        actions: { A: null, B: null }
    };

    await set(ref(db, 'rooms/' + roomCode), initialState);

    // Setup UI
    lobbyScreen.style.display = 'none';
    waitingScreen.style.display = 'flex';
    displayRoomCode.innerText = myRoom;
    
    headerArea.style.display = 'flex';
    ropeArea.style.display = 'flex';
    quizArea.style.display = 'flex';
    boxHost.style.display = 'none';
    boxA.style.display = 'block';
    boxB.style.display = 'block';
    document.querySelector('.box-a h3').innerText = 'JAWABAN TIM MERAH';
    document.querySelector('.box-b h3').innerText = 'JAWABAN TIM PUTIH';

    listenToRoomAsHost(roomCode);
    if(bgmAudio) bgmAudio.play().catch(e => console.log("BGM Error:", e));
});

btnJoinRoom.addEventListener('click', async () => {
    if(!db) return alert("Firebase belum dikonfigurasi! Harap buka file script.js dan masukkan konfigurasi Anda.");

    const roomCode = roomCodeInput.value.trim().toUpperCase();
    const school = schoolSelect.value;
    
    if (!roomCode) return lobbyMessage.innerText = "Masukkan kode room!";
    if (!school) return lobbyMessage.innerText = "Pilih sekolah Anda!";
    
    btnJoinRoom.disabled = true;
    
    const roomRef = ref(db, 'rooms/' + roomCode);
    const snapshot = await get(roomRef);
    
    if (!snapshot.exists()) {
        btnJoinRoom.disabled = false;
        return lobbyMessage.innerText = "Room tidak ditemukan!";
    }
    
    const roomData = snapshot.val();
    if (roomData.state.status !== 'waiting') {
        btnJoinRoom.disabled = false;
        return lobbyMessage.innerText = "Game sudah dimulai atau room penuh!";
    }

    let assignedRole = null;
    if (!roomData.players || !roomData.players.A) assignedRole = 'A';
    else if (!roomData.players.B) assignedRole = 'B';
    else {
        btnJoinRoom.disabled = false;
        return lobbyMessage.innerText = "Room sudah penuh (2 Pemain sudah masuk)!";
    }

    myRoom = roomCode;
    myRole = assignedRole;
    
    await update(ref(db, `rooms/${roomCode}/players/${assignedRole}`), { name: school });

    lobbyScreen.style.display = 'none';
    waitingScreen.style.display = 'flex';
    displayRoomCode.innerText = myRoom;

    headerArea.style.display = 'flex'; 
    ropeArea.style.display = 'none'; 
    quizArea.style.display = 'flex'; 
    
    if (myRole === 'A') { boxA.style.display = 'block'; boxB.style.display = 'none'; document.querySelector('.box-a h3').innerText = 'PILIHAN JAWABAN ANDA'; }
    if (myRole === 'B') { boxA.style.display = 'none'; boxB.style.display = 'block'; document.querySelector('.box-b h3').innerText = 'PILIHAN JAWABAN ANDA'; }

    listenToRoomAsPlayer(roomCode);
    if(bgmAudio) bgmAudio.play().catch(e => console.log("BGM Error:", e));
});

if (btnStartGame) {
    btnStartGame.addEventListener('click', async () => {
        if (myRole !== 'host') return;
        const snapshot = await get(ref(db, 'rooms/' + myRoom));
        const data = snapshot.val();
        if (data && data.players && data.players.A && data.players.B && data.state.status === 'waiting') {
            hostControls.style.display = 'none';
            startGameAsHost(myRoom, data);
        }
    });
}

// ==========================================
// 6. HOST LOGIC (Bertindak sebagai Server)
// ==========================================
function listenToRoomAsHost(roomCode) {
    const roomRef = ref(db, 'rooms/' + roomCode);
    let lastActionTimestamp = 0;

    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        // Host Handles Answers
        if (data.state.status === 'playing' && data.actions) {
            handlePlayerAnswersAsHost(roomCode, data);
        }
        
        // Update UI Host
        renderState(data);

        // Tampilkan feedback jawaban di Host (Projector)
        if (data.state.actionTrigger && data.state.actionTrigger.timestamp > lastActionTimestamp) {
            lastActionTimestamp = data.state.actionTrigger.timestamp;
            renderFeedback(data.state.actionTrigger, data.state);
        }
    });
}

function startGameAsHost(roomCode, data) {
    update(ref(db, `rooms/${roomCode}/state`), { status: 'countdown' });
    
    setTimeout(() => {
        update(ref(db, `rooms/${roomCode}/state`), { 
            status: 'reading',
            questionStartTime: Date.now(),
            timeLeft: 5
        });
        startHostTimer(roomCode);
    }, 4000); // 4 detik countdown
}

function startHostTimer(roomCode) {
    clearInterval(hostTimerInterval);
    hostTimerInterval = setInterval(async () => {
        const snap = await get(ref(db, `rooms/${roomCode}/state`));
        if(!snap.exists()) return clearInterval(hostTimerInterval);
        
        let state = snap.val();
        if(state.status !== 'playing' && state.status !== 'reading') return clearInterval(hostTimerInterval);

        let newTime = state.timeLeft - 1;
        
        if (newTime <= 0) {
            clearInterval(hostTimerInterval);
            if (state.status === 'reading') {
                state.status = 'playing';
                state.timeLeft = 10;
                state.questionStartTime = Date.now();
                update(ref(db, `rooms/${roomCode}/state`), state);
                startHostTimer(roomCode);
            } else if (state.status === 'playing') {
                handleTimeUpAsHost(roomCode, state);
            }
        } else {
            update(ref(db, `rooms/${roomCode}/state`), { timeLeft: newTime });
        }
    }, 1000);
}

async function handlePlayerAnswersAsHost(roomCode, data) {
    const state = data.state;
    const actions = data.actions;
    const currentQ = state.questions[state.currentQIndex];

    let actionTrigger = null;

    if (actions.A && !state.hasAnsweredA) {
        state.hasAnsweredA = true;
        const isCorrect = (actions.A.answerIndex === currentQ.ans);
        const timeTaken = Date.now() - state.questionStartTime;
        
        if(isCorrect) {
            clearInterval(hostTimerInterval); // Stop timer
            state.scoreA += 10; state.ropePos -= 10; state.totalTimeA += timeTaken; state.correctAnswersA++;
            actionTrigger = { team: 'A', isCorrect, answerIndex: actions.A.answerIndex, correctAnswerIndex: currentQ.ans, reveal: true, timestamp: Date.now() };
            await update(ref(db, `rooms/${roomCode}/actions`), { A: null }); // Clear action
            proceedToNextQuestion(roomCode, state, actionTrigger);
        } else {
            actionTrigger = { team: 'A', isCorrect, answerIndex: actions.A.answerIndex, correctAnswerIndex: currentQ.ans, reveal: !!state.hasAnsweredB, timestamp: Date.now() };
            state.actionTrigger = actionTrigger;
            await update(ref(db, `rooms/${roomCode}/actions`), { A: null });
            await update(ref(db, `rooms/${roomCode}/state`), state);
            
            if (state.hasAnsweredB) {
                clearInterval(hostTimerInterval);
                proceedToNextQuestion(roomCode, state, actionTrigger);
            }
        }
    } 
    else if (actions.B && !state.hasAnsweredB) {
        state.hasAnsweredB = true;
        const isCorrect = (actions.B.answerIndex === currentQ.ans);
        const timeTaken = Date.now() - state.questionStartTime;
        
        if(isCorrect) {
            clearInterval(hostTimerInterval); // Stop timer
            state.scoreB += 10; state.ropePos += 10; state.totalTimeB += timeTaken; state.correctAnswersB++;
            actionTrigger = { team: 'B', isCorrect, answerIndex: actions.B.answerIndex, correctAnswerIndex: currentQ.ans, reveal: true, timestamp: Date.now() };
            await update(ref(db, `rooms/${roomCode}/actions`), { B: null }); // Clear action
            proceedToNextQuestion(roomCode, state, actionTrigger);
        } else {
            actionTrigger = { team: 'B', isCorrect, answerIndex: actions.B.answerIndex, correctAnswerIndex: currentQ.ans, reveal: !!state.hasAnsweredA, timestamp: Date.now() };
            state.actionTrigger = actionTrigger;
            await update(ref(db, `rooms/${roomCode}/actions`), { B: null });
            await update(ref(db, `rooms/${roomCode}/state`), state);
            
            if (state.hasAnsweredA) {
                clearInterval(hostTimerInterval);
                proceedToNextQuestion(roomCode, state, actionTrigger);
            }
        }
    }
}

function handleTimeUpAsHost(roomCode, state) {
    const currentQ = state.questions[state.currentQIndex];
    const actionTrigger = { team: 'none', isCorrect: false, answerIndex: -1, correctAnswerIndex: currentQ.ans, reveal: true, timestamp: Date.now() };
    proceedToNextQuestion(roomCode, state, actionTrigger);
}

function proceedToNextQuestion(roomCode, state, actionTrigger) {
    state.actionTrigger = actionTrigger; // Beritahu client soal jawaban
    state.hasAnsweredA = false;
    state.hasAnsweredB = false;
    
    if (state.ropePos <= 0 || state.ropePos >= 100 || state.currentQIndex + 1 >= MAX_QUESTIONS) {
        state.status = 'ended';
        update(ref(db, `rooms/${roomCode}/state`), state);
    } else {
        state.status = 'transition';
        state.timeLeft = 5;
        update(ref(db, `rooms/${roomCode}/state`), state);
        
        clearInterval(hostTimerInterval);
        hostTimerInterval = setInterval(() => {
            state.timeLeft--;
            if (state.timeLeft <= 0) {
                clearInterval(hostTimerInterval);
                state.currentQIndex++; // Pindah soal baru setelah jeda 5 detik selesai
                state.status = 'reading';
                state.questionStartTime = Date.now();
                state.timeLeft = 5;
                update(ref(db, `rooms/${roomCode}/state`), state);
                startHostTimer(roomCode);
            } else {
                update(ref(db, `rooms/${roomCode}/state`), { timeLeft: state.timeLeft });
            }
        }, 1000);
    }
}

// ==========================================
// 7. PLAYER LOGIC
// ==========================================
function listenToRoomAsPlayer(roomCode) {
    const roomRef = ref(db, 'rooms/' + roomCode);
    let lastActionTimestamp = 0;

    onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if(!data) return;

        renderState(data);

        // Handle feedback jawaban dari Host (menggunakan actionTrigger)
        if (data.state.actionTrigger && data.state.actionTrigger.timestamp > lastActionTimestamp) {
            lastActionTimestamp = data.state.actionTrigger.timestamp;
            renderFeedback(data.state.actionTrigger, data.state);
        }
    });
}

window.handleMouseClick = function(idx) {
    if (isLocked || myRole === 'host') return;
    isLocked = true;
    
    // Matikan semua tombol sementara
    const btns = document.querySelectorAll('.option');
    btns.forEach(btn => btn.disabled = true);
    
    // Kirim aksi ke Firebase
    update(ref(db, `rooms/${myRoom}/actions`), {
        [myRole]: { answerIndex: idx, timestamp: Date.now() }
    });
};

// ==========================================
// 8. RENDERER UMUM (Untuk Host & Player)
// ==========================================
function renderState(data) {
    const state = data.state;

    // Update Lobby Player Names untuk Semua Layar
    if (data.players) {
        if(data.players.A) { waitPlayerA.innerText = data.players.A.name; waitPlayerA.style.color = '#ff7777'; }
        if(data.players.B) { waitPlayerB.innerText = data.players.B.name; waitPlayerB.style.color = '#ffffff'; }
    }

    // Nama & Skor
    if(data.players) {
        nameAEl.innerText = `${data.players.A ? data.players.A.name : 'Tim Merah'} (MERAH)`;
        nameBEl.innerText = `${data.players.B ? data.players.B.name : 'Tim Putih'} (PUTIH)`;
    }
    scoreAEl.innerText = state.scoreA;
    scoreBEl.innerText = state.scoreB;
    indicator.style.left = Math.max(0, Math.min(100, state.ropePos)) + '%';
    
    timerText.innerText = state.timeLeft;
    if (state.timeLeft <= 5) timerText.classList.add('danger');
    else timerText.classList.remove('danger');

    // Layar Menunggu
    if (state.status === 'waiting') {
        waitingScreen.style.display = 'flex';
        countdownScreen.style.display = 'none';
        
        if (myRole === 'host' && data.players && data.players.A && data.players.B) {
            if (hostControls) hostControls.style.display = 'block';
        } else {
            if (hostControls) hostControls.style.display = 'none';
        }
    } 
    // Countdown Awal
    else if (state.status === 'countdown') {
        waitingScreen.style.display = 'none';
        countdownScreen.style.display = 'flex';
        vsText.innerText = `${nameAEl.innerText} VS ${nameBEl.innerText}`;
        
        if (!countdownText.dataset.started) {
            countdownText.dataset.started = "true";
            let count = 3;
            countdownText.innerText = count;
            countdownText.style.display = 'block';
            
            countdownText.classList.remove('animate-pop');
            void countdownText.offsetWidth; // Reflow
            countdownText.classList.add('animate-pop');
            
            const countInterval = setInterval(() => {
                count--;
                if (count > 0) {
                    countdownText.innerText = count;
                    countdownText.classList.remove('animate-pop');
                    void countdownText.offsetWidth;
                    countdownText.classList.add('animate-pop');
                } else if (count === 0) {
                    countdownText.innerText = "MULAI!";
                    countdownText.style.color = "#28a745";
                    countdownText.classList.remove('animate-pop');
                    void countdownText.offsetWidth;
                    countdownText.classList.add('animate-pop');
                } else {
                    clearInterval(countInterval);
                    countdownText.dataset.started = ""; // Reset
                    countdownText.style.color = "#ffd700";
                }
            }, 1000);
        }
    } 
    // Sedang Bermain atau Membaca atau Transition
    else if (['reading', 'playing', 'transition'].includes(state.status)) {
        waitingScreen.style.display = 'none';
        countdownScreen.style.display = 'none';
        
        if (lastRenderedQIndex !== state.currentQIndex || window.lastRenderedStatus !== state.status) {
            if (state.status !== 'transition' || lastRenderedQIndex !== state.currentQIndex) {
                renderQuestion(state);
            }
        }
        
        if (state.status === 'transition' || state.status === 'reading') isLocked = true;
    }
    // Selesai
    else if (state.status === 'ended') {
        renderGameOver(data);
    }
}

let lastRenderedQIndex = -1;

function renderQuestion(state) {
    if (state.currentQIndex >= MAX_QUESTIONS) return;
    
    lastRenderedQIndex = state.currentQIndex;
    window.lastRenderedStatus = state.status;

    isLocked = (state.status === 'reading');
    const currentQ = state.questions[state.currentQIndex];
    
    questionTextEl.innerText = `Soal ${state.currentQIndex + 1}/${MAX_QUESTIONS}:\n${currentQ.q}`;
    if (currentQ.img) {
        questionImgEl.src = currentQ.img; questionImgEl.style.display = 'block';
    } else {
        questionImgEl.style.display = 'none';
    }

    const hints = ['A', 'B', 'C', 'D'];
    
    if (myRole === 'host') {
        optionsAContainer.innerHTML = '';
        optionsBContainer.innerHTML = '';
        currentQ.opts.forEach((opt, idx) => {
            const optContent = state.status === 'reading' ? '...' : opt;
            optionsAContainer.innerHTML += `
                <button class="option disabled-option" id="opt-host-a-${idx}" disabled="true">
                    <span class="key-hint hint-a">${hints[idx]}</span><span class="opt-text">${optContent}</span>
                </button>`;
            optionsBContainer.innerHTML += `
                <button class="option disabled-option" id="opt-host-b-${idx}" disabled="true">
                    <span class="key-hint hint-b">${hints[idx]}</span><span class="opt-text">${optContent}</span>
                </button>`;
        });
    } else {
        optionsAContainer.innerHTML = '';
        optionsBContainer.innerHTML = '';
        currentQ.opts.forEach((opt, idx) => {
            const optContent = state.status === 'reading' ? '...' : opt;
            const btnHTML = `
                <button class="option" id="opt-${idx}" onclick="handleMouseClick(${idx})">
                    <span class="key-hint ${myRole==='A' ? 'hint-a' : 'hint-b'}">${hints[idx]}</span>
                    <span class="opt-text">${optContent}</span>
                </button>`;
            if (myRole === 'A') optionsAContainer.innerHTML += btnHTML;
            if (myRole === 'B') optionsBContainer.innerHTML += btnHTML;
        });
    }
}

function renderFeedback(actionTrigger, state) {
    const { team, isCorrect, answerIndex, correctAnswerIndex, reveal } = actionTrigger;

    let originalQ = "";
    if (state && state.questions && state.questions[state.currentQIndex]) {
        originalQ = `Soal ${state.currentQIndex + 1}/${MAX_QUESTIONS}:\n${state.questions[state.currentQIndex].q}\n\n`;
    }

    if (team !== 'none' && !isMuted) {
        if (isCorrect && sfxCorrect) {
            sfxCorrect.currentTime = 0;
            sfxCorrect.play().catch(e => console.log(e));
        } else if (!isCorrect && sfxWrong) {
            sfxWrong.currentTime = 0;
            sfxWrong.play().catch(e => console.log(e));
        }
    }

    if (team === 'none') {
        // Waktu habis
        questionTextEl.innerText = originalQ + ">>> WAKTU HABIS! Soal Dilewati... <<<";
        if (myRole === 'host') {
            const correctElA = document.getElementById(`opt-host-a-${correctAnswerIndex}`);
            const correctElB = document.getElementById(`opt-host-b-${correctAnswerIndex}`);
            if (correctElA) correctElA.classList.add('correct');
            if (correctElB) correctElB.classList.add('correct');
        } else {
            const correctEl = document.getElementById(`opt-${correctAnswerIndex}`);
            if (correctEl) correctEl.classList.add('correct');
        }
        return;
    }

    // Ada yang menjawab
    if (myRole === 'host') {
        const optEl = document.getElementById(`opt-host-${team.toLowerCase()}-${answerIndex}`);
        if (optEl) {
            optEl.classList.add(team === 'A' ? 'selected-a' : 'selected-b');
            if (isCorrect) optEl.classList.add('correct');
            else {
                optEl.classList.add('wrong');
                if (reveal) {
                    const correctElA = document.getElementById(`opt-host-a-${correctAnswerIndex}`);
                    const correctElB = document.getElementById(`opt-host-b-${correctAnswerIndex}`);
                    if (correctElA) correctElA.classList.add('correct');
                    if (correctElB) correctElB.classList.add('correct');
                }
            }
        }
        flashBg(team === 'A' ? bgA : bgB, isCorrect ? 'flash-green' : 'flash-red');
    } else {
        if (team === myRole) {
            const optEl = document.getElementById('opt-' + answerIndex);
            if (optEl) {
                optEl.classList.add(myRole === 'A' ? 'selected-a' : 'selected-b');
                if (isCorrect) optEl.classList.add('correct');
                else {
                    optEl.classList.add('wrong');
                    if (reveal) {
                        const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                        if (correctEl) correctEl.classList.add('correct');
                    }
                }
            }
            flashBg(myRole === 'A' ? bgA : bgB, isCorrect ? 'flash-green' : 'flash-red');
        } else {
            // Lawan menjawab
            if (isCorrect) {
                questionTextEl.innerText = originalQ + ">>> Lawan Menjawab Benar! <<<";
                isLocked = true;
                const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                if (correctEl) correctEl.classList.add('correct');
                flashBg(team === 'A' ? bgA : bgB, 'flash-green');
            } else {
                questionTextEl.innerText = originalQ + ">>> Lawan Menjawab Salah! Kesempatan Anda! <<<";
                const optEl = document.getElementById('opt-' + answerIndex);
                if (optEl) optEl.classList.add('wrong');
                if (reveal) {
                    const correctEl = document.getElementById('opt-' + correctAnswerIndex);
                    if (correctEl) correctEl.classList.add('correct');
                }
                flashBg(team === 'A' ? bgA : bgB, 'flash-red');
            }
        }
    }
}

function renderGameOver(data) {
    const state = data.state;
    endOverlay.classList.add('active');
    
    const nameA = data.players.A ? data.players.A.name : "Tim Merah";
    const nameB = data.players.B ? data.players.B.name : "Tim Putih";
    
    if (state.correctAnswersA > state.correctAnswersB) {
        endTitle.innerHTML = `Selamat ${nameA} Menang!`; endTitle.className = 'win-a';
    } else if (state.correctAnswersB > state.correctAnswersA) {
        endTitle.innerHTML = `Selamat ${nameB} Menang!`; endTitle.className = 'win-b';
    } else {
        if (state.totalTimeA < state.totalTimeB) {
            endTitle.innerHTML = `Selamat ${nameA} Menang (Tercepat)!`; endTitle.className = 'win-a';
        } else if (state.totalTimeB < state.totalTimeA) {
            endTitle.innerHTML = `Selamat ${nameB} Menang (Tercepat)!`; endTitle.className = 'win-b';
        } else {
            endTitle.innerHTML = "SERI!"; endTitle.className = 'win-draw';
        }
    }

    statNameA.innerText = nameA; statNameB.innerText = nameB;
    statCorrectA.innerText = state.correctAnswersA; statCorrectB.innerText = state.correctAnswersB;
    
    const timeSecA = Math.round(state.totalTimeA / 1000); const timeSecB = Math.round(state.totalTimeB / 1000);
    statTimeA.innerText = `${timeSecA}s`; statTimeB.innerText = `${timeSecB}s`;
    
    statAvgA.innerText = state.correctAnswersA > 0 ? (timeSecA / state.correctAnswersA).toFixed(1) + 's' : '0s';
    statAvgB.innerText = state.correctAnswersB > 0 ? (timeSecB / state.correctAnswersB).toFixed(1) + 's' : '0s';
    
    postGameStats.style.display = 'flex';

    // Host pushes to history
    if (myRole === 'host') {
        let winnerName = 'SERI';
        if (state.correctAnswersA > state.correctAnswersB) winnerName = nameA;
        else if (state.correctAnswersB > state.correctAnswersA) winnerName = nameB;
        else {
            if (state.totalTimeA < state.totalTimeB) winnerName = nameA;
            else if (state.totalTimeB < state.totalTimeA) winnerName = nameB;
        }

        const matchRecord = {
            timestamp: Date.now(),
            roomCode: myRoom,
            teamA: nameA,
            teamB: nameB,
            scoreA: state.scoreA,
            scoreB: state.scoreB,
            winner: winnerName
        };

        // Hindari push berulang jika renderGameOver dipanggil lebih dari sekali
        if (!window.hasPushedHistory) {
            window.hasPushedHistory = true;
            push(ref(db, 'history'), matchRecord);
        }
    }
}

function flashBg(element, className) {
    if(!element) return;
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), 600);
}
