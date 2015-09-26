var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

var Antom = function(game) {
    this.game = game;
    this.bg = null;
    this.dude = null;
    this.controls = null;
    this.stars = null;
    this.vitamins = 100;
    this.vitaminText = null;
    this.playerSpeed = 150;
    this.speedText = null;
};

Antom.prototype = {
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.controls = this.input.keyboard.createCursorKeys();
    },
    preload: function() {
        this.loadAssets();
    },
    loadAssets: function() {
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/001_Tom_Basic_1.png', 32, 32);
        this.load.tilemap('map', 'assets/002_AnTom_Level01.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('001_BG_Texture', 'assets/001_BG_Texture.png');

    },
    create: function() {
        this.world.setBounds(0,0,3200,2400);

        // set tilemap
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('001_BG_Texture');
        this.layer = this.map.createLayer('Kachelebene 1');
        this.map.setCollisionBetween(2, 2);

        //-----Score Text----
        var style = {
            fill: "#fff"
        };

        this.vitaminText = this.add.text(10,10, "Vitamine: " + this.vitamins, style);
        this.vitaminText.fixedToCamera = true;

        this.speedText = this.add.text(10, 50, "PlayerSpeed: " + this.playerSpeed, style);
        this.speedText.fixedToCamera = true;

        //----Stars-----
        this.stars = this.add.group();
        this.stars.enableBody = true;
        for(var i = 0; i < 40; i++) {
            var star = this.stars.create(
                Math.random() * this.world.width,
                Math.random() * this.world.height,
                'star');
        }

        //----Initialize player----
        this.dude = this.add.sprite(game.world.centerX, game.world.centerY,'dude');
        this.physics.arcade.enable(this.dude);
        this.dude.body.collideWorldBounds = true;

        this.camera.follow(this.dude);

        this.time.events.loop(Phaser.Timer.SECOND, this.decreaseVitamins, this);
    },
    update: function() {
        this.game.physics.arcade.collide(this.dude, this.layer);

        //-----Player movement--------
        this.dude.body.velocity.x = 0;
        this.dude.body.velocity.y = 0;
        this.dude.frame = 4;

        if(this.controls.left.isDown) {
            this.dude.body.velocity.x = -this.playerSpeed;
            this.dude.animations.play('left');
        }
        else if(this.controls.right.isDown) {
            this.dude.body.velocity.x = this.playerSpeed;
        }

        if(this.controls.up.isDown) {
            this.dude.body.velocity.y = -this.playerSpeed;
        }
        else if(this.controls.down.isDown) {
            this.dude.body.velocity.y = this.playerSpeed;
        }
        //-------------------------------

        //----Star collide----------
        this.physics.arcade.overlap(this.dude,this.stars,function(dude,star) {
            star.kill();
            this.playerSpeed = this.playerSpeed + 50;
            this.speedText.text = "PlayerSpeed: " + this.playerSpeed;
        }, null, this);

    },
    decreaseVitamins: function() {
        //---Decrease Vitamins---------
        this.vitamins--;
        this.vitaminText.text = "Vitamins: " + this.vitamins;
    }
};



game.state.add('LevelOne', Antom, true);
