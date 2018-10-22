(function(ng) {

  ng.module('mainApp').service('enchantService',['$hs', _fn]);

  var _ENCHANT_TABLE = [

    // ANCIENT GEAR //
    [// +0,  +1,  +2,  +3,  +4,  +5,  +6,  +7,  +8,  +9, +10, +11, +12, +13, +14
      [ 88,  88,  88,  68,  68,  68,  48,  48,  48,  28,  28,  28,  28,  28,  28], //Ancient Stone
      [100, 100, 100,  88,  88,  88,  68,  68,  68,  48,  48,  48,  48,  48,  48], //Legendary Stone
      [100, 100, 100,  98,  98,  98,  78,  78,  78,  58,  58,  58,  58,  58,  58]  //Ultimate Stone
    ],

    // LEGENDARY GEAR //
    [// +0,  +1,  +2,  +3,  +4,  +5,  +6,  +7,  +8,  +9, +10, +11, +12, +13, +14
      [ 55,  55,  55,  35,  35,  35,  15,  15,  15,   5,   5,   5,   5,   5,   5], //Ancient Stone
      [100, 100, 100,  85,  85,  85,  65,  65,  65,  45,  45,  45,  45,  45,  45], //Legendary Stone
      [100, 100, 100,  95,  95,  95,  75,  75,  75,  55,  55,  55,  55,  55,  55]  //Ultimate Stone
    ],

    // ULTIMATE GEAR //
    [// +0,  +1,  +2,  +3,  +4,  +5,  +6,  +7,  +8,  +9, +10, +11, +12, +13, +14
      [ 52,  52,  52,  32,  32,  32,  12,  12,  12,   5,   5,   5,   5,   5,   5], //Ancient Stone
      [100, 100, 100,  82,  82,  82,  62,  62,  62,  42,  42,  42,  42,  42,  42], //Legendary Stone
      [100, 100, 100,  92,  92,  92,  72,  72,  72,  52,  52,  52,  52,  52,  52]  //Ultimate Stone
    ]
  ];

  var _CRITICAL_CHANCE = 90;

  function _fn($hs) {
    var $this = this;

    var $q = $hs.$q;
    var $log = $hs.$instantiate('$log');

    /**
     * Retrieves chance to enchant
     * @param gearType
     * @param stoneType
     * @param enchantLevel
     * @return {*} Chance to enchant
     */
    $this.getChance = function(gearType, stoneType, enchantLevel) {

      enchantLevel = parseInt(enchantLevel);

      //If enchant level isn't a number or isn't in range, return null (Cannot be enchanted)
      if(isNaN(enchantLevel) || enchantLevel < 0 || enchantLevel >= 15) { return null; }

      var _gearRatios = _ENCHANT_TABLE[_gearTypeIndex(gearType)];
      var _stoneRatios = _gearRatios[_stoneTypeIndex(stoneType)];
      return _stoneRatios[enchantLevel];
    };

    /**
     * Enchant service
     * @param gearType
     * @param stoneType
     * @param enchantLevel
     * @return {*} new enchant level
     */
    $this.enchant = function(gearType, stoneType, enchantLevel) {

      enchantLevel = parseInt(enchantLevel);

      //If enchant level isn't a number or isn't in range, return null (Cannot be enchanted)
      if(isNaN(enchantLevel) || enchantLevel < 0 || enchantLevel >= 15) { return null; }

      var _gearRatios = _ENCHANT_TABLE[_gearTypeIndex(gearType)];
      var _stoneRatios = _gearRatios[_stoneTypeIndex(stoneType)];
      var _currentRatio = 100 - _stoneRatios[enchantLevel];

      var _chance = Math.round(Math.random() * 100);

      //SUCCESS!
      if(_chance >= _currentRatio) {

        var _critChance = Math.round(Math.random() * 100);

        //Check if was critical chance
        if(_critChance > _CRITICAL_CHANCE) {
          return Math.min(15, enchantLevel + 2);
        }
        else {
          return Math.min(15, enchantLevel + 1);
        }
      }
      //FAILURE
      else {
        if(stoneType == 'ultimate') { return enchantLevel; }
        else if(enchantLevel >= 10) { return 10; }
        else { return Math.max(0, enchantLevel - 1); }
      }

    };

    //Get index with a gear type
    function _gearTypeIndex(gearType) {
      switch(gearType) {
        case 'ancient': return 0;
        case 'legendary': return 1;
        case 'ultimate': return 2;
        default: return 0;
      }
    }

    //Get index with stone type
    function _stoneTypeIndex(stoneType) {
      switch(stoneType) {
        case 'ancient': return 0;
        case 'legendary': return 1;
        case 'ultimate': return 2;
        default: return 0;
      }
    }
  }

})(angular);