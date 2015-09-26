var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game');

var ASGame = function(game) {
    this.game = game;
    this.bg = null;
    this.dude = null;
    this.controls = null;
    this.stars = null;
    this.score = 0;
    this.scoreBox = null;
};

ASGame.prototype = {
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.controls = this.input.keyboard.createCursorKeys();
    },
    preload: function() {
        this.load.baseURL ='http://localhost/phaser-setup/';
        this.load.image('bg', 'assets/background.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    create: function() {

        this.world.setBounds(0,0,1600,400);

        this.bg = this.add.tileSprite(0, 0, 1600, 400, 'bg');

        //----Stars-----
        this.stars = this.add.group();
        this.stars.enableBody = true;
        for(var i = 0; i < 40; i++) {
            var star = this.stars.create(
                Math.random() * this.world.width,
                Math.random() * this.world.height,
                'star');
        }

        //-----Score Text----
        var style = {
            fill: "#fff"
        };
        this.scoreBox = this.add.text(10,10, "0 Sterne", style);
        this.scoreBox.fixedToCamera = true;

        //----Initialize player----
        this.dude = this.add.sprite(0,0,'dude');
        this.physics.arcade.enable(this.dude);
        this.dude.body.gravity.y = 500;
        this.dude.body.collideWorldBounds = true;
        this.dude.animations.add('left', [0, 1, 2, 3], 10, true);
        this.dude.animations.add('right', [5, 6, 7, 8], 10, true);

        this.camera.follow(this.dude);
    },
    update: function() {
        this.dude.body.velocity.x = 0;
        if(this.controls.left.isDown && !this.controls.right.isDown) {
            this.dude.body.velocity.x = -150;
            this.dude.animations.play('left');
        }
        else if(this.controls.right.isDown && !this.controls.left.isDown) {
            this.dude.body.velocity.x = 150;
            this.dude.animations.play('right');
        }
        else {
            if(this.dude.body.onFloor()) {
                this.dude.animations.stop();
                this.dude.frame = 4;
            }

        }

        if(this.controls.up.isDown && this.dude.body.onFloor()) {
            this.dude.body.velocity.y = -200;
        }
        this.physics.arcade.overlap(this.dude,this.stars,function(dude,star) {
            star.kill();
            this.scoreStar();
        }, null, this);
    },
    scoreStar: function() {
        this.score++;
        this.scoreBox.text = this.score + " Sterne";
    }
};

game.state.add('LevelOne', ASGame, true);
