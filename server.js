const $log = require('./nodeApp/helpers').log;
const $config = require('./nodeApp/config');
const express = require('express');
const app = express();

app.use('/seo/', require('./nodeApp/express-routes/seo'));
app.use('/scrapper/', require('./nodeApp/express-routes/scrapper'));

app.listen($config.server.port, () => {
  $log.debug('Server started on %s', $config.server.port);
});