// Import necessary modules and files
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Define routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
