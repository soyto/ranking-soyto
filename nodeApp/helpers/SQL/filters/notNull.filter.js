(() => {

  require('../../../extensions');

  const regexp = /^[a-z0-9_-]*$/;

  class NotNullFilter {
    constructor(key) {
      this.key = key;
    }

    apply() {
      if(!this.isValid()) {
        return {
          'SQL': '',
          'params': [],
        };
      }

      return {
        'SQL': '{key} IS NOT NULL'.formatUnicorn({'key': this.key}),
        'params': []
      };
    }

    isValid() {
      return regexp.test(this.key);
    }
  }


  module.exports = NotNullFilter;
})();