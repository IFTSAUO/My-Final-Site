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

    // --- ✨ NEW: Logic for resultats.html ✨ ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        // Initialize the date picker calendar
        const dobPicker = flatpickr("#dob-input", {
            dateFormat: "Y-m-d", // Format sent to the server (YYYY-MM-DD)
            altInput: true,
            altFormat: "d-m-Y", // Format the user sees (DD-MM-YYYY)
            locale: "fr"
        });

        const resultsContainer = document.getElementById('results-container');
        const cinInput = document.getElementById('cin-input');

        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the form from reloading the page
            
            const cin = cinInput.value;
            const dob = dobPicker.selectedDates[0] ? dobPicker.selectedDates[0].toISOString().split('T')[0] : '';

            if (!cin || !dob) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p class="font-bold">Erreur</p><p>Veuillez remplir tous les champs.</p></div>`;
                return;
            }

            resultsContainer.innerHTML = '<p class="text-center text-stone-600">Recherche en cours...</p>';

            try {
                // Securely call our Netlify Function
                const response = await fetch('/.netlify/functions/get-results', {
                    method: 'POST',
                    body: JSON.stringify({ cin, dob })
                });

                // If no student was found (404 error)
                if (!response.ok) {
                    const errorData = await response.json();
                    resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p class="font-bold">Erreur</p><p>${errorData.message || 'Étudiant non trouvé.'}</p></div>`;
                    return;
                }

                // If we found the student, display the results
                const studentData = await response.json();
                resultsContainer.innerHTML = `
                    <div class="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
                        <h3 class="text-2xl font-bold text-primary mb-4">${studentData.full_name}</h3>
                        <p class="text-stone-700 whitespace-pre-wrap">${studentData.notes}</p>
                    </div>
                `;

            } catch (error) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p class="font-bold">Erreur</p><p>Impossible de contacter le serveur. Veuillez réessayer plus tard.</p></div>`;
            }
        });
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

    // --- Logic for index.html ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => { preloader.classList.add('hide'); }, 500);
        });
        // The rest of the index.html logic (Swiper, modals, etc.) would go here
    }

    // This runs last on all pages to create all icons
    lucide.createIcons();
});