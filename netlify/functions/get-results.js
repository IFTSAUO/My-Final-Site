// Import the official Neon serverless tool
const { Pool } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  // This automatically uses your database URL from Netlify's settings
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    const { cin, dob } = JSON.parse(event.body);

    const query = `
      SELECT full_name, COALESCE(notes, 'Pas de résultats pour le moment.') as notes 
      FROM students 
      WHERE cin = $1 AND date_of_birth = $2
    `;
    const values = [cin, dob];

    // Execute the query
    const { rows } = await pool.query(query, values);

    // End the database connection
    await pool.end();

    if (rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(rows[0])
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Aucun étudiant trouvé avec ces informations.' })
      };
    }
  } catch (error) {
    await pool.end();
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erreur de base de données.', error: error.message })
    };
  }
};