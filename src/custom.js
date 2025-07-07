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
            "SX20610": { dob: "2006-04-09", fullName: "ACHOU Youssra", numInscription: "01/2023", notes: { "M-01: Métier et Formation": { "Métier et Formation": "16,33" }, "M-02: Hygiène, sécurité...": { "Hygiène, sécurité...": "16,58" }, "M-03: Voirie urbaine": { "Voirie urbaine": "15,00" }, "M-04: Réglementation": { "Droit d'Urbanisme": "16,00", "Droit Foncier": "10,00", "Droit Administratif": "12,00" }, "M-05: Bureautique...": { "Bureautique...": "17,17" }, "M-06: Histoire et théorie...": { "Histoire et théorie...": "17,08" }, "M-07: Dessin d'architecture": { "Dessin d'architecture": "15,67", "CAO-DAO": "17,83" }, "M-08: Arts plastiques": { "Arts plastiques": "12,50" }, "M-09: Langues et Techniques...": { "Arabe Technique": "17,83", "Français Technique": "16,50" }, "M-10: Métré des corps de travaux": { "Métré": "14,83" }, "M-11: Matériaux de construction": { "Matériaux": "15,25" }, "M-12: Résistance des matériaux...": { "RDM": "14,33" }, "M-13: Cartographie...": { "Cartographie": "17,00" }, "M-14: Géométrie...": { "Géométrie descriptive": "11,33", "Statistique appliquée": "13,17" }, "M-15: Instruction de dossiers...": { "Instruction": "10,13" }, "M-16: Théorie et pratiques...": { "Théorie et pratiques": "13,83" }, "M-17: Stage d'initiation...": { "Stage": "20,00" } } },
            "NBE734415": { dob: "2004-06-01", fullName: "ROUCHEDI Hassani Ali", numInscription: "02/2023", notes: { "M-01: Métier et Formation": { "Métier et Formation": "13,33" }, "M-02: Hygiène, sécurité...": { "Hygiène, sécurité...": "17,67" }, "M-03: Voirie urbaine": { "Voirie urbaine": "11,17" }, "M-04: Réglementation": { "Droit d'Urbanisme": "11,00", "Droit Foncier": "16,33", "Droit Administratif": "12,00" }, "M-05: Bureautique...": { "Bureautique...": "12,00" }, "M-06: Histoire et théorie...": { "Histoire et théorie...": "13,33" }, "M-07: Dessin d'architecture": { "Dessin d'architecture": "13,39", "CAO-DAO": "13,17" }, "M-08: Arts plastiques": { "Arts plastiques": "12,33" }, "M-09: Langues et Techniques...": { "Français Technique": "15,50" }, "M-10: Métré des corps de travaux": { "Métré": "15,00" }, "M-11: Matériaux de construction": { "Matériaux": "13,33" }, "M-12: Résistance des matériaux...": { "RDM": "13,83" }, "M-13: Cartographie...": { "Cartographie": "14,00" }, "M-14: Géométrie...": { "Géométrie descriptive": "11,17", "Statistique appliquée": "14,33" }, "M-15: Instruction de dossiers...": { "Instruction": "12,67" }, "M-16: Théorie et pratiques...": { "Théorie et pratiques": "12,70" }, "M-17: Stage d'initiation...": { "Stage": "16,00" } } },
            // You can continue adding all other students here following the same format
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
            const cin = cinInput.value.toUpperCase().trim();
            const dob = dobPicker.selectedDates[0] ? dobPicker.selectedDates[0].toISOString().split('T')[0] : '';

            if (!cin || !dob) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p>Veuillez remplir tous les champs.</p></div>`;
                return;
            }

            const studentData = studentDatabase[cin];

            if (studentData && studentData.dob === dob) {
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
                        <div class="overflow-x-auto">
                            <table class="w-full min-w-full text-left">
                                <thead class="bg-stone-50">
                                    <tr>
                                        <th class="p-3 font-semibold text-stone-600">Module / Matière</th>
                                        <th class="p-3 font-semibold text-stone-600 text-right">Note</th>
                                    </tr>
                                </thead>
                `;

                if (studentData.notes && Object.keys(studentData.notes).length > 0) {
                    for (const moduleKey in studentData.notes) {
                        const moduleDisplayName = moduleKey.split(': ')[1] || moduleKey;
                        resultsTableHtml += `<tbody class="border-t border-stone-200"><tr class="bg-stone-100"><td colspan="2" class="p-3 font-bold text-stone-700">${moduleDisplayName}</td></tr>`;
                        const subjects = studentData.notes[moduleKey];
                        for (const subjectName in subjects) {
                            resultsTableHtml += `<tr class="border-t border-stone-100">
                                                    <td class="p-3 pl-8 text-stone-600">${subjectName}</td>
                                                    <td class="p-3 text-stone-800 font-medium text-right">${subjects[subjectName]}</td>
                                                 </tr>`;
                        }
                        resultsTableHtml += `</tbody>`;
                    }
                } else {
                     resultsTableHtml += `<tbody><tr><td colspan="2" class="p-3 text-center text-stone-500">Pas de résultats pour le moment.</td></tr></tbody>`;
                }

                resultsTableHtml += '</table></div></div>';
                resultsContainer.innerHTML = personalInfoHtml + resultsTableHtml;

            } else {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"><p>Aucun étudiant trouvé avec ces informations.</p></div>`;
            }
        });
    }

    // This runs last on all pages to create all icons
    lucide.createIcons();
});
