(() => {

  module.exports = {};

  module.exports.database = require('./database');


  module.exports.user = require('./user.service');
  module.exports.handlebars = require('./handlebars.service');

})();