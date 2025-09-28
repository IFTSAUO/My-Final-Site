document.addEventListener('DOMContentLoaded', function() {

    // --- Logique générale (menu, année, etc.) ---
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
    
    // --- Logique du formulaire de demande de document ---
    const form = document.getElementById('scolarite-form');
    if (form) {
        const nomInput = document.getElementById('nom');
        const prenomInput = document.getElementById('prenom');
        const cinInput = document.getElementById('cin');
        const typeDocumentSelect = document.getElementById('type_document');
        const autreDocumentContainer = document.getElementById('autre-document-container');
        const autreDocumentInput = document.getElementById('autre_document_nom');
        const numInscriptionInput = document.getElementById('num_inscription');
        const validationCheck = document.getElementById('validation-check');
        const submitButton = document.getElementById('submit-button');

        // Fonction pour filtrer les entrées clavier
        const filterInput = (element, regex) => {
            element.addEventListener('input', (e) => {
                const oldValue = e.target.value;
                const newValue = oldValue.replace(regex, '');
                if (oldValue !== newValue) {
                    e.target.value = newValue.toUpperCase();
                } else {
                    e.target.value = oldValue.toUpperCase();
                }
            });
        };

        // 1. Nom et Prénom : Lettres uniquement, conversion en majuscules
        filterInput(nomInput, /[^a-zA-Z\s-]/g);
        filterInput(prenomInput, /[^a-zA-Z\s-]/g);

        // 2. CIN/Passeport : Lettres et chiffres uniquement, conversion en majuscules
        filterInput(cinInput, /[^a-zA-Z0-9]/g);
        
        // 3. Champ "Autre" pour le type de document
        typeDocumentSelect.addEventListener('change', () => {
            if (typeDocumentSelect.value === 'autre') {
                autreDocumentContainer.classList.remove('hidden');
                autreDocumentInput.setAttribute('required', 'required');
            } else {
                autreDocumentContainer.classList.add('hidden');
                autreDocumentInput.removeAttribute('required');
                autreDocumentInput.value = ''; // Vider le champ si on change d'avis
            }
        });
        filterInput(autreDocumentInput, /[^a-zA-Z\s-]/g); // Filtre pour le champ "autre"

        // 4. Numéro d'inscription : Chiffres et "/" uniquement
        numInscriptionInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9/]/g, '');
        });

        // 5. Validation de la case à cocher pour activer le bouton
        const toggleSubmitButton = () => {
            submitButton.disabled = !validationCheck.checked;
        };
        
        validationCheck.addEventListener('change', toggleSubmitButton);
        
        // État initial du bouton
        toggleSubmitButton();
        
        // Affichage du message de succès si l'URL contient ?success=true
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('success')) {
            const formContainer = document.getElementById('form-container');
            const successMessage = document.getElementById('success-message');
            if (formContainer && successMessage) {
                formContainer.classList.add('hidden');
                successMessage.classList.remove('hidden');
            }
        }
    }
});