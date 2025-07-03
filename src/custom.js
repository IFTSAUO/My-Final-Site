// --- Mobile Menu ---
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

// --- Dynamic Year in Footer ---
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// --- Form-specific Logic (demande-document.html) ---
const scolariteForm = document.getElementById('scolarite-form');
if (scolariteForm) {
    // ... (all the logic from the demande-document form)
    const typeDocumentSelect = document.getElementById("type_document");
    const autreDocumentContainer = document.getElementById("autre-document-container");
    const autreDocumentInput = document.getElementById("autre_document_nom");
    if(typeDocumentSelect){
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
    if(validationCheck){
      submitButton.disabled = true;
      validationCheck.addEventListener("change", () => {
          submitButton.disabled = !validationCheck.checked;
      });
    }
}

// Success message on form redirect
const urlParams = new URLSearchParams(window.location.search);
const success = urlParams.get('success');
if (success === 'true' && document.getElementById("success-message")) {
    const formContainer = document.getElementById("form-container");
    const successMessage = document.getElementById("success-message");
    if (formContainer) formContainer.style.display = "none";
    if (successMessage) successMessage.classList.remove("hidden");
}

// --- Logic for index.html (Swiper, etc.) ---
const newsSliderWrapper = document.getElementById('news-slider-wrapper');
if (newsSliderWrapper) {
    // ... (all the logic from index.html)
}

// --- Logic for resultats.html (Flatpickr, etc.) ---
const searchForm = document.getElementById('search-form');
if (searchForm) {
    // ... (all the logic from resultats.html)
}

// --- ✨ NEW: Logic for vie-etudiante.html Galleries ✨ ---
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

// --- Initialize Lucide Icons ---
// This should be the last thing to run, to make sure all icons are created
lucide.createIcons();