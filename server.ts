const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const apiKey = process.env.STEAM_API_KEY;

app.get('/steam-api/*', (req, res) => {
  const apiUrl = `https://api.steampowered.com/${req.params[0]}?key=${apiKey}`;
  axios.get(apiUrl, { params: req.query })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Proxy server is running on port', process.env.PORT || 3001);
});
