function Classes() {}

const characterClasses = [
  { id: 1, name: 'Gladiator', icon: 'img/gladiator.jpg' },
  { id: 2, name: 'Templar', icon: 'img/templar.jpg' },
  { id: 4, name: 'Assassin', icon: 'img/assassin.jpg' },
  { id: 5, name: 'Ranger', icon: 'img/ranger.jpg' },
  { id: 7, name: 'Sorcerer', icon: 'img/sorc.jpg' },
  { id: 8, name: 'Spiritmaster' , icon: 'img/sm.jpg'},
  { id: 10, name: 'Cleric', icon: 'img/cleric.jpg' },
  { id: 11, name: 'Chanter', icon: 'img/chanter.jpg' },
  { id: 13, name: 'Aethertech', icon: 'img/gladiator.jpg' },
  { id: 14, name: 'Gunner', icon: 'img/gunner.png' },
  { id: 16, name: 'Bard', icon: 'img/barde.png' },
];

Classes.prototype.get = function(classId) {
  let _classItem = characterClasses.filter(x => x.id == classId).shift();

  return _classItem ? _classItem.name : null;
};

Classes.prototype.getAll = function() {
  return characterClasses;
};


module.exports = new Classes();