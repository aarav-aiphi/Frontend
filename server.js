const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the 'dist' directory (Parcel's default output directory)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle any route and return the main index.html file from 'dist'
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Set the port (default to 3000 if not specified)
const PORT = process.env.PORT || 1234;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
