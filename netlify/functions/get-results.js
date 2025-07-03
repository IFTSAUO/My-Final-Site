// Temporary test function to check the connection
exports.handler = async (event) => {
  // Get the data the browser sent
  const { cin, dob } = JSON.parse(event.body);

  // Immediately send back a success message without talking to the database
  return {
    statusCode: 200,
    body: JSON.stringify({
      full_name: `Test Successful for CIN: ${cin}`,
      notes: `The connection to the function is working. Received DOB: ${dob}`
    })
  };
};