var GamePage = function(config) {
  var self = this;

  for(var key in config) {
    self[key] = config[key];
  }
};

GamePage.prototype.build = function(){
  var self = this;

  self.page = tabris.create("Page", {
    title: "Game",
    topLevel: false
  });

  self.tabFolder = tabris.create("TabFolder", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    style: ["TOP"]
  }).appendTo(self.page);

  self.opponentTab = tabris.create("Tab", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    title: "Opponent's board"
  }).appendTo(self.tabFolder);

  self.opponentCanvas = tabris.create("Canvas", {
    layoutData: {left: 10, top: 10, right: 10, bottom: 10}
  }).appendTo(self.opponentTab);

  self.opponentBoard = new Board({
    canvas: self.opponentCanvas,
    clickable: true
  });

  self.myTab = tabris.create("Tab", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    title: "My Board"
  }).appendTo(self.tabFolder);

  self.myCanvas = tabris.create("Canvas", {
    layoutData: {left: 10, top: 10, right: 10, bottom: 10}
  }).appendTo(self.myTab);

  self.myBoard = new Board({
    canvas: self.myCanvas,
    clickable: false
  });
};


GamePage.prototype.loadPlayersBoardPositions = function () {
  var self = this;

  $.ajax({
    type: 'GET',
    url: self.apiUrl + '/api/games/' + self.gameId + '/playersboardpositions',
    dataType: 'json'
  }).done(function(data){
    self.myBoard.data = data;
    self.myBoard.draw();
  }).fail(function(){
    console.log('playersboardpositions failed');
  });
};

GamePage.prototype.loadOpponentsBoardPositions = function () {
  var self = this;

  $.ajax({
    type: 'GET',
    url: self.apiUrl + '/api/games/' + self.gameId + '/opponentsboardpositions',
    dataType: 'json'
  }).done(function(data){
    self.opponentBoard.data = data;
    self.opponentBoard.draw();
  }).fail(function(){
    console.log('opponentsboardpositions failed');
  });
};

GamePage.prototype.open = function(){
  var self = this;

  self.loadPlayersBoardPositions();
  self.loadOpponentsBoardPositions();
  self.page.open();
};