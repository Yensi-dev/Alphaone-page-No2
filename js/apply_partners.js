        let currentStep = 1;
        const totalSteps = 4;

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

            // Check item toggle
            document.querySelectorAll('.check-item').forEach(item => {
                item.addEventListener('click', () => {
                    const input = item.querySelector('input');
                    if (input.type === 'checkbox') {
                        item.classList.toggle('selected', input.checked);
                    } else {
                        document.querySelectorAll(`input[name="${input.name}"]`).forEach(r => {
                            r.closest('.check-item').classList.remove('selected');
                        });
                        item.classList.add('selected');
                    }
                });
            });

            // Reveal
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
            }, { threshold: 0.07 });
            document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        });

        function validateStep(step) {
            let valid = true;

            const clear = (id) => {
                const el = document.getElementById(id);
                if (el) { el.classList.remove('visible'); }
            };
            const error = (inputId, errId) => {
                const inp = document.getElementById(inputId);
                const err = document.getElementById(errId);
                if (inp) inp.classList.add('invalid');
                if (err) err.classList.add('visible');
                valid = false;
            };
            const clearInput = (id) => {
                const el = document.getElementById(id);
                if (el) el.classList.remove('invalid');
            };

            if (step === 1) {
                clearInput('company-name'); clear('err-company-name');
                clearInput('company-website'); clear('err-company-website');
                clearInput('country'); clear('err-country');
                clearInput('employees'); clear('err-employees');
                clear('err-industries');

                if (!document.getElementById('company-name').value.trim()) error('company-name', 'err-company-name');
                if (!document.getElementById('company-website').value.trim()) error('company-website', 'err-company-website');
                if (!document.getElementById('country').value) error('country', 'err-country');
                if (!document.getElementById('employees').value) error('employees', 'err-employees');
                const checked = document.querySelectorAll('#industries input:checked');
                if (checked.length === 0) { document.getElementById('err-industries').classList.add('visible'); valid = false; }
            }

            if (step === 2) {
                ['first-name','last-name','job-title','phone'].forEach(id => {
                    clearInput(id); clear('err-' + id);
                    if (!document.getElementById(id).value.trim()) error(id, 'err-' + id);
                });
                clearInput('email'); clear('err-email');
                const emailVal = document.getElementById('email').value;
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) error('email', 'err-email');
            }

            if (step === 3) {
                clear('err-partner-type'); clear('err-regions');
                if (!document.querySelector('input[name="partner-type"]:checked')) {
                    document.getElementById('err-partner-type').classList.add('visible'); valid = false;
                }
                if (document.querySelectorAll('#step-3 input[type="checkbox"]:checked').length === 0) {
                    document.getElementById('err-regions').classList.add('visible'); valid = false;
                }
            }

            if (step === 4) {
                clear('err-agree-terms');
                if (!document.getElementById('agree-terms').checked) {
                    document.getElementById('err-agree-terms').classList.add('visible'); valid = false;
                }
            }

            return valid;
        }

        function updateUI() {
            // Steps
            for (let i = 1; i <= totalSteps; i++) {
                const stepEl = document.getElementById('step-' + i);
                const navEl  = document.getElementById('nav-step-' + i);
                const lblEl  = document.getElementById('lbl-' + i);
                stepEl.classList.toggle('active', i === currentStep);
                navEl.classList.remove('active','done');
                lblEl.classList.remove('active','done');
                if (i === currentStep) { navEl.classList.add('active'); lblEl.classList.add('active'); }
                if (i < currentStep)   { navEl.classList.add('done');   lblEl.classList.add('done'); navEl.querySelector('.step-num').innerHTML = '<i class="fas fa-check" style="font-size:.65rem;"></i>'; }
            }
            // Progress
            document.getElementById('progress-fill').style.width = (currentStep / totalSteps * 100) + '%';
            // Buttons
            document.getElementById('btn-back').style.display = currentStep > 1 ? 'inline-flex' : 'none';
            const nextBtn = document.getElementById('btn-next');
            nextBtn.innerHTML = currentStep === totalSteps ? '<i class="fas fa-paper-plane"></i> Submit Application' : 'Next <i class="fas fa-arrow-right"></i>';
            document.getElementById('step-counter').textContent = `Step ${currentStep} of ${totalSteps}`;
        }

        function updateSummary() {
            const company = document.getElementById('company-name').value || '—';
            const first   = document.getElementById('first-name').value;
            const last    = document.getElementById('last-name').value;
            const email   = document.getElementById('email').value || '—';
            const country = document.getElementById('country').value || '—';
            document.getElementById('sum-company').textContent = company;
            document.getElementById('sum-contact').textContent = (first || last) ? `${first} ${last}`.trim() : '—';
            document.getElementById('sum-email').textContent   = email;
            document.getElementById('sum-country').textContent = country;
        }

        function goNext() {
            if (!validateStep(currentStep)) return;
            if (currentStep === totalSteps) {
                submitApplication(); return;
            }
            currentStep++;
            if (currentStep === 4) updateSummary();
            updateUI();
            document.querySelector('.bpa-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function goBack() {
            if (currentStep > 1) { currentStep--; updateUI(); document.querySelector('.bpa-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        }

        function submitApplication() {
            // Generate reference number
            const ref = 'BPA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
            document.getElementById('ref-number').textContent = ref;

            // Show success
            document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
            document.getElementById('progress-fill').style.width = '100%';
            document.getElementById('form-actions').style.display = 'none';
            document.querySelector('.progress-bar-wrap').style.display = 'none';
            document.getElementById('success-panel').classList.add('visible');

            // Mark all steps done
            for (let i = 1; i <= totalSteps; i++) {
                const navEl = document.getElementById('nav-step-' + i);
                navEl.classList.remove('active'); navEl.classList.add('done');
                navEl.querySelector('.step-num').innerHTML = '<i class="fas fa-check" style="font-size:.65rem;"></i>';
                document.getElementById('lbl-' + i).classList.add('done');
            }
        }

        updateUI();
  