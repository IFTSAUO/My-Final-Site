import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    
    // --- PARTIE 1 : LOGIN (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Redirection si déjà connecté
        onAuthStateChanged(auth, (user) => {
            if (user) window.location.href = 'espace-etudiant.html';
        });

        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const identifiant = document.getElementById('identifiant').value.trim().toUpperCase();
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-message');
            const loginBtn = document.getElementById('login-btn');
            
            errorMsg.style.display = 'none';
            loginBtn.disabled = true;
            loginBtn.querySelector('span').textContent = "Connexion...";

            try {
                const email = identifiant + "@iftsau.ma";
                await signInWithEmailAndPassword(auth, email, password);
                // La redirection est gérée par onAuthStateChanged ou ci-dessous
                window.location.href = 'espace-etudiant.html';
            } catch (error) {
                console.error(error);
                errorMsg.style.display = 'block';
                errorMsg.textContent = "Identifiant ou mot de passe incorrect.";
                loginBtn.disabled = false;
                loginBtn.querySelector('span').textContent = "Se connecter";
            }
        });
    }

    // --- PARTIE 2 : ESPACE ÉTUDIANT (espace-etudiant.html) ---
    const pageTitle = document.getElementById('page-title'); // indicateur qu'on est sur le dashboard
    if (pageTitle) {
        let currentUserCIN = "";

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = 'login.html'; // Sécurité
                return;
            }

            // Récupérer le CIN depuis l'email (ex: SB48521@iftsau.ma -> SB48521)
            currentUserCIN = user.email.split('@')[0].toUpperCase();

            // Charger les infos depuis Firestore
            const docRef = doc(db, "etudiants", currentUserCIN);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Remplir l'interface
                document.getElementById('student-name').textContent = `${data.nom} ${data.prenom}`;
                document.getElementById('student-id').textContent = `${data.cin} | ${data.filiere}`;
                document.getElementById('avatar-initials').textContent = data.prenom.charAt(0) + data.nom.charAt(0);

                // --- GESTION DU PREMIER LOGIN ---
                if (data.estNouveau === true) {
                    showSetupModal();
                }

            } else {
                console.error("Document étudiant introuvable !");
            }
        });

        // Déconnexion
        document.getElementById('logout-btn').addEventListener('click', () => {
            signOut(auth).then(() => window.location.href = 'login.html');
        });

        // --- FONCTIONS DU WIZARD (Modales) ---
        window.showSetupModal = function() {
            const modal = document.getElementById('setup-modal');
            modal.style.visibility = 'visible';
            modal.style.opacity = '1';
            document.getElementById('setup-content').style.transform = 'scale(1)';
        }

        window.saveEmail = async function() {
            const emailInput = document.getElementById('recovery-email-input').value;
            if(emailInput.includes('@')) {
                // Sauvegarder dans Firestore
                const docRef = doc(db, "etudiants", currentUserCIN);
                await updateDoc(docRef, { emailRecuperation: emailInput });
                nextStep(); // Passer à l'étape suivante
            } else {
                alert("Veuillez entrer un email valide.");
            }
        }

        window.nextStep = function() {
            document.getElementById('step-email').classList.add('hidden');
            document.getElementById('step-password').classList.remove('hidden');
        }

        window.changePassword = async function() {
            const pwd = document.getElementById('new-pwd').value;
            const confirm = document.getElementById('confirm-pwd').value;
            const errorText = document.getElementById('pwd-error');

            if(pwd.length < 6) {
                errorText.textContent = "Le mot de passe doit faire au moins 6 caractères.";
                errorText.classList.remove('hidden');
                return;
            }
            if(pwd !== confirm) {
                errorText.textContent = "Les mots de passe ne correspondent pas.";
                errorText.classList.remove('hidden');
                return;
            }

            try {
                // Changer le mot de passe dans Firebase Auth
                await updatePassword(auth.currentUser, pwd);
                alert("Mot de passe modifié avec succès !");
                finishSetup();
            } catch (error) {
                errorText.textContent = "Erreur: " + error.message;
                errorText.classList.remove('hidden');
            }
        }

        window.finishSetup = async function() {
            // Marquer que l'étudiant n'est plus nouveau
            const docRef = doc(db, "etudiants", currentUserCIN);
            await updateDoc(docRef, { estNouveau: false });
            
            // Fermer le modal
            const modal = document.getElementById('setup-modal');
            modal.style.opacity = '0';
            setTimeout(() => { modal.style.visibility = 'hidden'; }, 300);
        }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
});

// Fonction navigation (inchangée)
window.showSection = function(sectionId) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active');
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        if(btn.getAttribute('onclick').includes(sectionId)) btn.classList.add('active');
    });
    // Fermer menu mobile
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth < 768 && sidebar && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
};