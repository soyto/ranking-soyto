(()=> {
  const bcrypt = require('bcrypt');

  class User {
    constructor() {
      this.email = null;
      this.username = null;
      this.password = null;
      this.uuid = null;
    }

    /**
     * Checks if current password is the same as used
     * @param password
     * @return {Promise.<*>}
     */
    async checkPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  module.exports = User;

})();