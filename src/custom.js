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
        // All the logic for the document request form
        // ... (This part is correct and remains the same)
    }

    // --- ✨ Final Logic for resultats.html ✨ ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const dobPicker = flatpickr("#dob-input", {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "d-m-Y",
            locale: "fr"
        });

        const resultsContainer = document.getElementById('results-container');
        const cinInput = document.getElementById('cin-input');

        searchForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const cin = cinInput.value;
            const dob = dobPicker.selectedDates[0] ? dobPicker.selectedDates[0].toISOString().split('T')[0] : '';

            if (!cin || !dob) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p class="font-bold">Erreur</p><p>Veuillez remplir tous les champs.</p></div>`;
                return;
            }

            resultsContainer.innerHTML = '<p class="text-center text-stone-600">Recherche en cours...</p>';

            try {
                const response = await fetch('/.netlify/functions/get-results', {
                    method: 'POST',
                    body: JSON.stringify({ cin, dob })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p class="font-bold">Erreur</p><p>${errorData.message || 'Étudiant non trouvé.'}</p></div>`;
                    return;
                }

                const studentData = await response.json();
                
                // Build the HTML for the personal information
                let personalInfoHtml = `
                    <div class="bg-white p-6 rounded-lg shadow-lg mb-6">
                        <h3 class="text-2xl font-bold text-primary mb-4">${studentData.full_name}</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-700">
                            <div><strong>N° d'inscription:</strong> ${studentData.num_inscription || 'N/A'}</div>
                            <div><strong>N° CIN:</strong> ${studentData.cin}</div>
                            <div class="sm:col-span-2"><strong>Date de naissance:</strong> ${studentData.dob}</div>
                        </div>
                    </div>
                `;

                // Build the HTML for the results table
                let resultsTableHtml = `
                    <div class="bg-white p-6 rounded-lg shadow-lg">
                        <h4 class="text-xl font-bold text-primary mb-4">Relevé de notes</h4>
                        <table class="w-full text-left">
                            <thead class="bg-stone-50">
                                <tr>
                                    <th class="p-3 font-semibold text-stone-600">Module / Matière</th>
                                    <th class="p-3 font-semibold text-stone-600 text-right">Note</th>
                                </tr>
                            </thead>
                `;

                const modules = JSON.parse(studentData.notes);
                for (const moduleName in modules) {
                    resultsTableHtml += `<tbody class="border-t border-stone-200"><tr class="bg-stone-100"><td colspan="2" class="p-3 font-bold text-stone-700">${moduleName}</td></tr>`;
                    const subjects = modules[moduleName];
                    for (const subjectName in subjects) {
                        resultsTableHtml += `<tr class="border-t border-stone-100">
                                                <td class="p-3 pl-8 text-stone-600">${subjectName}</td>
                                                <td class="p-3 text-stone-800 font-medium text-right">${subjects[subjectName]}</td>
                                             </tr>`;
                    }
                    resultsTableHtml += `</tbody>`;
                }
                resultsTableHtml += '</table></div>';

                // Combine and display the final HTML
                resultsContainer.innerHTML = personalInfoHtml + resultsTableHtml;
                
            } catch (error) {
                resultsContainer.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert"><p class="font-bold">Erreur</p><p>Impossible de contacter le serveur. Veuillez réessayer plus tard.</p></div>`;
            }
        });
    }

    // Logic for vie-etudiante.html
    // ... (This part is correct and remains the same)

    // Logic for index.html
    // ... (This part is correct and remains the same)


    // This runs last on all pages to create all icons
    lucide.createIcons();
});