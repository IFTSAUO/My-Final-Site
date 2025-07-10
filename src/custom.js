// src/custom.js

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

    // --- Logique pour la section ACTUALITÉS (avec le nouvel événement) ---
    const newsSliderWrapper = document.getElementById('news-slider-wrapper');
    if (newsSliderWrapper) {

        const newsData = {
            'visite-labo': { 
                title: "Visite au laboratoire 'LABOTEST'", 
                date: "24 Mai 2025",
                category: "Visite Pédagogique", 
                cardImage: "images/LABO1.jpg", 
                description: `Suite à la visite au laboratoire de génie civil 'LABOTEST' effectuée le samedi 24 mai 2024 au profit des étudiants de la première année dans le but de découvrir les équipements et les techniques utilisés pour mieux comprendre les techniques des essais et leurs interprétations. Les essais ont été effectués sur place par l'ingénieur du laboratoire et encadré par Mr Alla Mostafa, à savoir ;
                <ul class="list-disc list-inside mt-4 space-y-2 text-left">
                    <li>Le cône d'Abrams</li>
                    <li>L'équivalent de sable</li>
                    <li>Écrasement de cylindre en Béton (résistance)</li>
                    <li>Essais des différents matériaux</li>
                    <li>Conservation des cylindre en béton.</li>
                    <li>Consultation des différents équipements de la boratoire.</li>
                </ul>`, 
                images: ["images/LABO1.jpg", "images/LABO2.jpg", "images/LABO3.jpg", "images/LABO4.jpg", "images/LABO5.jpg"] 
            },
            'don-sang': { 
                title: "Journée de don de sang", 
                date: "20 Mai 2025", 
                category: "Événement", 
                cardImage: "images/sang1.jpg", 
                description: "Le 20 mai 2025, l’Ordre des architectes d’Oujda a organisé une journée de dons de sang, avec une participation active des étudiants de l'IFTSAU Oujda.", 
                images: ["images/sang1.jpg", "images/sang2.jpg", "images/sang3.jpg", "images/sang4.jpg", "images/sang5.jpg"] 
            },
            'visite-colonial': { 
                title: "Visite de l'architecture coloniale", 
                date: "21 Avril 2025", 
                category: "Sortie Pédagogique", 
                cardImage: "images/visite2.jpg", 
                description: "Le 21 avril 2025, les étudiants de l'IFTSAU ont visité les vestiges de l'architecture coloniale au lycée Omar Moderne.", 
                images: ["images/visite1.jpg", "images/visite2.jpg", "images/visite3.jpg", "images/visite4.jpg"] 
            },
            'forum-orientation': { 
                title: "Forum d'orientation", 
                date: "08 Avril 2025", 
                category: "Événement", 
                cardImage: "images/forum1.jpg", 
                description: "L’IFTSAU a participé activement aux journées d’orientation pour informer les futurs bacheliers sur les opportunités scolaires et professionnelles.", 
                images: ["images/forum1.jpg", "images/forum2.jpg", "images/forum3.jpg"] 
            }
        };

        function parseFrenchDate(dateString) {
            const months = { 'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11 };
            const parts = dateString.toLowerCase().split(' ');
            if (parts.length !== 3) return new Date();
            const day = parseInt(parts[0], 10);
            const month = months[parts[1]];
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day);
        }

        const sortedNewsIds = Object.keys(newsData).sort((a, b) => {
            const dateA = parseFrenchDate(newsData[a].date);
            const dateB = parseFrenchDate(newsData[b].date);
            return dateB - dateA;
        });

        sortedNewsIds.forEach(id => {
            const newsItem = newsData[id];
            const cardDescription = newsItem.description.replace(/<[^>]*>/g, ' ').substring(0, 100).trim() + '...';
            const cardHTML = `
                <div class="swiper-slide h-full">
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                        ${newsItem.cardImage ? `<div class="overflow-hidden"><img src="${newsItem.cardImage}" alt="${newsItem.title}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"></div>` : ''}
                        <div class="p-6 flex-grow flex flex-col">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm font-semibold text-white px-3 py-1 rounded-full" style="background-color: var(--color-primary);">${newsItem.category}</span>
                                <span class="text-sm text-stone-500">${newsItem.date}</span>
                            </div>
                            <h3 class="text-xl font-bold mb-3 text-stone-800">${newsItem.title}</h3>
                            <p class="text-stone-600 text-sm flex-grow">${cardDescription}</p>
                            <button data-modal-id="${id}" class="modal-trigger mt-auto font-semibold text-primary inline-flex items-center self-start">
                                Lire la suite<i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
            newsSliderWrapper.innerHTML += cardHTML;
        });
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        new Swiper('.news-slider', { 
            loop: Object.keys(newsData).length > 2, 
            spaceBetween: 30, 
            slidesPerView: 1, 
            autoplay: { 
                delay: 4000, 
                disableOnInteraction: false 
            }, 
            pagination: { 
                el: '.swiper-pagination', 
                clickable: true 
            }, 
            navigation: false,
            breakpoints: { 
                768: { slidesPerView: 2 }, 
                1024: { slidesPerView: 3 } 
            } 
        });

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
                    let contentHTML = `<p class="text-stone-700">${data.description}</p>`;
                    if (data.images && data.images.length > 0) {
                        let galleryHTML = `
                            <div class="swiper modal-gallery relative mb-4 rounded-lg overflow-hidden">
                                <div class="swiper-wrapper">`;
                        data.images.forEach(imgUrl => { 
                            galleryHTML += `<div class="swiper-slide"><img src="${imgUrl}" class="w-full h-auto object-contain"></div>`; 
                        });
                        galleryHTML += `</div>
                                <div class="swiper-button-next"></div>
                                <div class="swiper-button-prev"></div>
                            </div>`;
                        contentHTML = galleryHTML + contentHTML;
                    }
                    modalBody.innerHTML = contentHTML;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }

                    if (data.images && data.images.length > 0) {
                        modalSwiper = new Swiper('.modal-gallery', { 
                            loop: true, 
                            navigation: { 
                                nextEl: '.swiper-button-next', 
                                prevEl: '.swiper-button-prev' 
                            } 
                        });
                    }
                }
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (modalSwiper) { 
                modalSwiper.destroy(true, true); 
                modalSwiper = null; 
            }
        };

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { 
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // --- Logique pour la page resultats.html ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        // Initialisation du calendrier Flatpickr en français
        const dobInput = document.getElementById('dob-input');
        const calendarToggle = document.getElementById('calendar-toggle');
        // Vérifie si Flatpickr est disponible
        if(typeof flatpickr !== 'undefined'){
            const fp = flatpickr(dobInput, {
                dateFormat: "d/m/Y", // Format jj/mm/aaaa
                locale: "fr",
                allowInput: true,
                theme: "airbnb"
            });

            // Ouvre le calendrier quand on clique sur l'icône
            calendarToggle.addEventListener('click', () => {
                fp.toggle();
            });
        }
        
        const searchButton = document.getElementById('search-button');
        const resultsContainer = document.getElementById('results-container');
        const originalButtonContent = searchButton.innerHTML;

        // Écouteur sur l'envoi du formulaire
        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le rechargement de la page

            const cin = document.getElementById('cin-input').value;
            const dob = dobInput.value;

            if (!cin || !dob) {
                displayError('Veuillez remplir tous les champs.');
                return;
            }

            // Affiche un état de chargement
            setLoading(true);

            try {
                const response = await fetch('/.netlify/functions/get-results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cin, dob })
                });

                const data = await response.json();

                if (!response.ok) {
                    // Gère les erreurs comme "404 Not Found"
                    displayError(data.message || 'Une erreur est survenue.');
                } else {
                    // Affiche les résultats en cas de succès
                    displayResults(data);
                }
            } catch (error) {
                // Gère les erreurs réseau
                displayError('Impossible de contacter le serveur. Vérifiez votre connexion.');
            } finally {
                // Réinitialise le bouton
                setLoading(false);
            }
        });

        function setLoading(isLoading) {
            if (isLoading) {
                searchButton.disabled = true;
                searchButton.innerHTML = `<svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="4" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-width="4"></path></svg> Chargement...`;
            } else {
                searchButton.disabled = false;
                searchButton.innerHTML = originalButtonContent;
                // Recrée les icônes si elles ont été supprimées
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons({
                        nodes: [searchButton]
                    });
                }
            }
        }

        function displayError(message) {
            resultsContainer.innerHTML = `
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p class="font-bold">Erreur</p>
                    <p>${message}</p>
                </div>
            `;
        }

        function displayResults(data) {
            let notesHtml = '<p class="text-stone-600">Aucune note disponible pour le moment.</p>';
            
            // Vérifie si des notes existent et si le tableau n'est pas vide
            if (data.notes && data.notes.length > 0) {
                notesHtml = data.notes.map(note => `
                    <li class="flex justify-between items-center py-2 border-b border-stone-200">
                        <span class="text-stone-700">${note.matiere}</span>
                        <span class="font-bold text-primary">${note.note}</span>
                    </li>
                `).join('');
                notesHtml = `<ul class="space-y-2">${notesHtml}</ul>`;
            }

            resultsContainer.innerHTML = `
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg animate-fade-in">
                    <h3 class="text-xl font-bold mb-4 text-primary">${data.full_name}</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p class="text-sm text-stone-500">N° Inscription</p>
                            <p class="font-medium">${data.num_inscription || 'N/A'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-stone-500">C.I.N</p>
                            <p class="font-medium">${data.cin}</p>
                        </div>
                    </div>
                    <h4 class="font-semibold mb-3 text-stone-800">Relevé de notes</h4>
                    ${notesHtml}
                </div>
            `;
        }

        // Ajoute la keyframe pour l'animation une seule fois
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});