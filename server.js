const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Redirigez les appels API vers le préfixe souhaité
  server.use('/api_comparateur/middleware', require('./routes/middleware'));

  // Gère le reste des routes avec Next.js
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3111;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Prêt sur http://localhost:${PORT}`);
  });
});
