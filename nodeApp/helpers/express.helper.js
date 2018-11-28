(() =>  {

  class ExpressHelper {
    constructor() {}

    /**
     * Helps to send not Valid message
     * @param response
     * @param message
     */
    notValid(response, message) {
      response.status(400);
      response.json({
        'message': message,
      });
    }
  }


  module.exports = new ExpressHelper();

})();