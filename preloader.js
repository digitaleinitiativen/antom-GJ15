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
    var antom = this.game.add.sprite(200, 0, 'antom');
    var antom;
    this.game.add.tween(antom).to(
        { y: 250 }, 3000, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
    var self = this.game;
    setTimeout(function(){ self.state.start('game'); }, 3000);

  },

  loadAssets: function() {
    this.load.image('arrow', 'assets/arrow.png');
    this.load.tilemap('map', 'assets/001_AnTom_Level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('001_Lawn_Sprite', 'assets/001_Lawn_Sprite.png');
    this.load.spritesheet('001_Fruititem_Lemon', 'assets/001_Fruititem_Lemon.png', 32, 32);
    this.load.image('001_Fruititem_Orange', 'assets/001_Fruititem_Orange.png');
    this.load.image('001_Enemy_Blue', 'assets/001_Enemy_Blue.png');
    this.load.image('001_Fruititem_Orange', 'assets/001_Fruititem_Orange.png');
    this.load.image('carrot', 'assets/carrot.png');
    this.load.image('ameisenbau', 'assets/001_Antom_House.png');
    this.load.image('antom', 'assets/antom.png');
    this.load.spritesheet('001_Sprite_Arrow', 'assets/001_Sprite_Arrow.png',32,32);
    this.load.spritesheet('001_Enemy_Purple', 'assets/001_Enemy_Purple.png',32,32,2);
    this.load.spritesheet('001_Enemy_Blue', 'assets/001_Enemies_Sprite_Blue.png',32,32,2);
    this.load.spritesheet('dude', 'assets/001_Tom_Basic.png', 32, 32);
  }




};
