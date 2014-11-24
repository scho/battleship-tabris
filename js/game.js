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
};

GamePage.prototype.open = function(){

  this.page.open();
};