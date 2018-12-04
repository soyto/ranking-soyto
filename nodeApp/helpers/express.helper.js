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
      response.end();
    }

    /**
     * Helps sending not found
     * @param response
     */
    notFound(response) {
      response.status(404);
      response.end();
    }
  }


  module.exports = new ExpressHelper();

})();