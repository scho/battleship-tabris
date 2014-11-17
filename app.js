tabris.load(function(){
  var apiUrl = "https://battlescho.herokuapp.com",
    playerId = "";

  function lobbyPage(){

    var page = tabris.create("Page", {
      title: "Battleship - Lobby",
      topLevel: false
    });

    var allOpen = function(){
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
        }).appendTo(page);
        console.log(games.length + " games loaded.");
      }).fail(function(){
        console.log("Loading of games failed.");
      });
    };

    allOpen();

    return page;
  }

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
      text: "scho"
    }).appendTo(page);

    var password = tabris.create("Text", {
      layoutData: {top: 80, left: [20, 0], right: [20, 0]},
      type: "password",
      text: "123",
      message: "Password"
    }).appendTo(page);

    tabris.create("Button", {
      layoutData: {top: 130, left: [20, 0], right: [20, 0]},
      text: "Login"
    }).on("selection", function() {
      login(name.get("text"), password.get("text"), function () {
        status.set("text", "");
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

  indexPage().open();
});
