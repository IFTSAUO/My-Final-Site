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
    
    // --- Logique pour la section ACTUALITÉS ---
    const newsSliderWrapper = document.getElementById('news-slider-wrapper');
    if (newsSliderWrapper) {
        // ... (votre code pour les actualités reste ici)
    }
    
    // --- Logique pour la page resultats.html ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        
        function displayError(message) {
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.innerHTML = `<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"><p class="font-bold">Erreur</p><p>${message}</p></div>`;
        }

        if (typeof pdfjsLib === 'undefined') {
            displayError("Une bibliothèque requise (PDF.js) n'a pas pu être chargée. Veuillez vérifier la console.");
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
            
            // Supprime l'ancien bouton flottant s'il existe
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
            
            // --- AJOUT DE L'ICÔNE FLOTTANTE POUR MOBILE ---
            const fab = document.createElement('a');
            fab.id = 'floating-download-btn';
            fab.href = downloadUrl;
            // On utilise les classes Tailwind pour le style, et on le cache sur les écrans moyens et plus grands (md:hidden)
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
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
