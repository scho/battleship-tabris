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

  self.shootAtButton = tabris.create("Button", {
    layoutData: {top: 0, left: [20, 0], right: [20, 0]},
    text: "Shoot!",
    enabled: false,
    visibility: false
  }).on("selection", function(){
    var position = self.opponentBoard.getSelectedPosition();

    self.shootAtButton.set('visibility', false);
    self.waitingLabel.set('visibility', true);
    self.shootAt(position[0], position[1]);
  }).appendTo(self.opponentTab);

  self.waitingLabel = tabris.create("Label", {
    layoutData: {top: 8, left: [20, 0], right: [20, 0]},
    text: "<i>Waiting for Opponent</i>",
    visibility: false,
    alignment: "center",
    markupEnabled: true,
    font: "14px"
  }).appendTo(self.opponentTab);

  self.nobodyHasJoinedLabel = tabris.create("Label", {
    layoutData: {top: 8, left: [20, 0], right: [20, 0]},
    text: "<i>Nobody has joined yet...</i>",
    visibility: false,
    alignment: "center",
    markupEnabled: true,
    font: "14px"
  }).appendTo(self.opponentTab);

  self.wonLabel = tabris.create("Label", {
    layoutData: {top: 8, left: [20, 0], right: [20, 0]},
    text: "<b>You won</b> :)",
    visibility: false,
    alignment: "center",
    markupEnabled: true,
    font: "14px"
  }).appendTo(self.opponentTab);

  self.lostLabel = tabris.create("Label", {
    layoutData: {top: 8, left: [20, 0], right: [20, 0]},
    text: "<b>You lost</b> :(",
    visibility: false,
    alignment: "center",
    markupEnabled: true,
    font: "14px"
  }).appendTo(self.opponentTab);

  self.opponentCanvas = tabris.create("Canvas", {
    layoutData: {left: 10, top: 25, right: 10, bottom: 10}
  }).appendTo(self.opponentTab);

  self.opponentBoard = new Board({
    canvas: self.opponentCanvas,
    clickable: true,
    onSelectionChange: function () {
      self.shootAtButton.set('enabled', !!this.getSelectedPosition());
    }
  });

  self.myTab = tabris.create("Tab", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    title: "My Board"
  }).appendTo(self.tabFolder);

  self.myCanvas = tabris.create("Canvas", {
    layoutData: {left: 10, top: 25, right: 10, bottom: 10}
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
    self.myBoard.setDataAndDraw(data);
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
    self.opponentBoard.setDataAndDraw(data);
  }).fail(function(){
    console.log('opponentsboardpositions failed');
  });
};

GamePage.prototype.open = function(){
  var self = this;

  self.loadPlayersBoardPositions();
  self.loadOpponentsBoardPositions();
  self.updateGameState();
  self.page.open();
};

GamePage.prototype.shootAt = function(x, y){
  var self = this;

  console.log('Shoot at ', x, '-', y);

  $.ajax({
    type: 'POST',
    url: self.apiUrl + '/api/games/' + self.gameId + '/shootat/' + x + '-' + y
  }).done(function(){
    self.updateGameState();
    self.loadOpponentsBoardPositions();
    //window.loadMessages();
  }).fail(function(){
    console.log('shooting failed');
  });
};

GamePage.prototype.updateGameState = function(){
  var self = this;

  $.ajax({
    type: 'GET',
    url: self.apiUrl + '/api/games/' + self.gameId + '/state'
  }).done(function(gameState){
    //$('.players-name').text(gameState.playersName);
    if(gameState.started){
      //$('.opponents-name').text(gameState.opponentsName);
      self.nobodyHasJoinedLabel.set('visibility', false);
    } else {
      //$('.opponents-name').text('?');
      self.nobodyHasJoinedLabel.set('visibility', true);
    }

    if(gameState.finished){
      self.shootAtButton.set('visibility', false);
      self.waitingLabel.set('visibility', false);
      if(gameState.won){
        self.wonLabel.set('visibility', true);
      } else {
        self.lostLabel.set('visibility', true);
      }

      return;
    }

    if(gameState.playersTurn && gameState.started){
      self.shootAtButton.set('visibility', true);
      self.shootAtButton.set('enabled', !!self.opponentBoard.getSelectedPosition());
      self.waitingLabel.set('visibility', false);
      self.loadPlayersBoardPositions();
    } else {
      self.shootAtButton.set('visibility', false);
      if(gameState.started){
        self.waitingLabel.set('visibility', true);
      }
      setTimeout(function(){
        self.updateGameState();
      }, 1000);
    }
  });
};