var Board = function (config) {
  var self = this;

  for(var key in config) {
    self[key] = config[key];
  }
  self.startX = 0;
  self.startY = 0;

  var touchChange = function(event){
    var newHighlightX = Math.floor((event.touches[0].x - self.startX) / self.tileSize),
      newHighlightY = Math.floor((event.touches[0].y - self.startY) / self.tileSize);

    if(newHighlightX !== self.highlightX || newHighlightY !== self.highlightY){
      self.highlightX = newHighlightX;
      self.highlightY = newHighlightY;
      self.draw();
    }
  };

  self.canvas.on('touchmove', function(event){
    touchChange(event);
  });

  self.canvas.on('touchend', function(event){
    touchChange(event);
  });

  self.canvas.on("change:bounds", function(){
    self.onBoundsChange();
  });

  self.onBoundsChange();
};

Board.prototype.onBoundsChange = function() {
  var self = this;

  var bounds = self.canvas.get("bounds");
  
  self.tileSize = Math.floor(Math.min(bounds.width, bounds.height) / 10) - 2;
  self.size = self.tileSize * 10 + 9;
  self.startX = Math.floor((bounds.width - self.size) / 2);
  self.startY = Math.floor((bounds.height - self.size) / 2);

  self.draw();
};

Board.prototype.draw = function () {

  var self = this,
    chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    size = self.size,
    tileSize = self.tileSize,
    x,
    y = 0;

  if(!self.data || size <= 0 || tileSize <= 0){
    return;
  }

  var ctx = tabris.getContext(self.canvas, self.startX + self.size, self.startY + self.size);

  self.data.map(function(row){
    x = 0;
    row.map(function(cell){
      var kind = cell.kind.toLocaleLowerCase().replace('_', '-'),
        unknown = kind === 'unknown',
        title = chars[x] + (y + 1).toString(),
        style = self.getPositionStyle(kind, x === self.highlightX && y === self.highlightY);

      ctx.fillStyle = style;

      ctx.fillRect(self.startX + x * (tileSize + 1), self.startY + y * (tileSize + 1), tileSize, tileSize);

      if(self.clickable && unknown){
        //ctx.fillRect(self.startX + x * (tileSize + 1), self.startY + y * (tileSize + 1), tileSize, tileSize);
          //rowEl.append('<td title="' + title + '" onClick="(function(e){ e.preventDefault(); shootAt(' + x + ',' + y + ')})(event)" class="clickable ' + kind + '"></td>');
      } else {
        //ctx.fillRect(self.startX + x * (tileSize + 1), self.startY + y * (tileSize + 1), tileSize, tileSize);
      }
      x += 1;
    });
    y += 1;
  });
};

Board.prototype.getPositionStyle = function(kind, highlight){
  switch(kind){
    case "water":
      return "rgb(235,244,250)";
    case "ship":
      return "rgb(108,123,139)";
    case "ship-hit":
      return "rgb(255,109,149)";
    case "ship-sunk":
      return "rgb(179,0,35)";
    case "water-hit":
      return "rgb(174,220,255)";
    case "unknown":
      return highlight ? "rgb(153,153,153)" : "rgb(244,244,244)";
  }
};