// netlify/functions/download-pdf.js
const { PDFDocument, rgb, degrees } = require('pdf-lib');
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  const { nomFichier } = event.queryStringParameters;
  const pdfPath = path.resolve(process.cwd(), 'private', 'bulletins', nomFichier);

  try {
    const existingPdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText('Copie électronique', {
        x: width / 2 - 150,
        y: height / 2,
        size: 50,
        color: rgb(0.75, 0.75, 0.75),
        opacity: 0.5,
        rotate: degrees(45),
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
    return { statusCode: 500, body: 'Erreur lors de la génération du PDF.' };
  }
};