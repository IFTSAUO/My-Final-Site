// netlify/functions/download-pdf.js
const { PDFDocument, rgb, degrees, StandardFonts } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  const { nomFichier } = event.queryStringParameters;
  if (!nomFichier || nomFichier.includes('..') || nomFichier.includes('/')) {
    return { statusCode: 400, body: 'Nom de fichier invalide.' };
  }
  
  // CHEMIN FINAL : On utilise un chemin simple et robuste à l'intérieur du dossier des fonctions
  const pdfPath = path.resolve(__dirname, '_data', 'bulletins', nomFichier);

  try {
    const existingPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const watermarkFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const footerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const pages = pdfDoc.getPages();
    const watermarkLine1 = 'ELECTRONIC';
    const watermarkLine2 = 'COPY';
    const footerText = "Ce bulletin est un document électronique. Veuillez consulter l'administration pour récupérer votre copie originale.";

    for (const page of pages) {
      const { width, height } = page.getSize();

      const watermarkSize = 50;
      const watermarkWidth1 = watermarkFont.widthOfTextAtSize(watermarkLine1, watermarkSize);
      const watermarkWidth2 = watermarkFont.widthOfTextAtSize(watermarkLine2, watermarkSize);
      
      page.drawText(watermarkLine1, {
        x: (width - watermarkWidth1) / 2,
        y: height / 3 + 15,
        size: watermarkSize,
        font: watermarkFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.3,
        rotate: degrees(45),
      });

      page.drawText(watermarkLine2, {
        x: (width - watermarkWidth2) / 2,
        y: height / 3 - 15,
        size: watermarkSize,
        font: watermarkFont,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.3,
        rotate: degrees(45),
      });

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
