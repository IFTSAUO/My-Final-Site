// netlify/functions/get-results.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Logs pour le débogage dans l'environnement Netlify
    console.log("Répertoire actuel de la fonction (__dirname):", __dirname);
    const dataPath = path.resolve(__dirname, '_data/donnees.json');
    console.log("Tentative de lecture du fichier de données depuis :", dataPath);

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
    // Logs d'erreur plus détaillés
    console.error("!!! ERREUR CRITIQUE dans get-results.js !!!");
    console.error("La fonction n'a pas pu lire le fichier de données. Vérifiez le chemin et la structure des dossiers.");
    console.error("Chemin exact tenté :", path.resolve(__dirname, '_data/donnees.json'));
    console.error("Erreur détaillée :", error);
    
    return { 
      statusCode: 500, 
      body: JSON.stringify({ message: 'Erreur interne du serveur.' }) 
    };
  }
};
