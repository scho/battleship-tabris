var LobbyPage = function (config) {
  var self = this;

  for(var key in config) {
    self[key] = config[key];
  }
};

LobbyPage.prototype.build = function() {
  var self = this;
  
  self.page = tabris.create("Page", {
    title: "Battleship - Lobby",
    topLevel: false
  });

  self.openGameButton = tabris.create("Button", {
    text: "Open Game",
    layoutData: {left: 50, bottom: 10, right: 50}
  }).on("selection", function(){
    self.openGame();
  }).appendTo(self.page);

  self.tabFolder = tabris.create("TabFolder", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 50},
    paging: true,
    style: ["TOP"]
  }).appendTo(self.page);

  self.openGamesTab = tabris.create("Tab", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    title: "Open Games"
  }).appendTo(self.tabFolder);

  self.ownGamesTab = tabris.create("Tab", {
    layoutData: {left: 0, top: 0, right: 0, bottom: 0},
    title: "My Games"
  }).appendTo(self.tabFolder);

  self.openGamesCollectionView = tabris.create("CollectionView", {
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    itemHeight: 50,
    items: [],
    initializeCell: function(cell) {
      var titleLabel = tabris.create("Label", {
        layoutData: {left: [20, 0], right: [20, 0], top: 15, bottom: 0},
        markupEnabled: true,
        font: "20px"
      }).appendTo(cell);
      var authorLabel = tabris.create("Label", {
        layoutData: {left: [20, 0], right: [20, 0], top: [titleLabel, 4]},
        text: "join"
      }).appendTo(cell);
      cell.on("itemchange", function(openGame) {
        titleLabel.set("text", openGame.opponentName);
      });
    }
  }).on("selection", function(event) {      
    self.joinGame(event.item);
  }).appendTo(self.openGamesTab);

  self.ownGamesCollectionView = tabris.create("CollectionView", {
    layoutData: {left: 0, right: 0, top: 0, bottom: 0},
    itemHeight: 50,
    items: [],
    initializeCell: function(cell) {
      var titleLabel = tabris.create("Label", {
        layoutData: {left: [20, 0], right: [20, 0], top: 10},
        markupEnabled: true,
        font: "20px"
      }).appendTo(cell);
      cell.on("itemchange", function(ownGame) {
        titleLabel.set("text", ownGame.opponentName + ' VS ' + (ownGame.playerName ? ownGame.playerName : '?'));
      });
    }
  }).on("selection", function(event) {
    self.onOpenGame(event.item.gameId);
  }).appendTo(self.ownGamesTab);
};

LobbyPage.prototype.loadOwnGames = function() {
  var self = this;

  $.ajax({
    type: 'GET',
    url: self.apiUrl + '/api/games/own',
    dataType: 'json'
  }).done(function(games){
    self.ownGamesCollectionView.set('items', games);
    if(games.length > 0){
      self.ownGamesTab.set('title', 'My Games (' + games.length + ')');
    } else {
      self.ownGamesTab.set('title', 'My Games');
    }
    console.log(games.length + " own games loaded.");
  }).fail(function(){
    console.log("Loading of own games failed.");
  });
};

LobbyPage.prototype.loadOpenGames = function(){
  var self = this;
  $.ajax({
    type: 'GET',
    url: self.apiUrl + '/api/games/allopen',
    dataType: 'json'
  }).done(function(games){
    self.openGamesCollectionView.set('items', games);
    if(games.length > 0){
      self.openGamesTab.set('title', 'Open Games (' + games.length + ')');
    } else {
      self.openGamesTab.set('title', 'Open Games');
    }
    console.log(games.length + " open games loaded.");
  }).fail(function(){
    console.log("Loading of open games failed.");
  });
};

LobbyPage.prototype.joinGame = function(game){
  var self = this;

  console.log("Join game " + game.gameId);
  $.ajax({
    type: 'POST',
    url: self.apiUrl + '/api/games/' + game.gameId + '/join'
  }).done(function(data){
    console.log("Game joined " + data);
    var allGames = self.openGamesCollectionView.get('items').slice(0),
      index = allGames.indexOf(game);

    allGames.splice(index, 1);

    self.openGamesCollectionView.set('items', allGames);

    self.loadOwnGames();
    self.onOpenGame(game.gameId);
  });
};

LobbyPage.prototype.openGame = function(gameId){
  var self = this;

  console.log("Open new game");
  self.openGameButton.set('enabled', false);
  $.ajax({
    type: 'PUT',
    url: self.apiUrl + '/api/games/open'
  }).done(function(gameId){
    console.log("New game opened: " + gameId);
    self.openGameButton.set('enabled', true);
    self.loadOwnGames();
    self.onOpenGame(gameId);
  });
};

LobbyPage.prototype.open = function(){
  var self = this;

  self.loadOwnGames();
  self.loadOpenGames();
  self.page.open();
};

LobbyPage.prototype.onOpenGame = function(gameId) {

};


