// ====================================================================
// CONFIGURATION / CONFIG DATABASE & AUDIO URL
// ====================================================================
// URL Web App milik Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyuD6ubfsn8zTaEkyiejKnoHK9ucTSqbCWh-bYhM1ZZgsF9vIH2VWDXFYZoAx-51WfXmw/exec";

// URL File Nada Bel Sekolah Jerman (Chime)
const URL_NADA_BEL = "https://azzahrolocare.github.io/data/jadwal/schoolbell-from-german-high-school.mp3";

// Password Pengunci Akses Fitur Admin Pop-up
const PASSWORD_ADMIN = "admin";

let databaseJadwal = null;
let audioIzinAktif = false;
let waktuTerakhirBerbunyi = ""; 
let daftarSuaraBrowser = [];

// Mapping hari dicocokkan eksak dengan nama sheet pada Google Sheets Anda
const mapHari = {
    1: "SENIN-KAMIS", 
    2: "SENIN-KAMIS", 
    3: "SENIN-KAMIS", 
    4: "SENIN-KAMIS",
    5: "JUM'AT-SABTU", 
    6: "JUM'AT-SABTU", 
    0: "AHAD"
};

const formatHariText = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const formatBulanText = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// ====================================================================
// 1. DATA SYNCHRONIZATION (GOOGLE SHEETS API)
// ====================================================================
async function muatJadwalDariSheets() {
    try {
        const respon = await fetch(SCRIPT_URL);
        databaseJadwal = await respon.json();
        // Simpan ke cache lokal agar aplikasi tetap berfungsi saat offline
        localStorage.setItem("cache_jadwal_bel", JSON.stringify(databaseJadwal));
        renderTabelJadwal();
    } catch (error) {
        console.error("Gagal sinkronisasi data online, menggunakan cache lokal:", error);
        const cache = localStorage.getItem("cache_jadwal_bel");
        if (cache) {
            databaseJadwal = JSON.parse(cache);
            renderTabelJadwal();
        }
    }
}

// ====================================================================
// 2. USER INTERFACE MONITORING TABLE RENDER
// ====================================================================
function renderTabelJadwal() {
    if (!databaseJadwal) return;
    
    const hariIndex = new Date().getDay();
    const namaKategoriHari = mapHari[hariIndex];
    document.getElementById("LabelTabelHari").innerText = namaKategoriHari;
    
    const tbody = document.getElementById("tabelJadwalBody");
    tbody.innerHTML = "";
    
    // Jika hari Ahad (0) atau lembar kerja tidak ditemukan
    if (namaKategoriHari === "AHAD" || !databaseJadwal[namaKategoriHari]) {
        tbody.innerHTML = `<tr><td colspan="3" class="p-6 text-center text-emerald-600 font-bold">Hari Libur Sekolah (Ahad). Tidak Ada Bel Otomatis.</td></tr>`;
        return;
    }
    
    const listJadwalHariIni = databaseJadwal[namaKategoriHari];
    listJadwalHariIni.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-white/40 transition-colors";
        tr.innerHTML = `
            <td class="p-4 text-center font-mono font-medium text-gray-400">${row.no}</td>
            <td class="p-4 font-mono font-bold text-indigo-950 text-base">${row.jam}</td>
            <td class="p-4 font-semibold text-gray-700">${row.keterangan}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ====================================================================
// MEMUAT KARAKTER SUARA GENDER (LAKI/PEREMPUAN)
// ====================================================================
function inisialisasiPilihanSuara() {
    if (typeof speechSynthesis === 'undefined') return;

    daftarSuaraBrowser = speechSynthesis.getVoices();
    const selectElement = document.getElementById("selectVoice");
    if (!selectElement) return;
    selectElement.innerHTML = "";

    // Saring suara yang hanya mengandung modul Bahasa Indonesia atau Google bawaan
    let suaraTersedia = daftarSuaraBrowser.filter(voice => voice.lang.includes("id") || voice.lang.includes("ID"));

    // Jika tidak ditemukan instalan bahasa Indonesia, gunakan seluruh daftar suara standar browser
    if (suaraTersedia.length === 0) {
        suaraTersedia = daftarSuaraBrowser;
    }

    suaraTersedia.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        
        // Penanda label manual visual gender agar mempermudah admin sekolah
        let genderLabel = "(Suara Standar)";
        const nameUpper = voice.name.toUpperCase();
        if (nameUpper.includes("DAVID") || nameUpper.includes("ARDI") || nameUpper.includes("MALE") || nameUpper.includes("ANDIKA")) {
            genderLabel = "♂ Laki-Laki";
        } else if (nameUpper.includes("ZIRA") || nameUpper.includes("GADIS") || nameUpper.includes("FEMALE") || nameUpper.includes("PUTRI") || nameUpper.includes("GOOGLE")) {
            genderLabel = "♀ Perempuan";
        }

        option.innerText = `${voice.name} ${genderLabel}`;
        selectElement.appendChild(option);
    });
}

// Eksekusi trigger pemuatan suara karena beberapa browser memuatnya secara asinkronus
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = inisialisasiPilihanSuara;
}

// ====================================================================
// 3. ENGINE UTAMA: SIKLUS BERGANTIAN (NADA -> SUARA GOOGLE DENGAN UI DINAMIS)
// ====================================================================
function ucapkanPengumumanTTS(keterangan) {
    if (!audioIzinAktif) return;
    
    // Penyusunan teks kalimat pengumuman otomatis
    let kalimat = `Perhatian, saatnya ${keterangan.toLowerCase()} dimulai.`;
    const ketUpper = keterangan.toUpperCase();
    
    if (ketUpper.includes("APEL")) {
        kalimat = "Perhatian seluruh siswa, pelaksanaan apel pagi akan segera dimulai. Mohon segera menuju ke lapangan.";
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

    let putaranKe = 1;
    const totalPutaran = 3;

    // Ambil konfigurasi bentuk suara dinamis dari nilai Input Panel UI Modal
    const speedTerpilih = parseFloat(document.getElementById("inputSpeed").value);
    const pitchTerpilih = parseFloat(document.getElementById("inputPitch").value);
    const namaSuaraTerpilih = document.getElementById("selectVoice").value;

    // Fungsi internal rekursif pengatur antrean antarsuara agar bergantian rapi
    function jalankanSiklus() {
        if (putaranKe > totalPutaran) return; // Siklus selesai jika sudah 3 kali

        // A. Buat objek audio baru untuk dering bel
        const audioBel = new Audio(URL_NADA_BEL);
        
        // B. Ketika nada bel selesai berbunyi, picu Text-to-Speech Google
        audioBel.addEventListener('ended', function() {
            const mesinSuara = new SpeechSynthesisUtterance(kalimat);
            
            // Pasang karakter suara pilihan admin dari panel UI
            if (daftarSuaraBrowser.length > 0) {
                const objekSuara = daftarSuaraBrowser.find(voice => voice.name === namaSuaraTerpilih);
                if (objekSuara) {
                    mesinSuara.voice = objekSuara;
                }
            }
            
            mesinSuara.lang = "id-ID"; 
            mesinSuara.rate = speedTerpilih;   // Konfigurasi kecepatan dinamis
            mesinSuara.pitch = pitchTerpilih;  // Konfigurasi bentuk nada dinamis

            // C. Ketika suara Google selesai berbicara, picu putaran siklus berikutnya
            mesinSuara.addEventListener('end', function() {
                putaranKe++;
                setTimeout(jalankanSiklus, 1000); // Jeda istirahat 1 detik sebelum dering berikutnya
            });

            window.speechSynthesis.speak(mesinSuara);
        });

        // Eksekusi pemutaran musik bel pembuka
        audioBel.play().catch(err => console.error("Gagal memutar berkas MP3: ", err));
    }

    // Jalankan siklus pertama dari antrean
    jalankanSiklus();
    
    // Perbarui teks monitor aktivitas di halaman HTML
    document.getElementById("logSuara").innerText = `[${new Date().toLocaleTimeString()}] "${keterangan}" (Pola Siklus Bergantian 3x)`;
}

// ====================================================================
// 4. CLOCK TICKER & BACKGROUND PROCESS INTERVAL
// ====================================================================
function jalankanMesinWaktu() {
    setInterval(() => {
        const sekarang = new Date();
        const jamStr = String(sekarang.getHours()).padStart(2, '0');
        const menitStr = String(sekarang.getMinutes()).padStart(2, '0');
        const detikStr = String(sekarang.getSeconds()).padStart(2, '0');
        
        const waktuSekarangMurni = `${jamStr}:${menitStr}`;
        
        // Update tampilan jam digital real-time ke UI HTML
        document.getElementById("liveClock").innerText = `${jamStr}:${menitStr}:${detikStr}`;
        
        // Validasi eksekusi: hanya dipicu tepat pada detik ke '00' di setiap menit
        if (detikStr === "00" && waktuTerakhirBerbunyi !== waktuSekarangMurni) {
            periksaJadwalBel(waktuSekarangMurni, sekarang.getDay());
        }
    }, 1000);
}

// ====================================================================
// 5. TIMETABLE TIME MATCHING LOGIC
// ====================================================================
function periksaJadwalBel(waktuSekarang, hariIndex) {
    const namaKategoriHari = mapHari[hariIndex];
    if (!databaseJadwal || !databaseJadwal[namaKategoriHari]) return;

    const listJadwal = databaseJadwal[namaKategoriHari];
    listJadwal.forEach(row => {
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

// ====================================================================
// 6. UI EVENT LISTENERS CONTROL INTERACTION & MODAL LOGIC
// ====================================================================
const modalAdmin = document.getElementById("modalAdmin");

// Fungsi Membuka Modal (Pop-up) dengan Animasi Smooth
function bukaModalAdmin() {
    modalAdmin.classList.remove("hidden");
    setTimeout(() => {
        modalAdmin.classList.remove("opacity-0");
        modalAdmin.querySelector(".transform").classList.remove("scale-95");
    }, 50);
}

// Fungsi Menutup Modal (Pop-up)
function tutupModalAdmin() {
    modalAdmin.classList.add("opacity-0");
    modalAdmin.querySelector(".transform").classList.add("scale-95");
    setTimeout(() => {
        modalAdmin.classList.add("hidden");
    }, 300);
}

// Logika Tombol Login Admin via Icon Gear
document.getElementById("btnBukaAdmin").addEventListener("click", () => {
    const inputPass = prompt("Masukkan Kata Sandi Otoritas Admin Bel Az-Zahro:");
    if (inputPass === PASSWORD_ADMIN) {
        bukaModalAdmin();
    } else if (inputPass !== null) {
        alert("❌ Kata sandi salah! Akses kontrol panel ditolak.");
    }
});

// Tombol Tutup Pop-up Modal
document.getElementById("btnTutupAdmin").addEventListener("click", tutupModalAdmin);

// Tutup modal otomatis jika pengguna mengklik area luar jendela frosted glass
window.addEventListener("click", (e) => {
    if (e.target === modalAdmin) {
        tutupModalAdmin();
    }
});

// Real-time monitor nilai angka slider panel kontrol
document.getElementById("inputSpeed").addEventListener("input", (e) => {
    document.getElementById("valSpeed").innerText = e.target.value;
});

document.getElementById("inputPitch").addEventListener("input", (e) => {
    document.getElementById("valPitch").innerText = e.target.value;
});

// Fungsi uji coba simulasi instan
document.getElementById("btnTestBel").addEventListener("click", () => {
    if (!audioIzinAktif) {
        alert("Mohon klik tombol 'Aktifkan Audio Bel Suara' terlebih dahulu agar sistem diizinkan bersuara!");
        return;
    }
    ucapkanPengumumanTTS("SIMULASI UJI COBA");
});

// Tombol Aktivasi Otoritas Suara Browser
document.getElementById("btnAktivasi").addEventListener("click", () => {
    audioIzinAktif = true;
    
    const btn = document.getElementById("btnAktivasi");
    btn.className = "w-full bg-slate-400/50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 shadow-none border border-slate-300/30";
    btn.disabled = true;
    btn.innerText = "✓ Sistem Bel Suara Aktif & Memonitor";
    
    const status = document.getElementById("statusAudio");
    status.className = "text-xs text-emerald-700 font-bold mt-2 text-center";
    status.innerText = "✓ Otoritas audio berhasil didapatkan. Bel memonitor waktu di latar belakang.";

    // Nada pancingan awal pengesahan audio browser
    const pancinganAudio = new Audio(URL_NADA_BEL);
    pancinganAudio.play().then(() => {
        setTimeout(() => {
            const pancinganTTS = new SpeechSynthesisUtterance("Sistem bel otomatis sekolah Lembaga Az-Zahro siap dijalankan.");
            pancinganTTS.lang = "id-ID";
            window.speechSynthesis.speak(pancinganTTS);
        }, 2200);
    }).catch(err => console.log("Otoritas suara aktif: ", err));
});

// ====================================================================
// INITIALIZATION ON LOAD
// ====================================================================
window.addEventListener("DOMContentLoaded", () => {
    updateInformasiTanggal();
    muatJadwalDariSheets();
    jalankanMesinWaktu();
    setTimeout(inisialisasiPilihanSuara, 800);
});
