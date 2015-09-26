Antom.main = function() {
  var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

  game.state.add('preloader', Antom.State.Preloader);
  game.state.add('game', Antom.State.Game);
  game.state.start('preloader');
};

window.onload = function() {
  Antom.main();
};
