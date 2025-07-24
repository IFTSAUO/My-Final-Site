// netlify/functions/get-results.js

const etudiants = require('./donnees.json');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cin, dob } = JSON.parse(event.body);

    if (!cin || !dob) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Le CIN et la date de naissance sont requis.' }) };
    }

    // CORRECTION : On convertit le CIN du fichier et le CIN saisi en majuscules avant de les comparer.
    const etudiantTrouve = etudiants.find(e => e.cin.toUpperCase() === cin.toUpperCase() && e.dateNaissance === dob);

    if (etudiantTrouve) {
      return {
        statusCode: 200,
        body: JSON.stringify(etudiantTrouve)
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Aucun étudiant trouvé. Vérifiez les informations saisies.' })
      };
    }
  } catch (error) {
    console.error('Erreur de la fonction:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Une erreur interne du serveur est survenue.' })
    };
  }
};