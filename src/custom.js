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
        const dobInput = document.getElementById('dob-input');
        const calendarToggle = document.getElementById('calendar-toggle');
        
        if(typeof flatpickr !== 'undefined'){
            const fp = flatpickr(dobInput, {
                dateFormat: "d/m/Y",
                locale: "fr",
                allowInput: true,
                theme: "airbnb"
            });
            calendarToggle.addEventListener('click', () => fp.toggle());
        }
        
        const searchButton = document.getElementById('search-button');
        const resultsContainer = document.getElementById('results-container');
        const originalButtonContent = searchButton.innerHTML;

        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cin = document.getElementById('cin-input').value;
            const dob = dobInput.value;

            if (!cin || !dob) {
                displayError('Veuillez remplir tous les champs.');
                return;
            }

            setLoading(true);

            try {
                const response = await fetch('/.netlify/functions/get-results', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cin, dob })
                });
                const data = await response.json();
                if (!response.ok) {
                    displayError(data.message || 'Une erreur est survenue.');
                } else {
                    displayResults(data);
                }
            } catch (error) {
                displayError('Impossible de contacter le serveur. Vérifiez votre connexion.');
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
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons({ nodes: [searchButton] });
                }
            }
        }

        function displayError(message) {
            resultsContainer.innerHTML = `
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                    <p class="font-bold">Erreur</p>
                    <p>${message}</p>
                </div>`;
        }

        function displayResults(data) {
            let modulesHtml = '<p class="text-stone-600">Aucun relevé de notes disponible pour le moment.</p>';
            
            if (data.modules && data.modules.length > 0) {
                modulesHtml = data.modules.map(module => {
                    const matieresHtml = module.matieres.map(matiere => `
                        <li class="flex justify-between items-center py-2 border-b border-stone-200 text-sm">
                            <span class="text-stone-700 pr-4">${matiere.nomMatiere}</span>
                            <span class="font-bold text-primary whitespace-nowrap">${matiere.note}</span>
                        </li>
                    `).join('');

                    return `
                        <div class="mt-4">
                            <div class="flex justify-between items-center bg-stone-100 p-2 rounded-t-md">
                                <h5 class="font-bold text-base text-stone-800">${module.nomModule}</h5>
                                ${module.moyenneModule ? `<span class="font-bold text-lg" style="color:var(--color-primary);">${module.moyenneModule}<span class="text-sm">/20</span></span>` : ''}
                            </div>
                            <ul class="space-y-1 border border-t-0 border-stone-200 rounded-b-md px-2">${matieresHtml}</ul>
                        </div>
                    `;
                }).join('');
            }

            resultsContainer.innerHTML = `
                <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg animate-fade-in">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-xl font-bold" style="color:var(--color-primary);">${data.nomComplet}</h3>
                            <p class="text-sm text-stone-500">C.I.N: ${data.cin} | N° Inscription: ${data.inscription || 'N/A'}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-stone-500">Moyenne Générale</p>
                            <p class="text-2xl font-bold" style="color:var(--color-primary);">${data.resultatFinal || 'N/A'}</p>
                        </div>
                    </div>
                    <h4 class="font-semibold mb-1 mt-6 text-stone-800 border-t pt-4">Relevé de notes</h4>
                    ${modulesHtml}
                    <div class="mt-8 text-center">
                        <button id="download-pdf" class="btn-primary inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold">
                            <i data-lucide="download" class="mr-2 h-5 w-5"></i>
                            Télécharger en PDF
                        </button>
                    </div>
                </div>`;
            
            if(typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            document.getElementById('download-pdf').addEventListener('click', () => {
                generatePDF(data);
            });

            // ***** DÉBUT : AJOUT DU MESSAGE DE FÉLICITATIONS *****
            // On vérifie s'il y a un résultat final à analyser
            if (data.resultatFinal) {
                // On extrait le nombre de la chaîne "14.55/20"
                const noteGenerale = parseFloat(data.resultatFinal);
                // On vérifie si la note est supérieure ou égale à 10
                if (!isNaN(noteGenerale) && noteGenerale >= 10) {
                    // On crée l'élément du message
                    const successMessage = document.createElement('div');
                    successMessage.textContent = "Félicitations ! Vous avez été déclaré(e) admis(e).";
                    
                    // On applique le style
                    successMessage.style.backgroundColor = '#28a745'; // Vert
                    successMessage.style.color = 'white';
                    successMessage.style.padding = '1rem';
                    successMessage.style.textAlign = 'center';
                    successMessage.style.fontWeight = 'bold';
                    successMessage.style.borderRadius = '0.5rem';
                    successMessage.style.marginBottom = '1rem';
                    successMessage.style.transition = 'opacity 0.5s ease-out';
                    
                    // On insère le message au début du conteneur des résultats
                    resultsContainer.prepend(successMessage);
                    
                    // On programme la disparition du message
                    setTimeout(() => {
                        successMessage.style.opacity = '0';
                        // On supprime l'élément du DOM après la fin de la transition
                        setTimeout(() => {
                            successMessage.remove();
                        }, 500); // 500ms = durée de la transition
                    }, 2000); // Le message reste visible pendant 2 secondes
                }
            }
            // ***** FIN : AJOUT DU MESSAGE DE FÉLICITATIONS *****
        }
        
        function generatePDF(data) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.text("Relevé de Notes", 105, 20, null, null, "center");
            doc.setFontSize(12);
            doc.text("IFTSAU Oujda", 105, 28, null, null, "center");
            
            doc.setFontSize(11);
            doc.text(`Étudiant(e): ${data.nomComplet}`, 14, 45);
            doc.text(`C.I.N: ${data.cin}`, 14, 52);
            doc.text(`N° Inscription: ${data.inscription || 'N/A'}`, 14, 59);
            
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`Moyenne Générale : ${data.resultatFinal || 'N/A'}`, 196, 59, null, null, 'right');
            doc.setFont(undefined, 'normal');

            const tableData = [];
            data.modules.forEach(module => {
                tableData.push([
                    { content: module.nomModule, colSpan: 2, styles: { fontStyle: 'bold', fillColor: '#F2F0E6' } },
                    { content: `${module.moyenneModule || ''}/20`, styles: { fontStyle: 'bold', fillColor: '#F2F0E6', halign: 'right' } }
                ]);

                module.matieres.forEach(matiere => {
                    tableData.push(['', matiere.nomMatiere, { content: matiere.note, styles: { halign: 'right' } }]);
                });
            });

            doc.autoTable({
                startY: 65,
                head: [['Module', 'Matière', 'Note']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [152, 106, 68] // Couleur --color-primary
                },
                columnStyles: {
                    0: { cellWidth: 45 },
                    1: { cellWidth: 'auto' },
                    2: { cellWidth: 25, halign: 'right' },
                }
            });

            const pageCount = doc.internal.getNumberOfPages();
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                const today = new Date().toLocaleDateString('fr-FR');
                doc.setFontSize(8);
                doc.text(`Généré le ${today}`, 14, doc.internal.pageSize.height - 10);
                doc.text(`Page ${i}/${pageCount}`, 195, doc.internal.pageSize.height - 10, null, null, 'right');
            }

            doc.save(`Releve-de-notes-${data.nomComplet}.pdf`);
        }
        
        const style = document.createElement('style');
        style.innerHTML = `@keyframes fade-in { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }`;
        document.head.appendChild(style);
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});