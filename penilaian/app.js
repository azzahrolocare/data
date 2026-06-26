const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxPlWvYdVg7gYKh5UnMHrSIf-pJqfS1hyPRdsExVws7BIKbZqp4JXe2pv4_u5dxFb3Olw/exec";

const DAFTAR_TEMA = {
    "biru-ungu": {
        bodyBg: "linear-gradient(135deg, #0b0f19, #1e1b4b, #111827)", 
        bodySolidBg: "#0b0f19",
        glow1: "#3b82f6", glow2: "#7c3aed", 
        btnPrimaryBg: "linear-gradient(90deg, #4f46e5, #7c3aed)",
        btnPrimaryHover: "linear-gradient(90deg, #6366f1, #8b5cf6)", btnShadow: "rgba(124, 58, 237, 0.4)",
        accentIcon: "#818cf8", glassBg: "rgba(255, 255, 255, 0.05)", glassBorder: "rgba(255, 255, 255, 0.12)",
        scrollbarThumb: "rgba(129, 140, 248, 0.3)", themeColor: "#1e1b4b", navDockBg: "rgba(11, 15, 25, 0.9)",
        iconCirclePasif: "rgba(255, 255, 255, 0.08)", iconCircleAktif: "#ffffff", iconTextAktif: "#1e1b4b"
    },
    "emerald": {
        bodyBg: "linear-gradient(135deg, #061f14, #0b3a24, #05140e)", 
        bodySolidBg: "#061f14",
        glow1: "#10b981", glow2: "#f59e0b", 
        btnPrimaryBg: "linear-gradient(90deg, #059669, #10b981)",
        btnPrimaryHover: "linear-gradient(90deg, #10b981, #34d399)", btnShadow: "rgba(16, 185, 129, 0.3)",
        accentIcon: "#f59e0b", glassBg: "rgba(255, 255, 255, 0.04)", glassBorder: "rgba(255, 255, 255, 0.12)",
        scrollbarThumb: "rgba(16, 185, 129, 0.25)", themeColor: "#0b3a24", navDockBg: "rgba(6, 31, 20, 0.93)",
        iconCirclePasif: "rgba(255, 255, 255, 0.08)", iconCircleAktif: "#ffffff", iconTextAktif: "#0b3a24"
    },
    "electric-blue": {
        bodyBg: "linear-gradient(135deg, #a2d2ff, #c7d2fe, #e0e7ff)", 
        bodySolidBg: "#a2d2ff",
        glow1: "#3b82f6", glow2: "#a855f7", 
        btnPrimaryBg: "linear-gradient(90deg, #3b82f6, #6366f1)",
        btnPrimaryHover: "linear-gradient(90deg, #2563eb, #4f46e5)", btnShadow: "rgba(59, 130, 246, 0.3)",
        accentIcon: "#3b82f6", glassBg: "rgba(255, 255, 255, 0.45)", glassBorder: "rgba(255, 255, 255, 0.6)",
        scrollbarThumb: "#3b82f6", themeColor: "#3b82f6", navDockBg: "rgba(219, 234, 254, 0.95)",
        iconCirclePasif: "rgba(0, 0, 0, 0.08)", iconCircleAktif: "#3b82f6", iconTextAktif: "#ffffff"
    },
    "sunset-orange": {
        bodyBg: "linear-gradient(135deg, #1e0b01, #4c1d05, #140500)", 
        bodySolidBg: "#1e0b01",
        glow1: "#f97316", glow2: "#f59e0b", 
        btnPrimaryBg: "linear-gradient(90deg, #ea580c, #f97316)",
        btnPrimaryHover: "linear-gradient(90deg, #f97316, #fb923c)", btnShadow: "rgba(249, 115, 22, 0.3)",
        accentIcon: "#f97316", glassBg: "rgba(255, 255, 255, 0.03)", glassBorder: "rgba(255, 255, 255, 0.1|)",
        scrollbarThumb: "rgba(249, 115, 22, 0.25)", themeColor: "#4c1d05", navDockBg: "rgba(30, 11, 1, 0.93)",
        iconCirclePasif: "rgba(255, 255, 255, 0.08)", iconCircleAktif: "#ffffff", iconTextAktif: "#4c1d05"
    },
    "pastel-cotton": {
        bodyBg: "linear-gradient(135deg, #e0f2fe, #fce7f3, #f0fdf4)", 
        bodySolidBg: "#e0f2fe",
        glow1: "#38bdf8", glow2: "#f472b6", 
        btnPrimaryBg: "linear-gradient(90deg, #0ea5e9, #ec4899)",
        btnPrimaryHover: "linear-gradient(90deg, #0284c7, #db2777)", btnShadow: "rgba(14, 165, 233, 0.25)",
        accentIcon: "#db2777", glassBg: "rgba(255, 255, 255, 0.5)", glassBorder: "rgba(255, 255, 255, 0.65)",
        scrollbarThumb: "#0ea5e9", themeColor: "#0ea5e9", navDockBg: "rgba(240, 249, 255, 0.95)",
        iconCirclePasif: "rgba(0, 0, 0, 0.08)", iconCircleAktif: "#0ea5e9", iconTextAktif: "#ffffff"
    }
};

let DATA_CACHED = { pengaturan: {}, siswa: [] };
let GURU_AKTIF = ""; let KELAS_AKTIF = ""; let MAPEL_AKTIF = "";
let LIST_HAK_MENGAJAR = []; let toastTimeout;

function pilihSistemTema(namaTema) {
    const konfigurasi = DAFTAR_TEMA[namaTema];
    if (!konfigurasi) return;

    const root = document.documentElement;
    root.style.setProperty('--body-bg', konfigurasi.bodyBg);
    root.style.setProperty('--body-solid-bg', konfigurasi.bodySolidBg);
    root.style.setProperty('--glow-1', konfigurasi.glow1);
    root.style.setProperty('--glow-2', konfigurasi.glow2);
    root.style.setProperty('--btn-primary-bg', konfigurasi.btnPrimaryBg);
    root.style.setProperty('--btn-primary-hover', konfigurasi.btnPrimaryHover);
    root.style.setProperty('--btn-shadow', konfigurasi.btnShadow);
    root.style.setProperty('--accent-icon', konfigurasi.accentIcon);
    root.style.setProperty('--glass-bg', konfigurasi.glassBg);
    root.style.setProperty('--glass-border', konfigurasi.glassBorder);
    root.style.setProperty('--scrollbar-thumb', konfigurasi.scrollbarThumb);
    root.style.setProperty('--nav-dock-bg', konfigurasi.navDockBg);
    root.style.setProperty('--icon-circle-pasif', konfigurasi.iconCirclePasif);
    root.style.setProperty('--icon-circle-aktif', konfigurasi.iconCircleAktif);
    root.style.setProperty('--icon-text-aktif', konfigurasi.iconTextAktif);

    if (namaTema === "electric-blue" || namaTema === "pastel-cotton") {
        root.style.setProperty('--text-main', '#0f172a'); root.style.setProperty('--text-muted', '#334155');
        root.style.setProperty('--card-text', '#1e293b'); root.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.6)');
        root.style.setProperty('--input-text', '#0f172a'); root.style.setProperty('--input-border', 'rgba(0, 0, 0, 0.12)');
        root.style.setProperty('--input-focus-bg', 'rgba(255, 255, 255, 0.85)');
    } else {
        root.style.setProperty('--text-main', '#ffffff'); root.style.setProperty('--text-muted', '#d1e7dd');
        root.style.setProperty('--card-text', '#ffffff'); root.style.setProperty('--input-bg', 'rgba(255, 255, 255, 0.1)');
        root.style.setProperty('--input-text', '#ffffff'); root.style.setProperty('--input-border', 'rgba(255, 255, 255, 0.2)');
        root.style.setProperty('--input-focus-bg', 'rgba(255, 255, 255, 0.2)');
    }

    const metaTag = document.getElementById('metaThemeColor');
    if (metaTag) metaTag.setAttribute('content', konfigurasi.themeColor);
    localStorage.setItem('smartgrader_theme', namaTema);
}

function navKlikAksi(element, tipe) {
    const isAlreadyClicked = element.getAttribute('data-clicked') === 'true';
    if (!isAlreadyClicked) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active'); item.setAttribute('data-clicked', 'false');
        });
        element.classList.add('active'); element.setAttribute('data-clicked', 'true');
    } else {
        if (tipe === 'tema') bukaModalTemaCepat();
        else if (tipe === 'leger') setTimeout(() => { window.open("leger.html", "_blank"); }, 350);
        else if (tipe === 'materi') bukaModalPengaturan();
        else if (tipe === 'akun') bukaModalAkunCepat();
        resetNavActiveState();
    }
}

function resetNavActiveState() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active'); item.setAttribute('data-clicked', 'false');
    });
}

function kunciScrollLatar(apakahKunci) {
    if (apakahKunci) document.body.classList.add('overflow-hidden-modal');
    else {
        const modals = ['modalAwal', 'modalPengaturan', 'modalGantiPassword', 'modalKonfirmasiKeluar', 'modalKonfirmasiKembali', 'modalGagalMasuk', 'modalPilihTemaCepat', 'modalMenuAkunCepat'];
        const openModal = modals.some(id => !document.getElementById(id).classList.contains('hidden'));
        if (!openModal) document.body.classList.remove('overflow-hidden-modal');
    }
}

function bukaModalTemaCepat() { document.getElementById('modalPilihTemaCepat').classList.remove('hidden'); kunciScrollLatar(true); }
function tutupModalTemaCepat() { document.getElementById('modalPilihTemaCepat').classList.add('hidden'); kunciScrollLatar(false); resetNavActiveState(); }
function bukaModalAkunCepat() {
    if (!GURU_AKTIF) { tampilkanModalGagalMasuk("Akses Ditolak", "Silakan login akun guru terlebih dahulu!"); resetNavActiveState(); return; }
    document.getElementById('modalAkunTitle').innerText = GURU_AKTIF;
    document.getElementById('modalMenuAkunCepat').classList.remove('hidden'); kunciScrollLatar(true);
}
function tutupModalAkunCepat() { document.getElementById('modalMenuAkunCepat').classList.add('hidden'); kunciScrollLatar(false); resetNavActiveState(); }
function bukaAplikasiLayarPenuh() {
    kunciScrollLatar(!document.getElementById('modalAwal').classList.contains('hidden'));
    const docElm = document.documentElement;
    if (docElm.requestFullscreen) docElm.requestFullscreen();
    if (window.history.state !== "fullscreen-mode") window.history.pushState("fullscreen-mode", null, "#fullscreen");
}

function showToast(title, message, type = "success") {
    const toast = document.getElementById('customToast');
    const toastBorder = document.getElementById('toastBorder');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = message;
    toastBorder.className = `glass-panel rounded-2xl p-4 flex items-start gap-3 border-l-4 ${type === 'error' ? 'border-l-red-500' : 'border-l-emerald-500'} text-white`;
    toast.classList.remove('hidden'); lucide.createIcons();
    setTimeout(() => { toast.classList.remove('translate-x-full', 'opacity-0'); toast.classList.add('translate-x-0', 'opacity-100'); }, 50);
    clearTimeout(toastTimeout); toastTimeout = setTimeout(() => { hideToast(); }, 5000);
}

function hideToast() {
    const toast = document.getElementById('customToast');
    if (toast) { toast.classList.remove('translate-x-0', 'opacity-100'); toast.classList.add('translate-x-full', 'opacity-0'); setTimeout(() => { toast.add('hidden'); }, 300); }
}

function toggleVisibilitasSandi(idInput, elemenTombol) {
    const input = document.getElementById(idInput);
    if (input.type === "password") { input.type = "text"; elemenTombol.innerHTML = `<i data-lucide="eye-off" class="w-4 h-4"></i>`; }
    else { input.type = "password"; elemenTombol.innerHTML = `<i data-lucide="eye" class="w-4 h-4"></i>`; }
    lucide.createIcons();
}

function validasiKesesuaianSandi() {
    const pwBaru = document.getElementById('modalPwBaru').value;
    const pwKonf = document.getElementById('modalPwKonfirmasi').value;
    const msgSandiLemah = document.getElementById('msgSandiLemah');
    const errorMsg = document.getElementById('msgErrorPassword');
    const btnSubmit = document.getElementById('btnSubmitGantiPw');
    let valid = true;
    if (pwBaru.length > 0 && pwBaru.length < 4) { msgSandiLemah.classList.remove('hidden'); valid = false; } else msgSandiLemah.classList.add('hidden');
    if (pwKonf.length === 0) errorMsg.classList.add('hidden');
    else if (pwBaru !== pwKonf) { errorMsg.classList.remove('hidden'); valid = false; } else errorMsg.classList.add('hidden');
    btnSubmit.disabled = !valid; lucide.createIcons();
}

function bukaModalAwal() { document.getElementById('modalAwal').classList.remove('hidden'); kunciScrollLatar(true); }
function tutupModalAwal() { document.getElementById('modalAwal').classList.add('hidden'); kunciScrollLatar(false); }
function bukaModalPengaturan() {
    if(!KELAS_AKTIF || !MAPEL_AKTIF) { tampilkanModalGagalMasuk("Akses Ditolak", "Pilih Kelas dan Mapel terlebih dahulu!"); resetNavActiveState(); return; }
    document.getElementById('modalPengaturan').classList.remove('hidden'); kunciScrollLatar(true);
}
function tutupModalPengaturan() { document.getElementById('modalPengaturan').classList.add('hidden'); kunciScrollLatar(false); resetNavActiveState(); }
function tampilkanModalGagalMasuk(judul, pesan) {
    document.getElementById('judulModalGagal').innerText = judul; document.getElementById('pesanModalGagal').innerText = pesan;
    document.getElementById('modalGagalMasuk').classList.remove('hidden'); kunciScrollLatar(true); lucide.createIcons();
}
function tutupModalGagalMasuk() { document.getElementById('modalGagalMasuk').classList.add('hidden'); kunciScrollLatar(false); resetNavActiveState(); }
function bukaModalGantiPassword() {
    if (!GURU_AKTIF) return;
    document.getElementById('modalPwGuruNama').value = GURU_AKTIF;
    document.getElementById('modalGantiPassword').classList.remove('hidden'); kunciScrollLatar(true);
}
function tutupModalGantiPassword() { document.getElementById('modalGantiPassword').classList.add('hidden'); kunciScrollLatar(false); resetNavActiveState(); }
function tampilkanModalKeluar() { document.getElementById('modalKonfirmasiKeluar').classList.remove('hidden'); kunciScrollLatar(true); lucide.createIcons(); }
function tutupModalKeluar() { document.getElementById('modalKonfirmasiKeluar').classList.add('hidden'); kunciScrollLatar(false); resetNavActiveState(); }
function prosesKeluarAkun() { location.reload(); }
function bukaModalKonfirmasiKembali() { document.getElementById('modalKonfirmasiKembali').classList.remove('hidden'); kunciScrollLatar(true); lucide.createIcons(); }

document.getElementById('formGerbangAwal').addEventListener('submit', function(e) {
    e.preventDefault();
    GURU_AKTIF = document.getElementById('gerbangGuru').value.trim().toUpperCase();
    let password = document.getElementById('gerbangPassword').value;
    const btnMasuk = document.getElementById('btnMasukGerbang');
    btnMasuk.disabled = true; btnMasuk.innerHTML = `<i data-lucide="refresh-cw" class="w-4 h-4 animate-spin text-white"></i> <span>Memproses...</span>`;
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden'); document.getElementById('loadingText').innerHTML = `Memverifikasi Akun...`;
    lucide.createIcons();

    fetch(`${WEB_APP_URL}?aksi=login&guru=${encodeURIComponent(GURU_AKTIF)}&password=${encodeURIComponent(password)}`)
        .then(res => res.json())
        .then(hasil => {
            overlay.classList.add('hidden'); btnMasuk.disabled = false; btnMasuk.innerHTML = `Masuk`;
            if (hasil.status === "success") {
                LIST_HAK_MENGAJAR = hasil.hakMengajar;
                tutupModalAwal();
                document.getElementById('panelAksesMengajar').classList.remove('hidden');
                document.getElementById('infoMateriAktif').classList.remove('hidden');
                document.getElementById('bottomNavDock').classList.remove('hidden');
                const selectJadwal = document.getElementById('pilihJadwalDinamis');
                selectJadwal.innerHTML = "";
                LIST_HAK_MENGAJAR.forEach(item => { selectJadwal.innerHTML += `<option value="${item.kelas}|${item.mapel}">Kelas ${item.kelas} — Mapel: ${item.mapel}</option>`; });
                gantiJadwalAktif();
            } else tampilkanModalGagalMasuk("Gagal Masuk", hasil.message);
        }).catch(() => { overlay.classList.add('hidden'); btnMasuk.disabled = false; tampilkanModalGagalMasuk("Kesalahan Sistem", "Koneksi gagal."); });
});

function gantiJadwalAktif() {
    const part = document.getElementById('pilihJadwalDinamis').value.split("|");
    KELAS_AKTIF = part[0]; MAPEL_AKTIF = part[1];
    document.getElementById('badgeKelas').innerText = `Kelas: ${KELAS_AKTIF}`;
    document.getElementById('badgeMapel').innerText = `Mapel: ${MAPEL_AKTIF}`;
    muatDataUtama(MAPEL_AKTIF, KELAS_AKTIF);
}

function muatDataUtama(namaSheet, tingkatKelas) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
    fetch(`${WEB_APP_URL}?sheet=${encodeURIComponent(namaSheet)}&kelas=${encodeURIComponent(tingkatKelas)}`)
        .then(response => response.json())
        .then(hasil => {
            overlay.classList.add('hidden');
            if (hasil.status === "success") {
                DATA_CACHED = hasil;
                document.getElementById('navDetailText').innerText = `Guru: ${GURU_AKTIF}`;
                for(let i=1; i<=8; i++) document.getElementById('modal_kd' + i).value = hasil.pengaturan['kd' + i] || "";
                renderTabelSiswa();
            }
        });
}

function renderTabelSiswa() {
    const komponen = document.getElementById('pilihKomponen').value;
    const tbody = document.getElementById('bodyTabelSiswa');
    tbody.innerHTML = "";
    document.getElementById('thKomponen').innerText = "Nilai " + komponen;

    DATA_CACHED.siswa.forEach((siswa, index) => {
        let nilaiSekarang = siswa[komponen] !== undefined ? siswa[komponen] : "";
        tbody.innerHTML += `
            <tr class="hover:bg-white/5 transition-colors divide-x divide-white/5">
                <td class="text-center py-3.5 font-bold text-white/30">${index + 1}</td>
                <td class="py-3.5 px-4 font-semibold">${siswa.nama}</td>
                <td class="py-3.5 px-3">
                    <input type="number" class="w-full max-w-[100px] mx-auto block text-center theme-input font-bold px-2 py-1.5 text-sm rounded-xl input-nilai-siswa" data-baris="${siswa.baris}" value="${nilaiSekarang}">
                </td>
            </tr>`;
    });
    document.getElementById('btnSimpanNilai').disabled = false;
    lucide.createIcons();
}

document.getElementById('formNilaiSiswa').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSimpanNilai');
    const komponen = document.getElementById('pilihKomponen').value;
    const elemenInputs = document.querySelectorAll('.input-nilai-siswa');
    let dataNilaiArray = [];
    elemenInputs.forEach(input => dataNilaiArray.push({ baris: input.getAttribute('data-baris'), nilai: Number(input.value) }));

    btn.disabled = true;
    fetch(WEB_APP_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ mapelTarget: MAPEL_AKTIF, kelasTarget: KELAS_AKTIF, tipeAksi: "simpanNilai", komponenPilihan: komponen, dataNilai: dataNilaiArray })
    }).then(() => { btn.disabled = false; showToast("Data Nilai Berhasil Disimpan!", `Seluruh Nilai ${komponen} sukses direkam.`); });
});

window.addEventListener('DOMContentLoaded', () => { pilihSistemTema(localStorage.getItem('smartgrader_theme') || 'emerald'); bukaModalAwal(); lucide.createIcons(); });
