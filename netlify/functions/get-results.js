// netlify/functions/get-results.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // --- LIGNES DE DÉBOGAGE ---
    // Affiche le contenu du répertoire où la fonction s'exécute
    const currentDirectoryFiles = fs.readdirSync(__dirname);
    console.log("Fichiers présents dans le répertoire de la fonction :", currentDirectoryFiles);
    // --- FIN DES LIGNES DE DÉBOGAGE ---

    const dataPath = path.resolve(__dirname, '_data/donnees.json');
    const etudiantsData = fs.readFileSync(dataPath, 'utf8');
    const etudiants = JSON.parse(etudiantsData);

    const { cin, dob } = JSON.parse(event.body);

    if (!cin || !dob) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Les données fournies sont incomplètes.' }) };
    }

    const etudiantTrouve = etudiants.find(e => e.cin.toUpperCase() === cin.toUpperCase() && e.dateNaissance === dob);

    if (etudiantTrouve) {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          nomFichier: etudiantTrouve.nomFichierPDF,
          nomComplet: etudiantTrouve.nomComplet 
        })
      };
    } else {
      return { 
        statusCode: 404, 
        body: JSON.stringify({ message: 'Aucun étudiant trouvé avec ces informations.' }) 
      };
    }
  } catch (error) {
    console.error("Erreur dans get-results.js:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Erreur interne du serveur.' }) 
    };
  }
};
