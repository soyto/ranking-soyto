function Ranking() {}

const rankClasses = [
  { id: 0, name: 'Soldier Rank 10'},
  { id: 1, name: 'Soldier Rank 9'},
  { id: 2, name: 'Soldier Rank 8'},
  { id: 3, name: 'Soldier Rank 7'},
  { id: 4, name: 'Soldier Rank 6'},
  { id: 5, name: 'Soldier Rank 5'},
  { id: 6, name: 'Soldier Rank 4'},
  { id: 6, name: 'Soldier Rank 3'},
  { id: 7, name: 'Soldier Rank 2'},
  { id: 9, name: 'Soldier Rank 1'},
  { id: 10, name: 'Army 1-Star Officer'},   //Pos 701->1000
  { id: 11, name: 'Army 2-Star Officer'},   //Pos 501->700
  { id: 12, name: 'Army 3-Star Officer'},   //Pos 301->500
  { id: 13, name: 'Army 4-Star Officer'},   //Pos 101->300
  { id: 14, name: 'Army 5-Star Officer'},   //Pos 31->100
  { id: 15, name: 'General'},               //Pos 11->30
  { id: 16, name: 'Great general'},         //Pos 4->10
  { id: 17, name: 'Commander'},             //Pos 2->3
  { id: 18, name: 'Governor'},              //Pos 1
];

Ranking.prototype.get = function(rankId) {
  let _item = rankClasses.filter(x => x.id == rankId).shift();

  return _item ? _item.name : null;
};

Ranking.prototype.getAll = function() {
  return rankClasses;
};


module.exports = new Ranking();