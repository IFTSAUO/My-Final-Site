document.addEventListener('DOMContentLoaded', function() {
    
    // --- Logique générale (menu, preloader, etc.) ---
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const yearSpan = document.getElementById("year");
    const preloader = document.getElementById('preloader');

    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.transition = 'opacity 0.5s ease, visibility 0.5s ease';
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
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
    
    // --- Logique pour le Modal de l'avis de concours ---
    const concoursModal = document.getElementById('concours-modal');
    const concoursModalClose = document.getElementById('concours-modal-close');

    function openConcoursModal() {
        if (concoursModal) {
            concoursModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }
    
    function closeConcoursModal() {
        if (concoursModal) {
            concoursModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
       setTimeout(openConcoursModal, 1500);
    }
    
    if(concoursModalClose) concoursModalClose.addEventListener('click', closeConcoursModal);
    if(concoursModal) concoursModal.addEventListener('click', (e) => {
        if (e.target === concoursModal) {
            closeConcoursModal();
        }
    });

    // --- Logique pour la section ACTUALITÉS ---
    const newsSliderWrapper = document.getElementById('news-slider-wrapper');
    if (newsSliderWrapper) {
        const newsData = {
            'concours-2025': { 
                title: "Résultats Finaux du Concours 2025-2026", 
                date: "29 Septembre 2025", 
                category: "Concours", 
                cardImage: "concours.jpg", 
                description: `Les résultats finaux du concours d'accès (liste principale et listes d'attente) sont désormais disponibles. Félicitations aux nouveaux admis !`,
                full_description: `Les résultats finaux du concours d'accès aux IFTSAU pour l'année académique 2025-2026 sont publiés.<br><br>Nous adressons nos vives félicitations aux candidats admis sur la liste principale ainsi qu'à ceux retenus sur les listes d'attente.
                <div class="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="https://iftsau.matnuhpv.gov.ma/subscribe/" target="_blank" rel="noopener noreferrer" class="btn-primary font-bold py-3 px-6 rounded-md inline-flex items-center w-full sm:w-auto justify-center">
                        <i data-lucide="award" class="mr-2 h-5 w-5"></i> Consulter les résultats
                    </a>
                </div>
                 <p class="text-center text-sm text-stone-500 mt-4">Les instructions relatives à l'inscription seront communiquées ultérieurement.</p>`,
                images: ["concours.jpg"]
            },
            'visite-labo': { title: "Visite au laboratoire 'LABOTEST'", date: "24 Mai 2025", category: "Visite Pédagogique", cardImage: "images/LABO1.jpg", description: `Suite à la visite au laboratoire de génie civil 'LABOTEST' effectuée le samedi 24 mai 2024 au profit des étudiants de la première année dans le but de découvrir les équipements et les techniques utilisés pour mieux comprendre les techniques des essais et leurs interprétations. Les essais ont été effectués sur place par l'ingénieur du laboratoire et encadré par Mr Alla Mostafa, à savoir ;<ul class="list-disc list-inside mt-4 space-y-2 text-left"><li>Le cône d'Abrams</li><li>L'équivalent de sable</li><li>Écrasement de cylindre en Béton (résistance)</li><li>Essais des différents matériaux</li><li>Conservation des cylindre en béton.</li><li>Consultation des différents équipements de la boratoire.</li></ul>`, images: ["images/LABO1.jpg", "images/LABO2.jpg", "images/LABO3.jpg", "images/LABO4.jpg", "images/LABO5.jpg"] },
            'don-sang': { title: "Journée de don de sang", date: "20 Mai 2025", category: "Événement", cardImage: "images/sang1.jpg", description: "Le 20 mai 2025, l’Ordre des architectes d’Oujda a organisé une journée de dons de sang, avec une participation active des étudiants de l'IFTSAU Oujda.", images: ["images/sang1.jpg", "images/sang2.jpg", "images/sang3.jpg", "images/sang4.jpg", "images/sang5.jpg"] },
            'visite-colonial': { title: "Visite de l'architecture coloniale", date: "21 Avril 2025", category: "Sortie Pédagogique", cardImage: "images/visite2.jpg", description: "Le 21 avril 2025, les étudiants de l'IFTSAU ont visité les vestiges de l'architecture coloniale au lycée Omar Moderne.", images: ["images/visite1.jpg", "images/visite2.jpg", "images/visite3.jpg", "images/visite4.jpg"] },
            'forum-orientation': { title: "Forum d'orientation", date: "08 Avril 2025", category: "Événement", cardImage: "images/forum1.jpg", description: "L’IFTSAU a participé activement aux journées d’orientation pour informer les futurs bacheliers sur les opportunités scolaires et professionnelles.", images: ["images/forum1.jpg", "images/forum2.jpg", "images/forum3.jpg"] }
        };
        function parseFrenchDate(dateString) { const months = { 'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11 }; const parts = dateString.toLowerCase().split(' '); if (parts.length !== 3) return new Date(); const day = parseInt(parts[0], 10); const month = months[parts[1]]; const year = parseInt(parts[2], 10); return new Date(year, month, day); }
        const sortedNewsIds = Object.keys(newsData).sort((a, b) => parseFrenchDate(newsData[b].date) - parseFrenchDate(newsData[a].date));
        
        sortedNewsIds.forEach(id => {
            const newsItem = newsData[id];
            const cardDescription = newsItem.description.replace(/<[^>]*>/g, ' ').substring(0, 100).trim() + '...';
            const cardHTML = `<div class="swiper-slide h-full"><div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">${newsItem.cardImage ? `<div class="overflow-hidden"><img src="${newsItem.cardImage}" alt="${newsItem.title}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"></div>` : ''}<div class="p-6 flex-grow flex flex-col"><div class="flex justify-between items-center mb-3"><span class="text-sm font-semibold text-white px-3 py-1 rounded-full" style="background-color: var(--color-primary);">${newsItem.category}</span><span class="text-sm text-stone-500">${newsItem.date}</span></div><h3 class="text-xl font-bold mb-3 text-stone-800">${newsItem.title}</h3><p class="text-stone-600 text-sm flex-grow">${cardDescription}</p><button data-modal-id="${id}" class="modal-trigger mt-auto font-semibold text-primary inline-flex items-center self-start">Lire la suite<i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"></i></button></div></div></div>`;
            newsSliderWrapper.innerHTML += cardHTML;
        });

        if (typeof Swiper !== 'undefined') new Swiper('.news-slider', { loop: Object.keys(newsData).length > 2, spaceBetween: 30, slidesPerView: 1, autoplay: { delay: 4000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, navigation: false, breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } } });
        
        const newsModal = document.getElementById('news-modal'); const modalTitle = document.getElementById('modal-title'); const modalBody = document.getElementById('modal-body'); const modalClose = document.getElementById('modal-close'); let modalSwiper = null;
        
        document.querySelectorAll('.modal-trigger').forEach(button => { button.addEventListener('click', () => { const modalId = button.dataset.modalId; const data = newsData[modalId]; if (data) { modalTitle.textContent = data.title; let contentHTML = `<p class="text-stone-700">${data.full_description || data.description}</p>`; if (data.images && data.images.length > 0) { let galleryHTML = `<div class="swiper modal-gallery relative mb-4 rounded-lg overflow-hidden"><div class="swiper-wrapper">`; data.images.forEach(imgUrl => { galleryHTML += `<div class="swiper-slide"><img src="${imgUrl}" class="w-full h-auto object-contain"></div>`; }); galleryHTML += `</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>`; contentHTML = galleryHTML + contentHTML; } modalBody.innerHTML = contentHTML; newsModal.classList.add('active'); document.body.style.overflow = 'hidden'; if (typeof lucide !== 'undefined') lucide.createIcons(); if (data.images && data.images.length > 0) { modalSwiper = new Swiper('.modal-gallery', { loop: true, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } }); } } }); });
        
        function closeNewsModal() { if(newsModal) newsModal.classList.remove('active'); document.body.style.overflow = ''; if (modalSwiper) { modalSwiper.destroy(true, true); modalSwiper = null; } };
        if(modalClose) modalClose.addEventListener('click', closeNewsModal);
        if(newsModal) newsModal.addEventListener('click', (e) => { if (e.target === newsModal) closeNewsModal(); });
    }
    
    // --- Logique pour la page resultats.html ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        // ... (votre code existant pour la page résultats reste ici)
    }
    
    // --- Logique pour l'animation des statistiques ---
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length > 0) {
        // ... (votre code existant pour les statistiques reste ici)
    }
    
    // --- AJOUTÉ : Logique pour l'accordéon de l'emploi du temps ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    if(accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const currentlyActive = item.classList.contains('active');

                // Ferme tous les autres items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    otherHeader.querySelector('h3').classList.replace('text-primary', 'text-stone-700');
                    otherHeader.classList.remove('bg-stone-100');
                });

                // Ouvre le nouvel item (s'il n'était pas déjà ouvert)
                if (!currentlyActive) {
                    item.classList.add('active');
                    const h3 = header.querySelector('h3');
                    h3.classList.replace('text-stone-700', 'text-primary');
                    header.classList.add('bg-stone-100');
                }
            });
        });
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});