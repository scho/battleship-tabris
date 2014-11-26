var IndexPage = function (config) {
  var self = this;

  for(var key in config) {
    self[key] = config[key];
  }
};

IndexPage.prototype.build = function () {
  var self = this;

  self.page = tabris.create("Page", {
    title: "Battleship - Login",
    topLevel: true,
    background: "#FFFFFF"
  });

  self.statusLabel = tabris.create("Label", {
    layoutData: {left: 20, top: 10, right: 20},
    alignment: "left"
  }).appendTo(self.page);

  self.nameText = tabris.create("Text", {
    layoutData: {top: 40, left: [20, 0], right: [20, 0]},
    message: "Name",
    text: localStorage.getItem('playerName') || ""
  }).appendTo(self.page);

  self.passwordText = tabris.create("Text", {
    layoutData: {top: 80, left: [20, 0], right: [20, 0]},
    type: "password",
    message: "Password"
  }).appendTo(self.page);

  tabris.create("Button", {
    layoutData: {top: 130, left: [20, 0], right: [20, 0]},
    text: "Login"
  }).on("selection", function() {
    self.login();
  }).appendTo(self.page);

  tabris.create("Button", {
    layoutData: {top: 180, left: [20, 0], right: [20, 0]},
    text: "Register"
  }).on("selection", function() {
    self.register();
  }).appendTo(self.page);
};

IndexPage.prototype.login = function(){
  var self = this,
    name = self.nameText.get('text'),
    password = self.passwordText.get('text');

  $.ajax({
    type: 'POST',
    url: self.apiUrl + '/api/players/login',
    data: {
      name: name,
      password: password
    }
  }).done(function(data){
    localStorage.setItem('playerName', name);
    self.onLogin();
  }).fail(function(j){
    console.log("Login failed.");
  });
};

IndexPage.prototype.register = function(){
  var self = this,
    name = self.nameText.get('text'),
    password = self.passwordText.get('text');

  $.ajax({
    type: 'POST',
    url: self.apiUrl + '/api/players/register',
    data: {
      name: name,
      password: password
    }
  }).done(function(data){
    localStorage.setItem('playerName', name);

    self.onRegister();
  }).fail(function(responseText){
    self.statusLabel.set("text", responseText);
    console.log("Register failed.");
  });
};

IndexPage.prototype.open = function(){
  this.page.open();
};
IndexPage.prototype.close = function(){
  this.page.close();
};
IndexPage.prototype.onLogin = function() {
};
IndexPage.prototype.onRegister = function() {
};