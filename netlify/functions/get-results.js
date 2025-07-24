// netlify/functions/get-results.js
const etudiants = require('./donnees.json');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { cin, dob } = JSON.parse(event.body);
    const etudiantTrouve = etudiants.find(e => e.cin.toUpperCase() === cin.toUpperCase() && e.dateNaissance === dob);

    if (etudiantTrouve) {
      return {
        statusCode: 200,
        body: JSON.stringify({ nomFichier: etudiantTrouve.nomFichierPDF })
      };
    } else {
      return { statusCode: 404, body: JSON.stringify({ message: 'Aucun étudiant trouvé.' }) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Erreur interne du serveur.' }) };
  }
};