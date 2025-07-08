document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logique générale (menu, preloader, etc.) ---
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
    
    // --- Logique pour les statistiques animées (page d'accueil) ---
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

    // --- Logique pour la section ACTUALITÉS (page d'accueil) ---
    const newsSliderWrapper = document.getElementById('news-slider-wrapper');
    if (newsSliderWrapper) {
        const newsData = {
            'don-sang': { title: "Journée de don de sang", date: "20 Mai 2025", category: "Événement", cardImage: "images/sang1.jpg", description: "En collaboration avec l'Ordre des architectes d'Oujda, l'IFTSAU a organisé une journée de dons de sang...", images: ["images/sang1.jpg", "images/sang2.jpg", "images/sang3.jpg", "images/sang4.jpg", "images/sang5.jpg"] },
            'visite-colonial': { title: "Visite de l'architecture coloniale", date: "21 Avril 2025", category: "Sortie Pédagogique", cardImage: "images/visite2.jpg", description: "Les étudiants de l'IFTSAU ont effectué une visite enrichissante des vestiges de l'architecture coloniale...", images: ["images/visite1.jpg", "images/visite2.jpg", "images/visite3.jpg", "images/visite4.jpg"] },
            'forum-orientation': { title: "Forum d'orientation", date: "08 Avril 2025", category: "Événement", cardImage: "images/forum1.jpg", description: "L’IFTSAU a participé activement aux journées d’orientation à Berkane et Oujda...", images: ["images/forum1.jpg", "images/forum2.jpg", "images/forum3.jpg"] }
        };

        for (const id in newsData) {
            const newsItem = newsData[id];
            const cardHTML = `<div class="swiper-slide h-full"><div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">${newsItem.cardImage ? `<div class="overflow-hidden"><img src="${newsItem.cardImage}" alt="${newsItem.title}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"></div>` : ''}<div class="p-6 flex-grow flex flex-col"><div class="flex justify-between items-center mb-3"><span class="text-sm font-semibold text-white px-3 py-1 rounded-full" style="background-color: var(--color-primary);">${newsItem.category}</span><span class="text-sm text-stone-500">${newsItem.date}</span></div><h3 class="text-xl font-bold mb-3 text-stone-800">${newsItem.title}</h3><p class="text-stone-600 text-sm flex-grow">${newsItem.description.substring(0, 100)}...</p><button data-modal-id="${id}" class="modal-trigger mt-4 font-semibold text-primary inline-flex items-center self-start">Lire la suite<i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"></i></button></div></div></div>`;
            newsSliderWrapper.innerHTML += cardHTML;
        }

        new Swiper('.news-slider', { loop: Object.keys(newsData).length > 2, spaceBetween: 30, slidesPerView: 1, autoplay: { delay: 5000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }, breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });

        const modal = document.getElementById('news-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalClose = document.getElementById('modal-close');
        let modalSwiper = null;

        document.querySelectorAll('.modal-trigger').forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.dataset.modalId;
                const data = newsData[modalId];
                if (data) {
                    modalTitle.textContent = data.title;
                    let contentHTML = `<p class="text-stone-600 mb-6">${data.description}</p>`;
                    if (data.images && data.images.length > 0) {
                        let galleryHTML = `<div class="swiper modal-gallery relative mb-4 rounded-lg overflow-hidden"><div class="swiper-wrapper">`;
                        data.images.forEach(imgUrl => { galleryHTML += `<div class="swiper-slide"><img src="${imgUrl}" class="w-full h-auto"></div>`; });
                        galleryHTML += `</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>`;
                        contentHTML = galleryHTML + contentHTML;
                    }
                    modalBody.innerHTML = contentHTML;
                    modal.classList.add('active');
                    lucide.createIcons();
                    if (data.images && data.images.length > 0) {
                        modalSwiper = new Swiper('.modal-gallery', { loop: true, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } });
                    }
                }
            });
        });
        function closeModal() {
            modal.classList.remove('active');
            if (modalSwiper) { modalSwiper.destroy(true, true); modalSwiper = null; }
        };
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }

    // --- Logique pour la page resultats.html ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const studentDatabase = { /* Les données des étudiants sont gérées côté serveur */ };
        const resultsContainer = document.getElementById('results-container');
        const cinInput = document.getElementById('cin-input');
        const dobInput = document.getElementById('dob-input');

        // Ajoute automatiquement les "/" pendant la frappe
        dobInput.addEventListener('input', function(e) {
            // Permet à l'utilisateur de supprimer du texte sans que le script ne le reformate
            if (e.inputType === 'deleteContentBackward') {
                return;
            }
            
            let value = e.target.value.replace(/\D/g, ''); // Garde seulement les chiffres
            let formatted = '';

            if (value.length > 4) {
                formatted = value.substring(0, 2) + '/' + value.substring(2, 4) + '/' + value.substring(4, 8);
            } else if (value.length > 2) {
                formatted = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                formatted = value;
            }
            
            e.target.value = formatted;
        });

        // Ajoute le "0" manquant pour le jour ou le mois quand l'utilisateur quitte le champ
        dobInput.addEventListener('blur', function(e) {
            let parts = e.target.value.split('/');
            
            if (parts[0] && parts[0].length === 1) {
                parts[0] = '0' + parts[0];
            }
            if (parts[1] && parts[1].length === 1) {
                parts[1] = '0' + parts[1];
            }
            
            e.target.value = parts.join('/');
        });


        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const cin = cinInput.value.toUpperCase().trim();
            const dobValue = dobInput.value;
            const dateParts = dobValue.split('/');
            
            const dobForSearch = (dateParts.length === 3 && dateParts[2].length === 4) 
                ? `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}` 
                : '';

            if (!cin || !dobForSearch) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p>Veuillez remplir tous les champs correctement (date au format jj/mm/aaaa).</p></div>`;
                return;
            }
            
            const studentData = studentDatabase[cin];
            if (studentData && studentData.dob === dobForSearch) {
                // Logique d'affichage des résultats...
            } else {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><p>Aucun étudiant trouvé avec ces informations.</p></div>`;
            }
        });
    }
    
    // --- Initialisation finale des icônes ---
    lucide.createIcons();
});