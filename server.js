const $log = require('./nodeApp/helpers').log;
const $config = require('./nodeApp/config');
const express = require('express');
const app = express();

//Logger middleware
app.use((req, res, next) => {
  $log.debug('Received -> %s', req.url);
  next();
});

app.use('/seo/', require('./nodeApp/express-routes/seo'));

app.listen($config.server.port, () => {
  $log.debug('Server started on %s', $config.server.port);
});