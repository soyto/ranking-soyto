(async () => {
  const $log = require('./nodeApp/helpers').log;
  const $config = require('./config');
  const express = require('express');
  const $dbConnection = require('./nodeApp/services').database.connection;

  const app = express();

  app.use('/v1/', require('./nodeApp/express-routes/v1'));
  app.use('/seo/', require('./nodeApp/express-routes/seo'));
  app.use('/scrapper/', require('./nodeApp/express-routes/scrapper'));

  try {

    //Start database connection
    $log.debug('Initiating database...');
    await $dbConnection.init();

    app.listen($config.server.port, () => {
      $log.debug('Server started on %s', $config.server.port);
    });

  } catch(error) {
    console.error(error);
  }
})();
