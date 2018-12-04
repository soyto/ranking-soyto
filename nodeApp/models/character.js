(()=> {

  class Character {
    constructor(serverName, characterId) {

      this._$serverName = serverName;
      this._$characterId = characterId;

      this.profile_pic_url = null;
      this.facebook_url = null;
      this.twitch_url = null;
      this.youtube_url = null;
      this.mouseClick_gearCalc_url = null;
      this.hide_old_names = null;
      this.hide_old_legions = null;
    }

    /**
     * Gets uuid
     * @return {string}
     */
    get uuid() {
      return this._$serverName + ':' + this._$characterId;
    }

    /**
     * Gets server name
     * @return {*}
     */
    get serverName() {
      return this._$serverName;
    }

    /**
     * Gets characterId
     * @return {*}
     */
    get characterId() {
      return this._$characterId;
    }
  }

  module.exports = Character;

})();