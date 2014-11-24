tabris.load(function(){
  var apiUrl = "https://battlescho.herokuapp.com";

  var lobbyPage = new LobbyPage({
    onOpenGame: function (gameId) {
      var gamePage = new GamePage({
        apiUrl: apiUrl
      });
      gamePage.build();
      gamePage.open();
    },
    apiUrl: apiUrl
  });

  var indexPage = new IndexPage({ 
    onLogin: function () {
      this.close();

      lobbyPage.build();
      lobbyPage.open();
    },
    onRegister: function () {
      this.close();

      lobbyPage.build();
      lobbyPage.open();
    },
    apiUrl: apiUrl
  });

  indexPage.build();
  indexPage.open();
});
