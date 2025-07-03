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

        // Input validation for the form
        const nomInput = document.getElementById("nom");
        const prenomInput = document.getElementById("prenom");
        const numInscriptionInput = document.getElementById("num_inscription");
        const cinInput = document.getElementById("cin");

        const validateName = e => { e.target.value = e.target.value.replace(/[^a-zA-Z\u00C0-\u017F\u0600-\u06FF\s]/g, ""); };

        if (nomInput) nomInput.addEventListener("input", validateName);
        if (prenomInput) prenomInput.addEventListener("input", validateName);
        if (numInscriptionInput) numInscriptionInput.addEventListener("input", e => { e.target.value = e.target.value.replace(/[^0-9/]/g, ""); });
        if (cinInput) cinInput.addEventListener("input", e => { e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, ""); });

        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get('success');
        if (success === 'true' && document.getElementById("success-message")) {
            const formContainer = document.getElementById("form-container");
            const successMessage = document.getElementById("success-message");
            if (formContainer) formContainer.style.display = "none";
            if (successMessage) successMessage.classList.remove("hidden");
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
        // The rest of the student search logic would go here
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

    // Logic for index.html
    const preloader = document.getElementById('preloader');
    if(preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => { preloader.classList.add('hide'); }, 500); // Reduced delay
        });

        const newsData = { /* ... Your news data object ... */ };
        const newsWrapper = document.getElementById('news-slider-wrapper');
        if(newsWrapper) {
             // The logic to create news cards and initialize Swiper would go here
        }
        const modal = document.getElementById('news-modal');
        if(modal) {
            // The logic for the modal would go here
        }
        const revealElements = document.querySelectorAll('.reveal');
        if(revealElements.length > 0) {
            // The scroll reveal logic would go here
        }
        const statValues = document.querySelectorAll('.stat-value');
        if(statValues.length > 0) {
            // The animated counter logic would go here
        }
        const video = document.getElementById('bg-video');
        if(video) {
            // The parallax video logic would go here
        }
    }

    // This runs last on all pages to create all icons
    lucide.createIcons();
});