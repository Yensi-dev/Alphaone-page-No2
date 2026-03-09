document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Navbar scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu toggle
    hamburgerBtn.addEventListener('click', () => {
        const open = mobileMenu.style.display === 'block';
        mobileMenu.style.display = open ? 'none' : 'block';
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => { mobileMenu.style.display = 'none'; });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const offset = navbar.getBoundingClientRect().height;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        });
    });

    // Scroll reveal
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // DEMO MODAL 
    const modal       = document.getElementById('demo-modal');
    const modalInner  = document.getElementById('demo-modal-inner');
    document.getElementById('demo-submit').addEventListener('click', function () {
    const emailInput = document.getElementById('demo-email');
    const emailError = document.getElementById('email-error');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);

    if (!emailValid) {
        emailInput.classList.add('invalid');
        emailError.classList.add('visible');
        emailInput.focus();
    } else {
        emailInput.classList.remove('invalid');
        emailError.classList.remove('visible');
    }
});

document.getElementById('demo-email').addEventListener('input', function () {
    this.classList.remove('invalid');
    document.getElementById('email-error').classList.remove('visible');
});

    // Open — cualquier elemento con data-demo-trigger o class .demo-trigger
    document.querySelectorAll('[data-demo-trigger], .demo-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close — X button
    document.getElementById('demo-modal-close')?.addEventListener('click', closeModal);

    // Close — click backdrop
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close — Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
});