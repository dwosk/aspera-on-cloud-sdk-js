const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/oauth/token/token_flow.html'));
});

app.use('/dist', express.static(path.join(__dirname, '..', 'dist')));
app.use(express.static(__dirname));

const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
};
const server = https.createServer(httpsOptions, app).listen(port, () => {
  console.log('Express server running at https://localhost:' + port)
});
