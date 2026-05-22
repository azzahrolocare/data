// GANTI teks di bawah ini dengan URL Web App milik Apps Script Anda!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjgZnntAU_mLTTSRn6KJW23yDKBXG4-gImoH3iIr9dEuAQXJAIPS0sGYNDnFivxxhbEg/exec";

let databaseJadwal = null;
let audioIzinAktif = false;
let waktuTerakhirBerbunyi = ""; // Proteksi agar suara tidak berulang-ulang di menit yang sama

const mapHari = {
    1: "SENIN - KAMIS", 2: "SENIN - KAMIS", 3: "SENIN - KAMIS", 4: "SENIN - KAMIS",
    5: "JUM'AT - SABTU", 6: "JUM'AT - SABTU", 0: "AHAD"
};

const formatHariText = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const formatBulanText = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// 1. Ambil Data dari Jembatan API Google Sheets
async function muatJadwalDariSheets() {
    try {
        const respon = await fetch(SCRIPT_URL);
        databaseJadwal = await respon.json();
        localStorage.setItem("cache_jadwal_bel", JSON.stringify(databaseJadwal));
        renderTabelJadwal();
    } catch (error) {
        console.error("Gagal sinkronisasi online, menggunakan cache lokal:", error);
        const cache = localStorage.getItem("cache_jadwal_bel");
        if (cache) {
            databaseJadwal = JSON.parse(cache);
            renderTabelJadwal();
        }
    }
}

// 2. Tampilkan Jadwal ke Tabel Berdasarkan Kategori Hari
function renderTabelJadwal() {
    if (!databaseJadwal) return;
    
    const hariIndex = new Date().getDay();
    const namaKategoriHari = mapHari[hariIndex];
    document.getElementById("LabelTabelHari").innerText = namaKategoriHari;
    
    const tbody = document.getElementById("tabelJadwalBody");
    tbody.innerHTML = "";
    
    if (namaKategoriHari === "AHAD" || !databaseJadwal[namaKategoriHari]) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-emerald-600 font-bold">Hari Libur Akhir Pekan. Tidak Ada KBM.</td></tr>`;
        return;
    }
    
    const listJadwalHariIni = databaseJadwal[namaKategoriHari];
    listJadwalHariIni.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 transition-colors";
        tr.innerHTML = `
            <td class="p-4 text-center font-mono font-medium text-gray-400">${row.no}</td>
            <td class="p-4 font-mono font-bold text-indigo-900">${row.jam}</td>
            <td class="p-4 font-semibold text-gray-700">${row.keterangan}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Mesin Utama Pembuat Suara Google (Text-to-Speech)
function ucapkanPengumumanTTS(keterangan) {
    if (!audioIzinAktif) return;
    
    // Kalimat standar default
    let kalimat = `Perhatian, saatnya ${keterangan.toLowerCase()} dimulai.`;
    
    // Kustomisasi kalimat otomatis berdasarkan isi teks keterangan di Google Sheets
    const ketUpper = keterangan.toUpperCase();
    if (ketUpper.includes("APEL")) {
        kalimat = "Perhatian seluruh siswa, saatnya pelaksanaan apel pagi dimulai. Mohon segera menuju lapangan.";
    } else if (ketUpper.includes("JAM PERTAMA")) {
        kalimat = "Perhatian, saatnya jam pertama dimulai. Kepada bapak dan ibu guru silakan memasuki kelas.";
    } else if (ketUpper.includes("ISTIRAHAT")) {
        kalimat = "Perhatian, saatnya istirahat dimulai. Selamat menikmati waktu istirahat Anda.";
    } else if (ketUpper.includes("SHOLAT") || ketUpper.includes("DZUHA") || ketUpper.includes("DZUHUR")) {
        kalimat = `Perhatian, saatnya melaksanakan ibadah ${keterangan.toLowerCase()} secara berjamaah.`;
    }

    const mesinSuara = new SpeechSynthesisUtterance(kalimat);
    mesinSuara.lang = "id-ID";  // Mengunci suara Google Bahasa Indonesia resmi
    mesinSuara.rate = 0.85;     // Sedikit diperlambat agar artikulasi pengeras suara sekolah jelas
    mesinSuara.pitch = 1.0;

    window.speechSynthesis.speak(mesinSuara);
    document.getElementById("logSuara").innerText = `[${new Date().toLocaleTimeString()}] "${keterangan}"`;
}

// 4. Detak Jam Detik demi Detik & Pemicu Interval Mandiri Latar Belakang
function jalankanMesinWaktu() {
    setInterval(() => {
        const sekarang = new Date();
        const jamStr = String(sekarang.getHours()).padStart(2, '0');
        const menitStr = String(sekarang.getMinutes()).padStart(2, '0');
        const detikStr = String(sekarang.getSeconds()).padStart(2, '0');
        
        const waktuSekarangMurni = `${jamStr}:${menitStr}`;
        
        document.getElementById("liveClock").innerText = `${jamStr}:${menitStr}:${detikStr}`;
        
        // Pengecekan dijalankan tepat pada detik ke '00' di setiap menit
        if (detikStr === "00" && waktuTerakhirBerbunyi !== waktuSekarangMurni) {
            periksaJadwalBel(waktuSekarangMurni, sekarang.getDay());
        }
    }, 1000);
}

// 5. Pencocokan Waktu Jam Mulai dengan Isi Tabel
function periksaJadwalBel(waktuSekarang, hariIndex) {
    const namaKategoriHari = mapHari[hariIndex];
    if (!databaseJadwal || !databaseJadwal[namaKategoriHari]) return;

    const listJadwal = databaseJadwal[namaKategoriHari];
    listJadwal.forEach(row => {
        // Mengambil jam awal saja, misal dari teks "07:30 - 08:30" diekstrak menjadi "07:30"
        const waktuMulaiMurni = row.jam.split("-")[0].trim();
        
        if (waktuMulaiMurni === waktuSekarang) {
            waktuTerakhirBerbunyi = waktuSekarang;
            ucapkanPengumumanTTS(row.keterangan);
        }
    });
}

function updateInformasiTanggal() {
    const d = new Date();
    const textTanggal = `${formatHariText[d.getDay()]}, ${d.getDate()} ${formatBulanText[d.getMonth()]} ${d.getFullYear()}`;
    document.getElementById("liveDate").innerText = textTanggal;
}

// 6. Penanganan Bypass Proteksi Autoplay Browser Modern
document.getElementById("btnAktivasi").addEventListener("click", () => {
    audioIzinAktif = true;
    
    const btn = document.getElementById("btnAktivasi");
    btn.className = "w-full bg-slate-400 text-white font-bold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 shadow-none";
    btn.disabled = true;
    btn.innerText = "✓ Sistem Bel Suara Aktif & Memonitor";
    
    const status = document.getElementById("statusAudio");
    status.className = "text-xs text-emerald-600 font-bold mt-2 text-center";
    status.innerText = "✓ Otoritas audio berhasil didapatkan. Bel memonitor waktu di latar belakang.";

    // Suara sambutan pertama untuk memancing otentikasi suara browser
    const pancingan = new SpeechSynthesisUtterance("Sistem bel otomatis sekolah Lembaga Az-Zahro berhasil diaktifkan.");
    pancingan.lang = "id-ID";
    window.speechSynthesis.speak(pancingan);
});

window.addEventListener("DOMContentLoaded", () => {
    updateInformasiTanggal();
    muatJadwalDariSheets();
    jalankanMesinWaktu();
});
