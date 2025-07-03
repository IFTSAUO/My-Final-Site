const { Pool } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    const { cin, dob } = JSON.parse(event.body);

    // This query now selects all the necessary information
    const query = `
      SELECT full_name, cin, to_char(date_of_birth, 'DD/MM/YYYY') as dob, num_inscription, notes 
      FROM students 
      WHERE cin = $1 AND date_of_birth = $2
    `;
    const values = [cin, dob];

    const { rows } = await pool.query(query, values);
    await pool.end();

    if (rows.length > 0) {
      return { statusCode: 200, body: JSON.stringify(rows[0]) };
    } else {
      return { statusCode: 404, body: JSON.stringify({ message: 'Aucun étudiant trouvé avec ces informations.' }) };
    }
  } catch (error) {
    console.error(error);
    await pool.end();
    return { statusCode: 500, body: JSON.stringify({ message: 'Erreur de base de données.' }) };
  }
};