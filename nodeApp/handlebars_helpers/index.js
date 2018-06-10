/* global require, module, __dirname */
const fs = require('fs');
const Handlebars = require('handlebars');
const moment = require('moment');

module.exports = {};

Handlebars.registerHelper({
  'eq': function(v1, v2) { return v1 === v2; },
  'ne': function(v1, v2) { return v1 !== v2; },
  'lt': function(v1, v2) { return v1 < v2; },
  'gt': function(v1, v2) { return v1 > v2; },
  'lte': function(v1, v2) { return v1 <= v2; },
  'gte': function(v1, v2) { return v1 >= v2; },
  'and': function(v1, v2) { return v1 && v2; },
  'or': function(v1, v2) { return v1 || v2; },
  'not': function(v1) { return !v1; },
  'null': function(v1){ return v1 == null; },
  'if_else': function(condition, value1, value2) { return condition ? value1 : value2; }
});

Handlebars.registerHelper('formatDate', (date) => {
  return moment(date).format('MM/DD/YYYY');
});

Handlebars.registerHelper('getCharacterRaceName', (characterRaceId) => {
  switch(characterRaceId) {
    case 0: return 'Elyos'; 
    case 1: return 'Asmodian'; 
  }
});

Handlebars.registerHelper('getCharacterClassName', (characterClassID) => {
  switch(characterClassID) {
    case 1: return 'Gladiator'; 
    case 2: return 'Templar';
    case 4: return 'Assassin'; 
    case 5: return 'Ranger'; 
    case 7: return 'Sorcerer'; 
    case 8: return 'Spiritmaster'; 
    case 10: return 'Cleric'; 
    case 11: return 'Chanter'; 
    case 13: return 'Aethertech'; 
    case 14: return 'Gunner'; 
    case 16: return 'Bard'; 
  }
});

Handlebars.registerHelper('getCharacterRankName', (characterRankID) => {
  switch(characterRankID) {
    case 10: return 'Army 1-Star Officer'; 
    case 11: return 'Army 2-Star Officer'; 
    case 12: return 'Army 3-Star Officer'; 
    case 13: return 'Army 4-Star Officer'; 
    case 14: return 'Army 5-Star Officer'; 
    case 15: return 'General'; 
    case 16: return 'Great General'; 
    case 17: return 'Commander'; 
    case 18: return 'Governor'; 
    default: return 'Soldier Rank 1'; 
  }
});