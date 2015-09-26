var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

var Antom = function(game) {
    this.game = game;
    this.dude = null;
    this.controls = null;
    this.stars = null;
    this.carrots = null;
    this.vitamins = 100;
    this.vitaminText = null;
    this.playerSpeed = 150;
    this.speedText = null;
    this.ameisenbau = null;
    this.carryingVitamin = false;
};

Antom.prototype = {
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.controls = this.input.keyboard.createCursorKeys();
    },
    preload: function() {
        this.load.image('star', 'assets/star.png');
        this.load.image('carrot', 'assets/carrot.png');
        this.load.image('ameisenbau', 'assets/ameisenbau.png');
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

        //-----Score Text----
        var style = {
            fill: "#fff"
        };

        this.vitaminText = this.add.text(10,10, "Vitamine: " + this.vitamins, style);
        this.vitaminText.fixedToCamera = true;

        this.speedText = this.add.text(10, 50, "PlayerSpeed: " + this.playerSpeed, style);
        this.speedText.fixedToCamera = true;


        //----Ameisenbau----
        this.ameisenbau = this.add.sprite(game.world.centerX, game.world.centerY,'ameisenbau');
        this.physics.arcade.enable(this.ameisenbau);

        //----Stars-----
        this.stars = this.add.group();
        this.stars.enableBody = true;
        for(var i = 0; i < 40; i++) {
            var star = this.stars.create(
                Math.random() * this.world.width,
                Math.random() * this.world.height,
                'star');

        }

        //----Carrots-----
        this.carrots = this.add.group();
        this.carrots.enableBody = true;
        for(var j = 0; j < 10; j++) {
            var carrot = this.carrots.create(
                Math.random() * this.world.width,
                Math.random() * this.world.height,
                'carrot');
        }

        //----Initialize player----
        this.dude = this.add.sprite(game.world.centerX, game.world.centerY,'dude');
        this.physics.arcade.enable(this.dude);
        this.dude.body.collideWorldBounds = true;
        this.camera.follow(this.dude);

        ///Timer for Vitamins
        this.time.events.loop(Phaser.Timer.SECOND, this.decreaseVitamins, this);
    },
    update: function() {

        //-----Player movement--------
        this.dude.body.velocity.x = 0;
        this.dude.body.velocity.y = 0;
        this.dude.frame = 4;

        if(this.controls.left.isDown) {
            this.dude.body.velocity.x = -this.playerSpeed;
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

        //----Star collide----------
        this.physics.arcade.overlap(this.dude,this.stars,function(dude,star) {
            if(!this.carryingVitamin) {
                star.kill();
                this.carryingVitamin = true;
            }
        }, null, this);

        //----Carrot collide----------
        this.physics.arcade.overlap(this.dude,this.carrots,function(dude,carrot) {
            carrot.kill();
            this.playerSpeed = this.playerSpeed + 50;
            this.refreshTexts();
        }, null, this);


        //----Ameisenbau Collide ---------
        this.physics.arcade.overlap(this.dude, this.ameisenbau, this.returnVitamins, null, this);

    },
    refreshTexts: function() {
        this.vitaminText.text = "Vitamins: " + this.vitamins;
        this.speedText.text = "PlayerSpeed: " + this.playerSpeed;
    },
    loadTilemapAssets: function() {
        this.load.tilemap('mario', 'assets/tilemap/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('tiles', 'assets/super_mario.png');

    },
    decreaseVitamins: function() {
        //---Decrease Vitamins---------
        this.vitamins--;
        this.refreshTexts();
    },
    returnVitamins: function() {
        if(this.carryingVitamin) {
            this.playerSpeed = this.playerSpeed + 50;
            this.vitamins = 100;
            this.refreshTexts();
            this.carryingVitamin = false;
        }
    }
};

game.state.add('LevelOne', Antom, true);
