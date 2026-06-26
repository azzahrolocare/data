/**
 * SmartGrader Az-Zahro - Layout Lockdown Script (Clean Version)
 * Fitur: Anti-Klik Kanan, Anti-Copy, Anti-Select, Anti-Keyboard Inspect, Hidden Scrollbar
 * (Fungsi Akses Ditolak / Hancurkan Halaman Telah Dihapus)
 */

(function() {
    // 1. MENYUNTIKKAN CSS UNTUK MENYEMBUNYIKAN SCROLLBAR & SELEKSI SECARA VISUAL
    const injeksiCSS = () => {
        if (document.getElementById('security-lock-style')) return;
        const style = document.createElement('style');
        style.id = 'security-lock-style';
        style.innerHTML = `
            /* Sembunyikan scrollbar untuk Chrome, Safari, dan Opera */
            ::-webkit-scrollbar {
                display: none !important;
            }
            /* Sembunyikan scrollbar untuk IE, Edge, dan Firefox */
            html, body {
                -ms-overflow-style: none !important;  /* IE dan Edge */
                scrollbar-width: none !important;     /* Firefox */
                
                /* Proteksi CSS: Mencegah teks agar tidak bisa diblok/diseleksi */
                -webkit-user-select: none !important; 
                -moz-user-select: none !important;    
                -ms-user-select: none !important;     
                user-select: none !important;         
            }
        `;
        document.head.appendChild(style);
    };

    if (document.head) { injeksiCSS(); } else { document.addEventListener('DOMContentLoaded', injeksiCSS); }

    // 2. AKTIFKAN PROTEKSI JAVASCRIPT STANDAR SETELAH DOM SELESAI DIMUAT
    document.addEventListener('DOMContentLoaded', () => {
        
        // A. Memblokir Klik Kanan
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        // B. Memblokir Fitur Copy, Cut, dan Seleksi Teks via JS
        document.addEventListener('copy', function(e) { e.preventDefault(); });
        document.addEventListener('cut', function(e) { e.preventDefault(); });
        document.addEventListener('selectstart', function(e) { e.preventDefault(); });

        // C. Memblokir Tombol Kombinasi Keyboard (Inspect Element & Shortcut)
        document.addEventListener('keydown', function(e) {
            if (e.key === "F12" || e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
                e.preventDefault();
                return false;
            }
            if (e.ctrlKey && (e.key === 'A' || e.key === 'a' || e.keyCode === 65)) {
                e.preventDefault();
                return false;
            }
        });
    });
})();
