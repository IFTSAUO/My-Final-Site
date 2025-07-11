// netlify/functions/get-results.js

// On importe directement le fichier JSON qui est dans le même dossier.
const etudiants = require('./donnees.json');

exports.handler = async (event) => {
  // On vérifie que la méthode est bien POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cin, dob } = JSON.parse(event.body);

    if (!cin || !dob) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Le CIN et la date de naissance sont requis.' }) };
    }

    // On cherche l'étudiant dans le tableau. La date est comparée comme du texte, ce qui est parfait
    // car le format "jj/mm/aaaa" est utilisé partout.
    const etudiantTrouve = etudiants.find(e => e.cin === cin && e.dateNaissance === dob);

    if (etudiantTrouve) {
      // On a trouvé l'étudiant, on renvoie ses données
      return {
        statusCode: 200,
        body: JSON.stringify(etudiantTrouve)
      };
    } else {
      // Aucun étudiant trouvé
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