tabris.load(function(){
  var apiUrl = "https://battlescho.herokuapp.com";

  function indexPage(){

    var login = function(name, password, success, failure){

      $.ajax({
        type: 'POST',
        url: apiUrl + '/api/players/login',
        data: {
          name: name,
          password: password
        }
      }).done(function(data){
        localStorage.setItem('playerName', name);
        playerId = data;
        success();
      }).fail(function(j){
        failure("Login failed.");
      });
    };

    var register = function(name, password, success, failure){

      $.ajax({
        type: 'POST',
        url: apiUrl + '/api/players/register',
        data: {
          name: name,
          password: password
        }
      }).done(function(data){
        localStorage.setItem('playerName', name);
        playerId = data;
        success();
      }).fail(function(){
        failure("Register failed.");
      });
    };

    var page = tabris.create("Page", {
      title: "Battleship - Login",
      topLevel: true
    });

    var status = tabris.create("Label", {
      layoutData: {left: 20, top: 10, right: 20},
      alignment: "left"
    }).appendTo(page);

    var name = tabris.create("Text", {
      layoutData: {top: 40, left: [20, 0], right: [20, 0]},
      message: "Name",
      text: localStorage.getItem('playerName') || ""
    }).appendTo(page);

    var password = tabris.create("Text", {
      layoutData: {top: 80, left: [20, 0], right: [20, 0]},
      type: "password",
      message: "Password"
    }).appendTo(page);

    tabris.create("Button", {
      layoutData: {top: 130, left: [20, 0], right: [20, 0]},
      text: "Login"
    }).on("selection", function() {
      login(name.get("text"), password.get("text"), function () {
        status.set("text", "");
        page.close();
        lobbyPage().open();
      }, function (responseText) {
        status.set("text", responseText);
      });
    }).appendTo(page);

    tabris.create("Button", {
      layoutData: {top: 180, left: [20, 0], right: [20, 0]},
      text: "Register"
    }).on("selection", function() {
      register(name.get("text"), password.get("text"), function () {
        status.set("text", "");
        lobbyPage().open();
      }, function (responseText) {
        status.set("text", responseText);
      });
    }).appendTo(page);

    return page;
  }

  function lobbyPage(){

    var page = tabris.create("Page", {
      title: "Battleship - Lobby",
      topLevel: false
    });

    var tabFolder = tabris.create("TabFolder", {
      layoutData: {left: 0, top: 0, right: 0, bottom: 50},
      style: ["TOP"]
    }).appendTo(page);

    tabris.create("Button", {
      text: "Open Game",
      layoutData: {left: 50, bottom: 10, right: 50}
    }).on("selection", function(){
      console.log("Open new game");
      $.ajax({
        type: 'PUT',
        url: apiUrl + '/api/games/open'
      }).done(function(gameId){
        console.log("New game opened: " + gameId);
        gamePage(gameId).open();
      });
    }).appendTo(page);

    var openGamesTab = tabris.create("Tab", {
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      title: "Open Games"
    }).appendTo(tabFolder);

    var ownGamesTab = tabris.create("Tab", {
      layoutData: {left: 0, top: 0, right: 0, bottom: 0},
      title: "My Games"
    }).appendTo(tabFolder);

    var loadAllOpen = function(){
      $.ajax({
        type: 'GET',
        url: apiUrl + '/api/games/allopen',
        dataType: 'json'
      }).done(function(games){
        var openGames = tabris.create("CollectionView", {
          layoutData: {left: 0, right: 0, top: 0, bottom: 0},
          itemHeight: 72,
          items: games,
          initializeCell: function(cell) {
            var titleLabel = tabris.create("Label", {
              layoutData: {left: [20, 0], right: [20, 0], top: 15},
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
          console.log("Join game " + event.item.gameId);
          $.ajax({
            type: 'POST',
            url: apiUrl + '/api/games/' + event.item.gameId + '/join'
          }).done(function(gameId){
            console.log("Game joined " + gameId);
            gamePage(gameId).open();
          });
        }).appendTo(openGamesTab);
        console.log(games.length + " open games loaded.");
      }).fail(function(){
        console.log("Loading of open games failed.");
      });
    };

    var loadOwn = function(){
      $.ajax({
        type: 'GET',
        url: apiUrl + '/api/games/own',
        dataType: 'json'
      }).done(function(games){
        var openGames = tabris.create("CollectionView", {
          layoutData: {left: 0, right: 0, top: 0, bottom: 0},
          itemHeight: 72,
          items: games,
          initializeCell: function(cell) {
            var titleLabel = tabris.create("Label", {
              layoutData: {left: [20, 0], right: [20, 0], top: 15},
              markupEnabled: true,
              font: "20px"
            }).appendTo(cell);
            cell.on("itemchange", function(ownGame) {
              titleLabel.set("text", ownGame.opponentName + ' VS ' + (ownGame.playerName ? ownGame.playerName : '?'));
            });
          }
        }).on("selection", function(event) {
          gamePage(event.item.gameId).open();
        }).appendTo(ownGamesTab);
        console.log(games.length + " own games loaded.");
      }).fail(function(){
        console.log("Loading of own games failed.");
      });
    };

    loadAllOpen();
    loadOwn();

    return page;
  }

  function gamePage(gameId){

    var page = tabris.create("Page", {
      title: "Battleship - Game",
      topLevel: false
    });

    return page;
  }

  indexPage().open();
});
