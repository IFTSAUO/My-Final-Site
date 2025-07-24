// netlify/functions/view-pdf.js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  const { nomFichier } = event.queryStringParameters;
  if (!nomFichier || nomFichier.includes('..') || nomFichier.includes('/')) {
    return { statusCode: 400, body: 'Nom de fichier invalide.' };
  }
  
  // CHEMIN CORRIGÉ : On utilise __dirname pour un chemin robuste en production
  const pdfPath = path.resolve(__dirname, '..', '..', 'private', 'bulletins', nomFichier);

  try {
    const pdfBytes = await fs.readFile(pdfPath);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${nomFichier}"`, 
      },
      body: Buffer.from(pdfBytes).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Erreur dans view-pdf.js:', error);
    // Log pour voir le chemin exact qui a échoué
    console.error('Chemin tenté :', pdfPath);
    return { statusCode: 404, body: 'Bulletin introuvable.' };
  }
};
