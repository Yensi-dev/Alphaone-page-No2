        document.addEventListener('DOMContentLoaded', () => {
            const navbar = document.getElementById('navbar');
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');

            window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50); });
            hamburgerBtn.addEventListener('click', () => {
                const open = mobileMenu.style.display === 'block';
                mobileMenu.style.display = open ? 'none' : 'block';
            });
            document.querySelectorAll('#mobile-menu a').forEach(link => { link.addEventListener('click', () => { mobileMenu.style.display = 'none'; }); });
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const id = this.getAttribute('href');
                    if (id === '#') return;
                    const target = document.querySelector(id);
                    if (!target) return;
                    e.preventDefault();
                    const offset = navbar.getBoundingClientRect().height;
                    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
                });
            });
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
            }, { threshold: 0.07 });
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });

        function switchRegion(id, btn) {
            document.querySelectorAll('.region-panel').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.rtab').forEach(b => b.classList.remove('active'));
            document.getElementById('panel-' + id).classList.add('active');
            btn.classList.add('active');
            document.querySelectorAll('#panel-' + id + ' .reveal').forEach(el => {
                el.classList.remove('visible');
                setTimeout(() => el.classList.add('visible'), 60);
            });
        }

