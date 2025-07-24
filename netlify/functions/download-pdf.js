// netlify/functions/download-pdf.js (Version avec filigrane sur deux lignes)

const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  const { nomFichier } = event.queryStringParameters;
  if (!nomFichier || nomFichier.includes('..') || nomFichier.includes('/')) {
    return { statusCode: 400, body: 'Nom de fichier invalide.' };
  }
  
  const pdfPath = path.resolve(process.cwd(), 'private', 'bulletins', nomFichier);

  try {
    const existingPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const watermarkFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const pages = pdfDoc.getPages();
    // --- TEXTE DU FILIGRANE SUR DEUX LIGNES ---
    const watermarkLine1 = 'ELECTRONIC';
    const watermarkLine2 = 'COPY';
    const footerText = "Ce bulletin est un document électronique. Veuillez consulter l'administration pour récupérer votre copie originale.";

    for (const page of pages) {
      const { width, height } = page.getSize();

      const watermarkSize = 50; // Taille adaptée
      // On mesure la largeur de chaque ligne pour les centrer
      const watermarkWidth1 = watermarkFont.widthOfTextAtSize(watermarkLine1, watermarkSize);
      const watermarkWidth2 = watermarkFont.widthOfTextAtSize(watermarkLine2, watermarkSize);
      
      // --- DESSIN DU FILIGRANE SUR DEUX LIGNES ---
      
      // Dessine la première ligne ("ELECTRONIC")
      page.drawText(watermarkLine1, {
        x: (width - watermarkWidth1) / 2,
        y: height / 3 + 15, // Rapproché du centre
        size: watermarkSize,
        font: watermarkFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.3,
        rotate: degrees(45),
      });

      // Dessine la deuxième ligne ("COPY")
      page.drawText(watermarkLine2, {
        x: (width - watermarkWidth2) / 2,
        y: height / 3 - 15, // Rapproché du centre
        size: watermarkSize,
        font: watermarkFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.3,
        rotate: degrees(45),
      });


      // --- PIED DE PAGE (INCHANGÉ) ---
      const footerSize = 8;
      const footerWidth = footerFont.widthOfTextAtSize(footerText, footerSize);
      page.drawText(footerText, {
        x: (width - footerWidth) / 2,
        y: 20,
        size: footerSize,
        font: footerFont,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    const pdfBytes = await pdfDoc.save();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bulletin-${nomFichier}"`,
      },
      body: Buffer.from(pdfBytes).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Erreur dans download-pdf.js:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Erreur lors de la génération du PDF.' }) };
  }
};
