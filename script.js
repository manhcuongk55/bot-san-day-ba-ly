/* ═══════════════════════════════════════════════
   Bột Sắn Dây Bà Lý — Interactions & Animations
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initSmoothScroll();
    initRevealAnimations();
    initCounterAnimation();
    initBackToTop();
    initFormHandler();
    initParticles();
});

/* ─── Navbar Scroll Effect ─── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ─── Hamburger Menu ─── */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

/* ─── Smooth Scroll ─── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/* ─── Reveal on Scroll (Intersection Observer) ─── */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ─── Counter Animation ─── */
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (target - startVal) * easeOut);

        el.textContent = current.toLocaleString('vi-VN');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ─── Back to Top ─── */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ─── Form Handler ─── */
function initFormHandler() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !phone || !address) {
            shakeButton();
            return;
        }

        // Phone validation (Vietnamese format)
        const phoneRegex = /^(0[1-9])[0-9]{8}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
            alert('Vui lòng nhập số điện thoại hợp lệ (10 số, bắt đầu bằng 0)');
            return;
        }

        // Get form data
        const product = document.getElementById('product').value;
        const quantity = document.getElementById('quantity').value;
        const notes = document.getElementById('notes').value;

        // Build Zalo/Phone message
        const productNames = {
            '500g': 'Gói 500g — 150.000₫',
            '1kg': 'Gói 1kg — 280.000₫',
            '2kg': 'Gói 2kg — 500.000₫'
        };

        const message = `🌿 ĐẶT HÀNG BỘT SẮN DÂY BÀ LÝ\n` +
            `👤 Tên: ${name}\n` +
            `📱 SĐT: ${phone}\n` +
            `📍 Địa chỉ: ${address}\n` +
            `📦 Sản phẩm: ${productNames[product]}\n` +
            `🔢 Số lượng: ${quantity}\n` +
            `📝 Ghi chú: ${notes || 'Không có'}`;

        // Show success state
        const formWrapper = form.closest('.contact-form-wrapper') || form.parentElement;
        form.innerHTML = `
            <div class="form-success">
                <div class="form-success-icon">✅</div>
                <h3>Đặt Hàng Thành Công!</h3>
                <p>Cảm ơn bạn <strong>${name}</strong>!<br>
                Chúng tôi sẽ liên hệ qua số <strong>${phone}</strong> để xác nhận đơn hàng.</p>
                <div style="margin-top: 1.5rem;">
                    <p style="font-size: 0.85rem; color: rgba(255,255,255,0.4);">Thông tin đơn hàng:</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">${productNames[product]} × ${quantity}</p>
                </div>
            </div>
        `;

        // Log for demo
        console.log('Order submitted:', message);
    });
}

function shakeButton() {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    btn.style.animation = 'shake 0.5s ease';
    setTimeout(() => btn.style.animation = '', 500);
}

/* ─── Hero Particles ─── */
function initParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const colors = ['rgba(212, 168, 67, 0.15)', 'rgba(91, 140, 62, 0.1)', 'rgba(255, 255, 255, 0.08)'];

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 60 + 20;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;

        container.appendChild(particle);
    }

    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
            25% { transform: translate(30px, -30px) scale(1.1); opacity: 0.25; }
            50% { transform: translate(-20px, 20px) scale(0.9); opacity: 0.1; }
            75% { transform: translate(15px, 15px) scale(1.05); opacity: 0.2; }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-8px); }
            40% { transform: translateX(8px); }
            60% { transform: translateX(-4px); }
            80% { transform: translateX(4px); }
        }
    `;
    document.head.appendChild(style);
}
