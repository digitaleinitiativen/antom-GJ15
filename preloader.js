// Setup our namespaces and resource lists.
Antom = {};
Antom.State = {};

Antom.State.Preloader = function(game) {
  this.game = game;
};
Antom.State.Preloader.prototype = {
  preload: function() {
    this.loadAssets();
    console.log('startup');
  },
  create: function() {
    this.world.setBounds(0,0,3200,2400);


    this.game.state.start('game');
  },

  loadAssets: function() {
    this.load.image('star', 'assets/star.png');
    this.load.image('arrow', 'assets/arrow.png');
    this.load.tilemap('map', 'assets/001_AnTom_Level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('001_Lawn_Sprite', 'assets/001_Lawn_Sprite.png');
    this.load.spritesheet('001_Fruititem_Lemon', 'assets/001_Fruititem_Lemon.png', 32, 32, 2);
    var lemon = this.load.image('001_Fruititem_Orange', 'assets/001_Fruititem_Orange.png');
    this.load.image('001_Enemy_Blue', 'assets/001_Enemy_Blue.png');
    this.load.image('001_Fruititem_Orange', 'assets/001_Fruititem_Orange.png');
    this.load.image('001_Enemy_Purple', 'assets/001_Enemy_Purple.png');
    this.load.image('carrot', 'assets/carrot.png');
    this.load.image('ameisenbau', 'assets/ameisenbau.png');
    this.load.image('antom', 'assets/antom.png');
    this.load.spritesheet('001_Enemy_Purple', 'assets/001_Enemy_Purple.png',32,32);
    this.load.spritesheet('001_Enemy_Blue', 'assets/001_Enemy_Blue.png',32,32);
    this.load.spritesheet('dude', 'assets/001_Tom_Basic.png', 32, 32);
  },




};
