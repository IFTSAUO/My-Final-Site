// netlify/functions/get-results.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // CHEMIN CORRIGÉ pour l'environnement de production Netlify
    const dataPath = path.resolve(__dirname, 'private/donnees.json');
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
