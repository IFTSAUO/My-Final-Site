document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Logique générale (toutes les pages) ---
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
    
    // --- ✨ Logique pour les statistiques animées ---
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statValueEl = entry.target;
                const finalValue = parseInt(statValueEl.getAttribute('data-value'), 10);
                const prefix = statValueEl.getAttribute('data-prefix') || '';
                const unit = statValueEl.getAttribute('data-unit') || '';
                let startValue = 0;
                let duration = Math.min(2000, finalValue * 20); // 2 secondes max

                let startTime = null;

                function animate(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    statValueEl.textContent = prefix + Math.floor(progress * finalValue) + unit;

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        statValueEl.textContent = prefix + finalValue + unit;
                    }
                }
                requestAnimationFrame(animate);
                statsObserver.unobserve(statValueEl);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value').forEach(el => {
        statsObserver.observe(el);
    });

    // --- ✨ Logique pour le slider des actualités ---
    const newsSliderWrapper = document.getElementById('news-slider-wrapper');
    if (newsSliderWrapper) {
        const newsData = [
            {
                img: 'photologo.png', // Remplacez par le vrai chemin de l'image
                title: "Concours d'accès 2025-2026",
                text: "Les inscriptions pour le concours d'accès à l'IFTSAU pour la prochaine année académique sont désormais ouvertes.",
                link: "admission.html"
            },
            {
                img: 'photologo.png', // Remplacez par le vrai chemin de l'image
                title: 'Journée Portes Ouvertes',
                text: "L'institut organise une journée portes ouvertes. Venez découvrir nos locaux, nos formations et rencontrer notre équipe.",
                link: "#"
            },
            {
                img: 'photologo.png', // Remplacez par le vrai chemin de l'image
                title: 'Rentrée Académique',
                text: "La rentrée est fixée au Lundi 22 Septembre. Nous souhaitons une excellente rentrée à tous nos étudiants.",
                link: "#"
            },
            {
                img: 'photologo.png', // Remplacez par le vrai chemin de l'image
                title: 'Atelier de Dessin Urbain',
                text: "Participez à notre prochain atelier sur le dessin urbain pour développer vos compétences pratiques sur le terrain.",
                link: "#"
            }
        ];

        newsData.forEach(news => {
            newsSliderWrapper.innerHTML += `
                <div class="swiper-slide h-full">
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                        <img src="${news.img}" alt="${news.title}" class="w-full h-48 object-cover">
                        <div class="p-6 flex flex-col flex-grow">
                            <h4 class="font-bold text-xl mb-3">${news.title}</h4>
                            <p class="text-stone-600 text-sm flex-grow">${news.text}</p>
                            <a href="${news.link}" class="text-primary font-semibold mt-4 inline-flex items-center">
                                Lire la suite <i data-lucide="arrow-right" class="w-4 h-4 ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>`;
        });

        new Swiper('.news-slider', {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }
        });
    }

    // --- 3. Logique pour la page resultats.html ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const studentDatabase = {
            // Base de données vide pour la sécurité
        };

        const dobPicker = flatpickr("#dob-input", {
            dateFormat: "Y-m-d", altInput: true, altFormat: "d-m-Y", locale: "fr"
        });

        const resultsContainer = document.getElementById('results-container');
        const cinInput = document.getElementById('cin-input');

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const cin = cinInput.value.toUpperCase().trim();
            const dob = dobPicker.selectedDates[0] ? dobPicker.selectedDates[0].toISOString().split('T')[0] : '';
            if (!cin || !dob) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p>Veuillez remplir tous les champs.</p></div>`;
                return;
            }
            const studentData = studentDatabase[cin];
            if (studentData && studentData.dob === dob) {
                // Logique d'affichage des résultats...
            } else {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><p>Aucun étudiant trouvé avec ces informations.</p></div>`;
            }
        });
    }

    // --- 4. Animations au scroll ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // Initialisation finale des icônes
    lucide.createIcons();
});