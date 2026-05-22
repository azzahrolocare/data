// GANTI dengan URL Web App milik Apps Script Anda yang baru!
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuD6ubfsn8zTaEkyiejKnoHK9ucTSqbCWh-bYhM1ZZgsF9vIH2VWDXFYZoAx-51WfXmw/exec";

let databaseJadwal = null;
let audioIzinAktif = false;
let waktuTerakhirBerbunyi = ""; 

// Mapping dicocokkan eksak dengan nama sheet baru Anda
const mapHari = {
    1: "SENIN-KAMIS", 2: "SENIN-KAMIS", 3: "SENIN-KAMIS", 4: "SENIN-KAMIS",
    5: "JUM'AT-SABTU", 6: "JUM'AT-SABTU", 0: "AHAD"
};

const formatHariText = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const formatBulanText = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// 1. Ambil Data dari API Google Sheets
async function muatJadwalDariSheets() {
    try {
        const respon = await fetch(SCRIPT_URL);
        databaseJadwal = await respon.json();
        localStorage.setItem("cache_jadwal_bel", JSON.stringify(databaseJadwal));
        renderTabelJadwal();
    } catch (error) {
        console.error("Menggunakan data cache lokal:", error);
        const cache = localStorage.getItem("cache_jadwal_bel");
        if (cache) {
            databaseJadwal = JSON.parse(cache);
            renderTabelJadwal();
        }
    }
}

// 2. Tampilkan Jadwal ke Tabel Monitor
function renderTabelJadwal() {
    if (!databaseJadwal) return;
    
    const hariIndex = new Date().getDay();
    const namaKategoriHari = mapHari[hariIndex];
    document.getElementById("LabelTabelHari").innerText = namaKategoriHari;
    
    const tbody = document.getElementById("tabelJadwalBody");
    tbody.innerHTML = "";
    
    if (namaKategoriHari === "AHAD" || !databaseJadwal[namaKategoriHari]) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-emerald-600 font-bold">Hari Libur Sekolah (Ahad). Tidak Ada Bel.</td></tr>`;
        return;
    }
    
    const listJadwalHariIni = databaseJadwal[namaKategoriHari];
    listJadwalHariIni.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-gray-50 transition-colors";
        tr.innerHTML = `
            <td class="p-4 text-center font-mono font-medium text-gray-400">${row.no}</td>
            <td class="p-4 font-mono font-bold text-indigo-900 text-base">${row.jam}</td>
            <td class="p-4 font-semibold text-gray-700">${row.keterangan}</td>
        `;
        tbody.appendChild(tr);
    });
}

// 3. Mesin Detektor Suara Google Indonesia
function ucapkanPengumumanTTS(keterangan) {
    if (!audioIzinAktif) return;
    
    let kalimat = `Perhatian, saatnya ${keterangan.toLowerCase()} dimulai.`;
    
    const ketUpper = keterangan.toUpperCase();
    if (ketUpper.includes("APEL")) {
        kalimat = "Perhatian seluruh siswa, pelaksanaan apel pagi akan segera dimulai. Mohon menuju ke lapangan.";
    } else if (ketUpper.includes("JAM PERTAMA")) {
        kalimat = "Perhatian, saatnya jam pertama dimulai. Kepada bapak dan ibu guru selamat mengajar.";
    } else if (ketUpper.includes("JAM KEDUA")) {
        kalimat = "Perhatian, saatnya jam kedua dimulai.";
    } else if (ketUpper.includes("JAM KETIGA")) {
        kalimat = "Perhatian, saatnya jam ketiga dimulai.";
    } else if (ketUpper.includes("ISTIRAHAT")) {
        kalimat = "Perhatian, saatnya istirahat dimulai. Selamat menikmati waktu istirahat.";
    } else if (ketUpper.includes("SHOLAT") || ketUpper.includes("DZUHA") || ketUpper.includes("DZUHUR")) {
        kalimat = `Perhatian, saatnya melaksanakan ibadah ${keterangan.toLowerCase()} secara berjamaah.`;
    }

    const mesinSuara = new SpeechSynthesisUtterance(kalimat);
    mesinSuara.lang = "id-ID"; 
    mesinSuara.rate = 0.85; // Kecepatan pelafalan suara ideal untuk lingkungan sekolah
    mesinSuara.pitch = 1.0;

    window.speechSynthesis.speak(mesinSuara);
    document.getElementById("logSuara").innerText = `[${new Date().toLocaleTimeString()}] "${keterangan}"`;
}

// 4. Sinkronisasi Detik Jam
function jalankanMesinWaktu() {
    setInterval(() => {
        const sekarang = new Date();
        const jamStr = String(sekarang.getHours()).padStart(2, '0');
        const menitStr = String(sekarang.getMinutes()).padStart(2, '0');
        const detikStr = String(sekarang.getSeconds()).padStart(2, '0');
        
        const waktuSekarangMurni = `${jamStr}:${menitStr}`;
        
        document.getElementById("liveClock").innerText = `${jamStr}:${menitStr}:${detikStr}`;
        
        // Eksekusi bel tepat pada detik '00'
        if (detikStr === "00" && waktuTerakhirBerbunyi !== waktuSekarangMurni) {
            periksaJadwalBel(waktuSekarangMurni, sekarang.getDay());
        }
    }, 1000);
}

// 5. Cocokkan Waktu Real-Time Langsung dengan Kolom JAM Baru
function periksaJadwalBel(waktuSekarang, hariIndex) {
    const namaKategoriHari = mapHari[hariIndex];
    if (!databaseJadwal || !databaseJadwal[namaKategoriHari]) return;

    const listJadwal = databaseJadwal[namaKategoriHari];
    listJadwal.forEach(row => {
        // Data 'row.jam' sudah bersih berupa format string dua digit "HH:MM" berkat Apps Script yang baru
        if (row.jam === waktuSekarang) {
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

// 6. Tombol Aktivasi Otoritas Suara Browser
document.getElementById("btnAktivasi").addEventListener("click", () => {
    audioIzinAktif = true;
    
    const btn = document.getElementById("btnAktivasi");
    btn.className = "w-full bg-slate-400 text-white font-bold py-3 px-6 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 shadow-none";
    btn.disabled = true;
    btn.innerText = "✓ Sistem Bel Suara Aktif & Memonitor";
    
    const status = document.getElementById("statusAudio");
    status.className = "text-xs text-emerald-600 font-bold mt-2 text-center";
    status.innerText = "✓ Hak akses suara disetujui. Sistem memonitor waktu di latar belakang.";

    const pancingan = new SpeechSynthesisUtterance("Sistem bel otomatis sekolah Lembaga Az-Zahro siap dijalankan.");
    pancingan.lang = "id-ID";
    window.speechSynthesis.speak(pancingan);
});

window.addEventListener("DOMContentLoaded", () => {
    updateInformasiTanggal();
    muatJadwalDariSheets();
    jalankanMesinWaktu();
});
