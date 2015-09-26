var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

var Antom = function(game) {
    this.game = game;
    this.bg = null;
    this.dude = null;
    this.controls = null;
    this.stars = null;
    this.score = 0;
    this.scoreBox = null;
};

Antom.prototype = {
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.controls = this.input.keyboard.createCursorKeys();
    },
    preload: function() {
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.loadTilemapAssets();
    },
    create: function() {

        this.world.setBounds(0,0,3200,2400);
        // set tilemap
        this.map = this.add.tilemap('mario');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        this.layer = this.map.createLayer("World1");
        //  This resizes the game world to match the layer dimensions
        this.layer.resizeWorld();

        //----Initialize player----
        this.dude = this.add.sprite(game.world.centerX, game.world.centerY,'dude');
        this.physics.arcade.enable(this.dude);
        this.dude.body.collideWorldBounds = true;

        this.camera.follow(this.dude);
    },
    update: function() {
        this.dude.body.velocity.x = 0;
        this.dude.body.velocity.y = 0;
        this.dude.frame = 4;

        if(this.controls.left.isDown) {
            this.dude.body.velocity.x = -150;
            this.dude.animations.play('left');
        }
        else if(this.controls.right.isDown) {
            this.dude.body.velocity.x = 150;
        }

        if(this.controls.up.isDown) {
            this.dude.body.velocity.y = -150;
        }
        else if(this.controls.down.isDown) {
            this.dude.body.velocity.y = 150;
        }

    },
    loadTilemapAssets: function() {
        this.load.tilemap('mario', 'assets/tilemap/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/super_mario.png');
    }
};

game.state.add('LevelOne', Antom, true);
