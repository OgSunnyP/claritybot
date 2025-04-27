const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const analyze = require('./analyze');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Local /analyze endpoint
app.post('/analyze', analyze);

app.get('*', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
