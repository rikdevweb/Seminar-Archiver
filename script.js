document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SCROLL ANIMATION (Efek muncul halus)
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach((el) => {
        observer.observe(el);
    });

    // 2. NAVBAR SCROLL EFFECT & SMOOTH SCROLLING
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll untuk semua link navigasi
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. LOGIKA FORM KE GOOGLE SHEETS & VALIDASI EMAIL
    const form = document.getElementById('regForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('spinner');
    const modal = document.getElementById('successModal');
    
    // Elemen validasi email
    const emailInput = document.getElementById('email');
    const emailGroup = document.getElementById('emailGroup');

    // =========== GANTI URL DI BAWAH INI DENGAN URL APPS SCRIPT-MU ===========
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzK-6lTVeIi_vaHZ3QR8hYsJ-STKd_2HbmNbiL6L6LcPO3ylV3bxkY62MrC-We_RW18LA/exec'; 

    // Hilangkan error saat user mulai mengetik ulang di form email
    emailInput.addEventListener('input', () => {
        emailGroup.classList.remove('invalid');
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Cek domain email wajib menggunakan email kampus
        const emailValue = emailInput.value.trim().toLowerCase();
        if (!emailValue.endsWith('@krw.horizon.ac.id')) {
            emailGroup.classList.add('invalid');
            emailInput.focus();
            return; // Hentikan proses, jangan kirim data ke Google Sheets
        }
        
        // UI Loading State (Tombol menjadi proses)
        submitBtn.disabled = true;
        spinner.style.display = 'block';
        btnText.innerText = 'Memproses...';

        const formData = new FormData(form);

        fetch(SCRIPT_URL, { method: 'POST', body: formData })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    // Tampilkan Modal Sukses dan bersihkan form
                    modal.classList.add('active');
                    form.reset(); 
                } else if (data.result === 'full') {
                    alert('Maaf, kuota untuk jadwal (batch) ini sudah penuh. Silakan pilih jadwal lain.');
                } else if (data.result === 'invalid_email') {
                    alert('Sistem menolak! Email wajib menggunakan @krw.horizon.ac.id');
                    emailGroup.classList.add('invalid');
                }
                resetButton();
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Gagal terhubung ke server. Pastikan koneksi internet stabil lalu coba lagi.');
                resetButton();
            });
    });

    // Kembalikan tombol ke kondisi semula
    function resetButton() {
        submitBtn.disabled = false;
        spinner.style.display = 'none';
        btnText.innerText = 'Daftar Sekarang';
    }

    // Aksi Modal - Tutup modal setelah klik Join Grup WA
    const joinGroupBtn = document.getElementById('joinGroupBtn');
    if(joinGroupBtn) {
        joinGroupBtn.addEventListener('click', () => {
            setTimeout(() => {
                closeModal();
            }, 1000);
        });
    }

    // Fungsi global tutup modal
    window.closeModal = function() {
        modal.classList.remove('active');
    }
});