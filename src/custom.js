// --- ✨ Logique complète pour la page d'accueil et le reste du site ---

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Logique générale (toutes les pages) ---
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    const yearSpan = document.getElementById("year");
    const preloader = document.getElementById('preloader');

    // Cacher le preloader une fois que tout (images, etc.) est chargé
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('hide');
        }
    });

    // Menu mobile
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Année dans le footer
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // --- 2. Logique pour la page d'accueil (index.html) ---
    // S'assure que ce code ne s'exécute que sur la page d'accueil
    if (document.getElementById('news-slider-wrapper')) {
        // ... (La logique pour le slider des actualités reste la même) ...
    }


    // --- 3. Logique pour la page resultats.html ---
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        
        // --- BASE DE DONNÉES DES ÉTUDIANTS (VIDÉE POUR SÉCURITÉ) ---
        const studentDatabase = {
            //
            // 🚨 IMPORTANT: Les données des étudiants ont été retirées ici pour des raisons de sécurité.
            // Pour que la recherche fonctionne, vous devrez les ajouter en suivant le format ci-dessous,
            // ou, de préférence, les charger depuis une base de données sécurisée via un backend.
            //
            // Exemple de format pour un étudiant :
            // "CIN12345": { dob: "YYYY-MM-DD", fullName: "Prénom Nom", numInscription: "XX/YYYY", notes: { "Module 1": {"Note": "15.5"}, "Module 2": {"Note": "14"} } },
            // "CIN67890": { dob: "YYYY-MM-DD", fullName: "Autre Prénom Nom", numInscription: "XY/YYYY", notes: { ... } },
            //
        };

        const dobPicker = flatpickr("#dob-input", {
            dateFormat: "Y-m-d", altInput: true, altFormat: "d-m-Y", locale: "fr"
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
                // La logique d'affichage des résultats reste la même
                let personalInfoHtml = `<div class="bg-white p-6 rounded-lg shadow-lg mb-6"><h3 class="text-2xl font-bold text-primary mb-4">${studentData.fullName}</h3><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-stone-700"><div><strong>N° d'inscription:</strong> ${studentData.numInscription || 'N/A'}</div><div><strong>N° CIN:</strong> ${cin}</div><div class="sm:col-span-2"><strong>Date de naissance:</strong> ${dobPicker.input.value}</div></div></div>`;
                let resultsTableHtml = `<div class="bg-white p-6 rounded-lg shadow-lg"><h4 class="text-xl font-bold text-primary mb-4">Relevé de notes</h4><div class="overflow-x-auto"><table class="w-full min-w-full text-left"><thead class="bg-stone-50"><tr><th class="p-3 font-semibold text-stone-600">Module / Matière</th><th class="p-3 font-semibold text-stone-600 text-right">Note</th></tr></thead>`;
                if (studentData.notes && Object.keys(studentData.notes).length > 0) {
                    for (const moduleKey in studentData.notes) {
                        const moduleDisplayName = moduleKey.split(': ')[1] || moduleKey;
                        resultsTableHtml += `<tbody class="border-t border-stone-200"><tr class="bg-stone-100"><td colspan="2" class="p-3 font-bold text-stone-700">${moduleDisplayName}</td></tr>`;
                        const subjects = studentData.notes[moduleKey];
                        for (const subjectName in subjects) {
                            resultsTableHtml += `<tr class="border-t border-stone-100"><td class="p-3 pl-8 text-stone-600">${subjectName}</td><td class="p-3 text-stone-800 font-medium text-right">${subjects[subjectName]}</td></tr>`;
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

    // --- 4. Animations et icônes (toutes les pages) ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    lucide.createIcons();
});