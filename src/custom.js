document.addEventListener('DOMContentLoaded', function() {
    
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const yearSpan = document.getElementById("year");
    const preloader = document.getElementById('preloader');

    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('hide');
        });
    }

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValueEl = entry.target;
                const finalValue = parseInt(statValueEl.getAttribute('data-value'), 10);
                const prefix = statValueEl.getAttribute('data-prefix') || '';
                const unit = statValueEl.getAttribute('data-unit') || '';
                let duration = Math.min(2000, finalValue * 20);
                let startTime = null;
                function animate(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    statValueEl.textContent = prefix + Math.floor(progress * finalValue) + unit;
                    if (progress < 1) requestAnimationFrame(animate);
                    else statValueEl.textContent = prefix + finalValue + unit;
                }
                requestAnimationFrame(animate);
                statsObserver.unobserve(statValueEl);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-value').forEach(el => statsObserver.observe(el));

    const newsSliderWrapper = document.getElementById('news-slider-wrapper');
    if (newsSliderWrapper) {
        // ... Logique des actualités inchangée ...
    }

    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const studentDatabase = { /* Données retirées */ };
        const resultsContainer = document.getElementById('results-container');
        const cinInput = document.getElementById('cin-input');
        const dobInput = document.getElementById('dob-input');
        const calendarToggle = document.getElementById('calendar-toggle');

        // NOUVEAU : Ajout d'un écouteur d'événement pour valider la saisie du CIN en temps réel.
        // On ne garde que les lettres et les chiffres.
        cinInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        });

        const fp = flatpickr(dobInput, {
            dateFormat: "d/m/Y",
            locale: "fr",
            allowInput: true, // Important pour permettre la saisie manuelle
            onChange: function(selectedDates, dateStr, instance) {
                instance.input.value = dateStr;
            }
        });

        if (calendarToggle) {
            calendarToggle.addEventListener('click', (e) => {
                fp.toggle();
                e.stopPropagation();
            });
        }

        // MODIFIÉ : L'écouteur d'événement 'input' pour la date de naissance.
        // On ne garde que les chiffres et le caractère '/'.
        dobInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9\/]/g, '');
        });

        // CONSERVÉ : L'écouteur d'événement 'blur' est utile pour reformater la date
        // si l'utilisateur la saisit sans les '0' (ex: 1/2/2000 -> 01/02/2000).
        dobInput.addEventListener('blur', function(e) {
            let parts = e.target.value.split('/');
            if (parts[0] && parts[0].length === 1) parts[0] = '0' + parts[0];
            if (parts[1] && parts[1].length === 1) parts[1] = '0' + parts[1];
            e.target.value = parts.join('/');
            // Met à jour l'instance de flatpickr avec la date formatée
            fp.setDate(e.target.value, true, "d/m/Y");
        });

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const cin = cinInput.value.toUpperCase().trim();
            const selectedDate = fp.selectedDates[0];
            const dobForSearch = selectedDate ? fp.formatDate(selectedDate, "Y-m-d") : '';

            if (!cin || !dobForSearch) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p>Veuillez remplir tous les champs correctement (date au format jj/mm/aaaa).</p></div>`;
                return;
            }
            const studentData = studentDatabase[cin];
            if (studentData && studentData.dob === dobForSearch) {
                // Logique d'affichage
            } else {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><p>Aucun étudiant trouvé avec ces informations.</p></div>`;
            }
        });
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
