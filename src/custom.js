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

    // --- Final Logic for resultats.html (Client-Side) ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        // --- ALL STUDENT DATA IS NOW STORED HERE ---
        const studentDatabase = {
            "SX20610": { dob: "2006-04-09", fullName: "ACHOU Youssra", numInscription: "01/2023", notes: {"Métier et Formation":"16.33", "Hygiène, sécurité...":"16.58", "Voirie urbaine":"15.00"} },
            "NBE734415": { dob: "2004-06-01", fullName: "ROUCHEDI Hassani Ali", numInscription: "02/2023", notes: {"Métier et Formation":"13.33", "Hygiène, sécurité...":"17.67", "Voirie urbaine":"11.17"} },
            "P378933": { dob: "2005-07-11", fullName: "AIT OUDRA Saad", numInscription: "03/2023", notes: {"Métier et Formation":"13.50", "Hygiène, sécurité...":"17.00", "Voirie urbaine":"12.33"} },
            // Add all other students here in the same format
        };

        const dobPicker = flatpickr("#dob-input", {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d-m-Y",
            locale: "fr"
        });

        const resultsContainer = document.getElementById('results-container');
        const cinInput = document.getElementById('cin-input');

        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const cin = cinInput.value.toUpperCase(); // Convert to uppercase for matching
            const dob = dobPicker.selectedDates[0] ? dobPicker.selectedDates[0].toISOString().split('T')[0] : '';

            if (!cin || !dob) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><p>Veuillez remplir tous les champs.</p></div>`;
                return;
            }

            const studentData = studentDatabase[cin];

            if (studentData && studentData.dob === dob) {
                // --- Table Building Logic ---
                let personalInfoHtml = `
                    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h3 class="text-2xl font-bold text-primary mb-4">${studentData.fullName}</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-700">
                            <div><strong>N° d'inscription:</strong> ${studentData.numInscription || 'N/A'}</div>
                            <div><strong>N° CIN:</strong> ${cin}</div>
                            <div class="sm:col-span-2"><strong>Date de naissance:</strong> ${dobPicker.input.value}</div>
                        </div>
                    </div>
                `;

                let resultsTableHtml = `
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <h4 class="text-xl font-bold text-primary mb-4">Relevé de notes</h4>
                        <table class="w-full text-left">
                            <thead class="bg-stone-50"><tr><th class="p-3 font-semibold text-stone-600">Matière</th><th class="p-3 font-semibold text-stone-600 text-right">Note</th></tr></thead>
                            <tbody>`;
                
                if (studentData.notes && Object.keys(studentData.notes).length > 0) {
                    for (const subjectName in studentData.notes) {
                        resultsTableHtml += `<tr class="border-t border-stone-100"><td class="p-3 text-stone-600">${subjectName}</td><td class="p-3 text-stone-800 font-medium text-right">${studentData.notes[subjectName]}</td></tr>`;
                    }
                } else {
                    resultsTableHtml += `<tr><td colspan="2" class="p-3 text-center text-stone-500">Pas de résultats pour le moment.</td></tr>`;
                }

                resultsTableHtml += `</tbody></table></div>`;
                resultsContainer.innerHTML = personalInfoHtml + resultsTableHtml;

            } else {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><p>Aucun étudiant trouvé avec ces informations.</p></div>`;
            }
        });
    }

    // This runs last on all pages to create all icons
    lucide.createIcons();
});