/**
 * SmartGrader Az-Zahro - Security & Layout Lockdown Script (Optimized)
 * Fitur: Anti-Klik Kanan, Anti-Copy/Cut, Anti-Select, Anti-Inspect Element, Hidden Scrollbar & Anti-DevTools
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

    // Eksekusi injeksi CSS secepat mungkin saat DOM siap
    if (document.head) { injeksiCSS(); } else { document.addEventListener('DOMContentLoaded', injeksiCSS); }

    // 2. AKTIFKAN PROTEKSI JAVASCRIPT SETELAH DOM SELESAI DIMUAT
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
            // Kunci F12
            if (e.key === "F12" || e.keyCode === 123) {
                e.preventDefault();
                return false;
            }
            // Kunci Ctrl + Shift + I, J, C (Inspect Tools)
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
                e.preventDefault();
                return false;
            }
            // Kunci Ctrl + U (View Source Code)
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
                e.preventDefault();
                return false;
            }
            // Kunci Ctrl + S (Mencegah halaman disimpan offline)
            if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
                e.preventDefault();
                return false;
            }
            // Kunci Ctrl + C (Shortcut Copy Keyboard)
            if (e.ctrlKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
                e.preventDefault();
                return false;
            }
            // Kunci Ctrl + A (Shortcut Select All)
            if (e.ctrlKey && (e.key === 'A' || e.key === 'a' || e.keyCode === 65)) {
                e.preventDefault();
                return false;
            }
        });
    });

    // 3. JEBAKAN DEBUGGER REKURSIF DINAMIS (Jauh lebih sulit dimatikan di DevTools)
    const pemblokirKonsol = function() {
        function jebakan(i) {
            if (("" + i / i).length !== 1 || i % 20 === 0) {
                (function() {}.constructor("debugger")());
            } else {
                (function() {}.constructor("debugger")());
            }
            jebakan(++i);
        }
        try {
            jebakan(0);
        } catch (e) {}
    };
    setInterval(pemblokirKonsol, 1000);

    // 4. DETEKSI UKURAN LAYAR KHUSUS DESKTOP (Mencegah salah deteksi di HP/Mobile)
    setInterval(function() {
        // Cek apakah user menggunakan perangkat mobile berdasarkan userAgent atau layar dasar
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 767px)").matches;
        
        if (!isMobile) {
            const threshold = 160; // Batas toleransi piksel untuk panel DevTools
            const selisihLebar = window.outerWidth - window.innerWidth > threshold;
            const selisihTinggi = window.outerHeight - window.innerHeight > threshold;
            
            if (selisihLebar || selisihTinggi) {
                // Bersihkan halaman dan arahkan ke tampilan blokir resmi Az-Zahro
                document.body.innerHTML = `
                    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; background-color:#f8fafc; font-family:'Inter', sans-serif; text-align:center; padding:20px;">
                        <h1 style="color:#dc2626; font-size:24px; font-weight:bold; margin-bottom:10px;">AKSES DITOLAK</h1>
                        <p style="color:#475569; font-size:16px; max-width:500px;">Sistem mendeteksi aktivitas analisis perangkat pengembang (Developer Tools) yang aktif. Silakan tutup jendela Inspect Element Anda dan muat ulang halaman ini.</p>
                    </div>
                `;
            }
        }
    }, 1000);
})();
