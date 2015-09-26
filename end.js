// Setup our namespaces and resource lists.

Antom.State.End = function(game) {
  this.game = game;
};
Antom.State.End.prototype = {
  preload: function() {
    this.loadAssets();
  },
  create: function() {
    var end = this.game.add.sprite(270, 0, 'end');
    var end;
    this.game.add.tween(end).to(
        { y: 250 }, 3000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
    var self = this.game;
    setTimeout(function(){  }, 5000);

  },
  loadAssets: function() {
    this.load.image('end', 'assets/end.png');
  }

};
