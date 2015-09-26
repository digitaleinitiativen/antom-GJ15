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
        this.load.image('bg', 'assets/background.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    create: function() {

        this.world.setBounds(0,0,3200,2400);

        this.bg = this.add.tileSprite(0, 0, 3200, 2400, 'bg');


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

    }
};

game.state.add('LevelOne', Antom, true);
