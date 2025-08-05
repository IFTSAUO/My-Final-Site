document.addEventListener('DOMContentLoaded', function() {
    
    // --- MODIFIÉ : Logique du preloader pour un affichage de 2 secondes minimum ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const startTime = Date.now(); // On enregistre le moment où le script commence

        const hidePreloader = () => {
            // Utilise la classe .hide déjà présente dans votre CSS pour la transition
            preloader.classList.add('hide');
        };

        window.addEventListener('load', () => {
            const elapsedTime = Date.now() - startTime;
            const minimumDisplayTime = 2000; // 2000 millisecondes = 2 secondes

            if (elapsedTime >= minimumDisplayTime) {
                // Si la page a mis plus de 2s à charger, on cache le preloader immédiatement
                hidePreloader();
            } else {
                // Sinon, on attend le temps restant pour atteindre les 2s
                const delay = minimumDisplayTime - elapsedTime;
                setTimeout(hidePreloader, delay);
            }
        });
    }

    // --- Logique générale (menu, etc.) ---
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const yearSpan = document.getElementById("year");

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
        if (concoursModal && (window.location.pathname === '/' || window.location.pathname.endsWith('index.html'))) {
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
       setTimeout(openConcoursModal, 1000); 
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
                title: "Avis de Concours d'accès 2025-2026", 
                date: "08 Septembre 2025", 
                category: "Concours", 
                cardImage: "concours.jpg", 
                description: `Le Ministère de l'Aménagement du Territoire National organise le concours d'accès aux IFTSAU. Les préinscriptions en ligne se dérouleront du 08 au 14 Septembre 2025. L'examen écrit aura lieu le 21 Septembre 2025.`,
                full_description: `Le Ministère de l'Aménagement du Territoire National, de l'Urbanisme, de l'Habitat et de la Politique de la Ville organise le concours d'accès aux Instituts de Formation des Techniciens Spécialisés en Urbanisme, Architecture, Construction et Génie Civil pour l'année académique 2025-2026.<br><br><strong class="text-primary">Dates Clés :</strong><ul class="list-disc list-inside mt-2 space-y-1"><li><strong>Préinscriptions :</strong> du 08 au 14 Septembre 2025</li><li><strong>Examen écrit :</strong> 21 Septembre 2025</li><li><strong>Résultats :</strong> 29 Septembre 2025</li></ul>
                <div class="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="https://iftsau.matnuhpv.gov.ma" target="_blank" rel="noopener noreferrer" class="btn-primary font-bold py-3 px-6 rounded-md inline-flex items-center w-full sm:w-auto justify-center">
                        <i data-lucide="link" class="mr-2 h-5 w-5"></i> Lien de préinscription
                    </a>
                     <a href="avis.pdf" download="Avis-Concours-IFTSAU-2025-2026.pdf" class="bg-stone-200 text-stone-800 hover:bg-stone-300 font-bold py-3 px-6 rounded-md inline-flex items-center w-full sm:w-auto justify-center">
                        <i data-lucide="download-cloud" class="mr-2 h-5 w-5"></i> Télécharger l'avis
                    </a>
                </div>
                 <p class="text-center text-sm text-stone-500 mt-4">Le lien de préinscription sera actif à partir du 08 Septembre 2025.</p>`,
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
        
        function displayError(message) {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p class="font-bold">Erreur</p><p>${message}</p></div>`;
        }

        if (typeof pdfjsLib === 'undefined') {
            displayError("Une bibliothèque requise (PDF.js) n'a pas pu être chargée. Cela peut être dû à votre politique de sécurité (CSP) ou à un bloqueur de publicité. Veuillez vérifier la console pour plus de détails.");
            console.error("PDF.js (pdfjsLib) n'est pas défini. La visionneuse PDF ne peut pas fonctionner.");
            return; 
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`;

        const dobInput = document.getElementById('dob-input');
        const calendarToggle = document.getElementById('calendar-toggle');
        if(typeof flatpickr !== 'undefined'){
            const fp = flatpickr(dobInput, { dateFormat: "d/m/Y", locale: "fr", allowInput: true, theme: "airbnb" });
            if(calendarToggle) { calendarToggle.addEventListener('click', () => fp.toggle()); }
        }
        const searchButton = document.getElementById('search-button');
        const resultsContainer = document.getElementById('results-container');
        const originalButtonContent = searchButton.innerHTML;

        let pdfDoc = null,
            pageNum = 1,
            pageIsRendering = false,
            pageNumIsPending = null,
            scale = 1.5;

        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const oldFab = document.getElementById('floating-download-btn');
            if (oldFab) oldFab.remove();
            
            const cin = document.getElementById('cin-input').value;
            const dob = dobInput.value;
            if (!cin || !dob) { displayError('Veuillez remplir tous les champs.'); return; }
            setLoading(true);
            resultsContainer.innerHTML = '';
            
            try {
                const response = await fetch('/api/get-results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cin, dob })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `Erreur du serveur (Code: ${response.status}).` }));
                    throw new Error(errorData.message);
                }

                const data = await response.json();
                displayPdfBulletin(data);

            } catch (error) {
                displayError(error.message || 'Impossible de contacter le serveur. Vérifiez votre connexion.');
            } finally {
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
                if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [searchButton] });
            }
        }

        function displayPdfBulletin(data) {
            if (!data.nomFichier || !data.nomComplet) {
                displayError("Les informations de l'étudiant sont incomplètes.");
                return;
            }
            
            const downloadUrl = `/api/download-pdf?nomFichier=${encodeURIComponent(data.nomFichier)}`;

            resultsContainer.innerHTML = `
                <div class="bg-white p-4 sm:p-6 rounded-lg shadow-lg animate-fade-in">
                    <h3 class="text-xl font-bold text-center mb-4" style="color:var(--color-primary);">Bonjour, ${data.nomComplet}</h3>
                    <p class="text-center text-stone-600 mb-6">Voici votre bulletin de notes.</p>
                    
                    <div class="pdf-viewer-wrapper border rounded-md overflow-hidden bg-gray-100">
                        <div class="p-2 bg-gray-200 flex items-center justify-center space-x-2">
                            <button id="prev-page" class="p-2 rounded-md hover:bg-gray-300"><i data-lucide="chevron-left" class="h-5 w-5"></i></button>
                            <span class="text-sm font-medium">Page <span id="page-num"></span> / <span id="page-count"></span></span>
                            <button id="next-page" class="p-2 rounded-md hover:bg-gray-300"><i data-lucide="chevron-right" class="h-5 w-5"></i></button>
                            <div class="w-px h-5 bg-gray-400 mx-2"></div>
                            <button id="zoom-out" class="p-2 rounded-md hover:bg-gray-300"><i data-lucide="zoom-out" class="h-5 w-5"></i></button>
                            <button id="zoom-in" class="p-2 rounded-md hover:bg-gray-300"><i data-lucide="zoom-in" class="h-5 w-5"></i></button>
                        </div>
                        <div class="relative overflow-auto" style="max-height: 70vh;">
                             <div class="canvas-loader"><svg class="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="4" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke-width="4"></path></svg></div>
                            <canvas id="pdf-canvas" class="mx-auto"></canvas>
                        </div>
                    </div>

                    <div class="mt-6 text-center">
                        <a href="${downloadUrl}" class="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold whitespace-nowrap">
                            <i data-lucide="download" class="mr-2 h-5 w-5"></i>
                            Télécharger (Copie électronique)
                        </a>
                    </div>
                </div>`;
            
            const fab = document.createElement('a');
            fab.id = 'floating-download-btn';
            fab.href = downloadUrl;
            fab.className = 'fixed bottom-6 right-6 h-14 w-14 rounded-full flex items-center justify-center shadow-lg z-50 md:hidden animate-fade-in';
            fab.style.backgroundColor = 'var(--color-primary)';
            fab.style.color = 'white';
            fab.innerHTML = '<i data-lucide="download" class="h-7 w-7"></i>';
            document.body.appendChild(fab);
            
            if(typeof lucide !== 'undefined') lucide.createIcons();

            initPdfViewer(data.nomFichier);
        }

        const initPdfViewer = (nomFichier) => {
            const url = `/api/view-pdf?nomFichier=${encodeURIComponent(nomFichier)}`;
            const canvas = document.getElementById('pdf-canvas');
            const ctx = canvas.getContext('2d');
            const loader = document.querySelector('.canvas-loader');

            const renderPage = num => {
                pageIsRendering = true;
                loader.style.display = 'block';

                pdfDoc.getPage(num).then(page => {
                    const viewport = page.getViewport({ scale });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = { canvasContext: ctx, viewport };
                    page.render(renderContext).promise.then(() => {
                        pageIsRendering = false;
                        loader.style.display = 'none';
                        if (pageNumIsPending !== null) {
                            renderPage(pageNumIsPending);
                            pageNumIsPending = null;
                        }
                    });
                    document.getElementById('page-num').textContent = num;
                });
            };

            const queueRenderPage = num => {
                if (pageIsRendering) {
                    pageNumIsPending = num;
                } else {
                    renderPage(num);
                }
            };

            const onPrevPage = () => {
                if (pageNum <= 1) return;
                pageNum--;
                queueRenderPage(pageNum);
            };

            const onNextPage = () => {
                if (pageNum >= pdfDoc.numPages) return;
                pageNum++;
                queueRenderPage(pageNum);
            };
            
            const onZoomIn = () => {
                if (scale >= 3.0) return;
                scale += 0.25;
                queueRenderPage(pageNum);
            };

            const onZoomOut = () => {
                if (scale <= 0.5) return;
                scale -= 0.25;
                queueRenderPage(pageNum);
            };

            pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
                pdfDoc = pdfDoc_;
                document.getElementById('page-count').textContent = pdfDoc.numPages;
                renderPage(pageNum);
            }).catch(err => {
                displayError("Impossible de charger le bulletin. Veuillez réessayer.");
                console.error(err);
            });

            document.getElementById('prev-page').addEventListener('click', onPrevPage);
            document.getElementById('next-page').addEventListener('click', onNextPage);
            document.getElementById('zoom-in').addEventListener('click', onZoomIn);
            document.getElementById('zoom-out').addEventListener('click', onZoomOut);
        };

        const style = document.createElement('style');
        style.innerHTML = `@keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`;
        document.head.appendChild(style);
    }
    
    // --- Logique pour l'animation des statistiques ---
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length > 0) {
        const animateValue = (el, start, end, duration, prefix = '', unit = '') => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (end - start) + start);
                el.textContent = `${prefix}${currentValue}${unit}`;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const prefix = el.dataset.prefix || '';
                    const unit = el.dataset.unit || '';
                    const value = parseInt(el.dataset.value, 10);
                    
                    el.textContent = `${prefix}0${unit}`;
                    animateValue(el, 0, value, 2000, prefix, unit);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.5 
        });

        statValues.forEach(el => {
            observer.observe(el);
        });
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});