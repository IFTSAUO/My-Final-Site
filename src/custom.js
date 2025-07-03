document.addEventListener('DOMContentLoaded', function() {
    // --- Logic that runs on ALL pages ---
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Page-specific logic below ---

    // Logic for demande-document.html
    const scolariteForm = document.getElementById('scolarite-form');
    if (scolariteForm) {
        const typeDocumentSelect = document.getElementById("type_document");
        const autreDocumentContainer = document.getElementById("autre-document-container");
        const autreDocumentInput = document.getElementById("autre_document_nom");
        if(typeDocumentSelect && autreDocumentContainer && autreDocumentInput) {
            typeDocumentSelect.addEventListener("change", e => {
                if (e.target.value === "autre") {
                    autreDocumentContainer.classList.remove("hidden");
                    autreDocumentInput.required = true;
                } else {
                    autreDocumentContainer.classList.add("hidden");
                    autreDocumentInput.required = false;
                }
            });
        }
        const validationCheck = document.getElementById("validation-check");
        const submitButton = document.getElementById("submit-button");
        if(validationCheck && submitButton){
          submitButton.disabled = true;
          validationCheck.addEventListener("change", () => {
              submitButton.disabled = !validationCheck.checked;
          });
        }
    }

    // Logic for resultats.html
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        flatpickr("#dob-input", {
            altInput: true,
            altFormat: "j F Y",
            dateFormat: "d-m-Y",
            locale: "fr",
            theme: "airbnb"
        });
        // Student search logic would go here
    }

    // Logic for vie-etudiante.html
    const maquettesGallery = document.querySelector('#maquettes .grid');
    if (maquettesGallery) {
        const maquettesToShow = [2, 3, 10]; 
        maquettesToShow.forEach(imageNumber => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'group overflow-hidden rounded-lg shadow-md';
            imageContainer.innerHTML = `<img class="h-auto max-w-full rounded-lg transition-transform duration-500 group-hover:scale-110" src="maquetes/${imageNumber}.jpg" alt="Maquette étudiante ${imageNumber}">`;
            maquettesGallery.appendChild(imageContainer);
        });
    }
    const artsGallery = document.querySelector('#arts-plastiques .grid');
    if (artsGallery) {
        const artsImagesToShow = ['10.JPG', '20.jpg', '30.JPG']; 
        artsImagesToShow.forEach(imageName => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'group overflow-hidden rounded-lg shadow-md';
            imageContainer.innerHTML = `<img class="h-auto max-w-full rounded-lg transition-transform duration-500 group-hover:scale-110" src="arts-plastiques/${imageName}" alt="Oeuvre d'art plastique">`;
            artsGallery.appendChild(imageContainer);
        });
    }

    // --- ✨ Logic for index.html ✨ ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => { preloader.classList.add('hide'); }, 500);
        });

        const newsData = {
            'don-sang-2025': { title: "Partagez la vie : Journée de don de sang", date: "20 Mai 2025", category: "Événement", cardImage: "images/sang0.jpg", description: "L’Ordre des architectes d’Oujda a organisé une journée de dons de sang avec une participation très active des architectes et des étudiants de l'IFTSAU Oujda et de l’École Nationale d’Architecture.", images: ["images/sang0.jpg", "images/sang1.jpg", "images/sang2.jpg", "images/sang3.jpg", "images/sang4.jpg", "images/sang5.jpg"] },
            'visite-colonial-2025': { title: "Visite des vestiges de l'architecture coloniale", date: "21 Avril 2025", category: "Sortie Pédagogique", cardImage: "images/visite1.jpg", description: "Les étudiants de l'IFTSAU, encadrés par le professeur Sarhdaoui Mohammed et le docteur Badr Moukri, ont visité les vestiges de l'architecture coloniale au lycée Omar Moderne pour en explorer l'importance historique et culturelle.", images: ["images/visite1.jpg", "images/visite2.jpg", "images/visite3.jpg", "images/visite4.jpg"] },
            'forum-orientation-2025': { title: "Forum d'orientation à Berkane et Oujda", date: "08 Avril 2025", category: "Événement", cardImage: "images/forum1.jpg", description: "L’IFTSAU a participé activement aux journées d’orientation les 05 avril à Berkane et 08 avril à Oujda pour informer les futurs bacheliers sur les opportunités scolaires et professionnelles.", images: ["images/forum1.jpg", "images/forum2.jpg", "images/forum3.jpg"] }
        };

        const newsWrapper = document.getElementById('news-slider-wrapper');
        if (newsWrapper) {
            for (const id in newsData) {
                const newsItem = newsData[id];
                const cardHTML = `<div class="swiper-slide h-full"><div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">${newsItem.cardImage ? `<div class="overflow-hidden"><img src="${newsItem.cardImage}" alt="${newsItem.title}" class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" onerror="this.onerror=null;this.src='https://placehold.co/600x400/eeeeee/999999?text=Image+introuvable';"></div>` : ''}<div class="p-6 flex-grow flex flex-col"><div class="flex justify-between items-center mb-3"><span class="text-sm font-semibold text-white px-3 py-1 rounded-full" style="background-color: var(--color-primary);">${newsItem.category}</span><span class="text-sm text-stone-500">${newsItem.date}</span></div><h3 class="text-xl font-bold mb-3 text-stone-800">${newsItem.title}</h3><p class="text-stone-600 text-sm flex-grow">${newsItem.description.substring(0, 120)}...</p><button data-modal-id="${id}" class="mt-4 font-semibold text-primary inline-flex items-center self-start">Lire la suite<i data-lucide="arrow-right" class="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"></i></button></div></div></div>`;
                newsWrapper.innerHTML += cardHTML;
            }
            const swiper = new Swiper('.news-slider', { loop: Object.keys(newsData).length > 2, spaceBetween: 30, slidesPerView: 1, autoplay: { delay: 5000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }, breakpoints: { 768: { slidesPerView: 2, spaceBetween: 30 }, 1024: { slidesPerView: 3,spaceBetween: 40 }, } });
        }

        const modal = document.getElementById('news-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const modalClose = document.getElementById('modal-close');
        let modalSwiper = null;

        if (modal) {
            document.querySelectorAll('[data-modal-id]').forEach(button => {
                button.addEventListener('click', () => {
                    const modalId = button.dataset.modalId;
                    const data = newsData[modalId];
                    if (data) {
                        modalTitle.textContent = data.title;
                        let contentHTML = `<p class="mb-6 text-stone-600">${data.description}</p>`;
                        if (data.images && data.images.length > 0) {
                            let galleryHTML = `<div class="swiper modal-gallery relative mb-4"><div class="swiper-wrapper">`;
                            data.images.forEach(imgUrl => { galleryHTML += `<div class="swiper-slide"><img src="${imgUrl}" class="w-full h-auto rounded-md" onerror="this.onerror=null;this.src='https://placehold.co/800x600/eeeeee/999999?text=Image+introuvable';"></div>`; });
                            galleryHTML += `</div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>`;
                            contentHTML = galleryHTML + contentHTML;
                        }
                        modalBody.innerHTML = contentHTML;
                        if (data.images && data.images.length > 0) {
                            modalSwiper = new Swiper('.modal-gallery', { loop: true, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } });
                        }
                        modal.classList.add('active');
                        lucide.createIcons();
                    }
                });
            });

            const closeModal = () => {
                modal.classList.remove('active');
                if (modalSwiper) { modalSwiper.destroy(true, true); modalSwiper = null; }
            };
            modalClose.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => { if (e.target === modal) { closeModal(); } });
        }

        const revealElements = document.querySelectorAll('.reveal');
        if(revealElements.length > 0) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
            }, { threshold: 0.1 });
            revealElements.forEach(el => revealObserver.observe(el));
        }

        const statObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => { if (entry.isIntersecting) { const el = entry.target; const endValue = parseInt(el.dataset.value, 10); animateValue(el, 0, endValue, 2000); observer.unobserve(el); } });
        }, { threshold: 0.5 });
        document.querySelectorAll('.stat-value').forEach(el => { const unit = el.dataset.unit || ''; const prefix = el.dataset.prefix || ''; el.textContent = prefix + '0' + unit; statObserver.observe(el); });

        function animateValue(obj, start, end, duration) {
            let startTimestamp = null;
            const unit = obj.dataset.unit || '';
            const prefix = obj.dataset.prefix || '';
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                obj.innerHTML = prefix + Math.floor(progress * (end - start) + start) + unit;
                if (progress < 1) { window.requestAnimationFrame(step); }
            };
            window.requestAnimationFrame(step);
        }

        const video = document.getElementById('bg-video');
        if (video) {
            window.addEventListener('scroll', () => { const scrollPosition = window.pageYOffset; video.style.transform = `translateX(-50%) translateY(calc(-50% + ${scrollPosition * 0.2}px))`; });
        }
    }

    // This runs last on all pages to create all icons
    lucide.createIcons();
});