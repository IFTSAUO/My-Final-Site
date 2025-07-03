// Import the tool we just installed to connect to the database
const { Client } = require('pg');

exports.handler = async (event) => {
  // Create a new database client
  const client = new Client({
    // The connection string is automatically provided by Netlify
    // and stored in an environment variable.
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Get the cin and dob from the request sent by the browser
    const { cin, dob } = JSON.parse(event.body);

    // Connect to the database
    await client.connect();

    // This is our secure SQL query. Using $1 and $2 prevents SQL injection attacks.
    const query = `
      SELECT full_name, notes FROM students 
      WHERE cin = $1 AND date_of_birth = $2
    `;

    // The values to safely insert into the query
    const values = [cin, dob];

    // Execute the query
    const result = await client.query(query, values);

    // If we found a student, send their data back
    if (result.rows.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.rows[0])
      };
    } else {
      // If no student was found, send a 404 Not Found error
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Aucun étudiant trouvé avec ces informations.' })
      };
    }

  } catch (error) {
    // If there was a server error, send a 500 error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erreur du serveur.', error: error.message })
    };
  } finally {
    // Always close the database connection
    await client.end();
  }
};