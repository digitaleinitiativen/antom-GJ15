var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

var Antom = function(game) {
    this.game = game;
    this.dude = null;
    this.enemies = null;
    this.enemy = null;
    this.enemySpeed = 50;
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
        this.loadAssets();
    },

    loadAssets: function() {
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/001_Tom_Basic_1.png', 32, 32);
        this.load.tilemap('map', 'assets/001_AnTom_Level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('001_Lawn_Sprite', 'assets/001_Lawn_Sprite.png');
        this.load.spritesheet('001_Fruititem_Lemon', 'assets/001_Fruititem_Lemon.png', 32, 32, 2);
        var lemon = this.load.image('001_Fruititem_Orange', 'assets/001_Fruititem_Orange.png');
        lemon.frame = 1;
        this.load.image('001_Enemy_Blue', 'assets/001_Enemy_Blue.png');
        this.load.image('001_Fruititem_Orange', 'assets/001_Fruititem_Orange.png');
        this.load.image('001_Enemy_Purple', 'assets/001_Enemy_Purple.png');
        this.load.image('carrot', 'assets/carrot.png');
        this.load.image('enemy', 'assets/bikkuriman.png');
        this.load.image('ameisenbau', 'assets/ameisenbau.png');
    },
    initVitamins: function() {
        //----Stars-----
        this.stars = this.add.group();
        this.stars.enableBody = true;
        for(var i = 0; i < 15; i++) {
            var star = this.stars.create(
                Math.random() * this.world.width,
                Math.random() * this.world.height,
                'star');
        }
    },

    initPowerups: function() {
        //----Carrots-----
        this.carrots = this.add.group();
        this.carrots.enableBody = true;
        for(var j = 0; j < 5; j++) {
            var carrot = this.carrots.create(
                Math.random() * this.world.width,
                Math.random() * this.world.height,
                'carrot');
        }
    },

    initPlayer: function() {
        //----Initialize player----
        //this.dude = this.add.sprite(game.world.centerX, game.world.centerY,'dude');
        this.dude = this.add.sprite(200, 200,'dude');
        this.physics.arcade.enable(this.dude);
        this.dude.body.collideWorldBounds = true;
        this.camera.follow(this.dude);
    },

    initAllEnemies: function() {
        this.enemy = this.add.sprite(this.world.centerX, this.world.centerY, 'enemy');
        this.physics.arcade.enable(this.enemy);
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.immovable = true;
        this.enemy.body.velocity.x = this.enemy.body.velocity.y = this.enemySpeed;
    },

    initEnemy: function(x,y) {
        //Initialize enemy
        var enemy = this.enemies.create(x, y, 'enemy');
        enemy.body.collideWorldBounds = true;

        tweenDownRight = this.add.tween(enemy).to({x:'+100', y:'+100'}, 400);
        tweenUpLeft = this.add.tween(enemy).to({x:'-100', y:'-100'}, 400);
        tweenUpRight = this.add.tween(enemy).to({x:'+100', y:'-100'}, 400);
        tweenDownLeft = this.add.tween(enemy).to({x:'-100', y:'+100'}, 400);

        tweenDownRight.start().chain(tweenUpRight);
        tweenUpRight.chain(tweenUpLeft);
        tweenUpLeft.chain(tweenDownLeft);
        tweenDownLeft.chain(tweenDownRight);
    },

    initText: function() {
        //-----Score Text----
        var style = {
            fill: "#fff"
        };

        this.vitaminText = this.add.text(10,10, "Vitamine: " + this.vitamins, style);
        this.vitaminText.fixedToCamera = true;

        this.speedText = this.add.text(10, 50, "PlayerSpeed: " + this.playerSpeed, style);
        this.speedText.fixedToCamera = true;
    },

    initAmeisenbau: function() {
        //----Ameisenbau----
        this.ameisenbau = this.add.sprite(game.world.centerX, game.world.centerY,'ameisenbau');
        this.physics.arcade.enable(this.ameisenbau);
    },

    create: function() {
        this.world.setBounds(0,0,3200,2400);

        // set tilemap
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('001_Lawn_Sprite');
        this.map.setCollisionBetween(4, 10);

        this.map.addTilesetImage('001_Fruititem_Lemon');
        this.map.addTilesetImage('001_Fruititem_Orange');
        this.map.addTilesetImage('001_Enemy_Blue');
        this.map.addTilesetImage('001_Enemy_Purple');
        this.layer = this.map.createLayer('Kachelebene 1');
        //  This will set Tile ID 15 (the lemon) to call the function when collided with
        this.map.setTileIndexCallback(15, this.pickupVitamin, this);


        this.initText();
        this.initVitamins();
        this.initPowerups();
        this.initAmeisenbau();
        this.initPlayer();
        this.initAllEnemies();

        ///Timer for Vitamins
        this.time.events.loop(Phaser.Timer.SECOND, this.decreaseVitamins, this);
        this.time.events.repeat(Phaser.Timer.SECOND * 1.25, Infinity, this.updateEnemy, this);
    },

    update: function() {
        this.game.physics.arcade.collide(this.dude, this.layer);

        this.playerMovement();
        this.collisionDetectionEnemy();
        this.collisionDetectionVitamins();
        this.collisionDetectionPowerups();
        this.collisionDetectionAmeisenbau()
    },

    playerMovement: function() {
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
    },

    updateEnemy: function() {
        console.log("beep");
        var velX = this.enemy.body.velocity.x,
            velY = this.enemy.body.velocity.y;

        if(velX > 0 && velY > 0) {
            this.enemy.body.velocity.y*=-1;
        }
        else if(velX > 0 && velY < 0) {
            this.enemy.body.velocity.x*=-1;
        }
        else if(velX < 0 && velY < 0) {
            this.enemy.body.velocity.y*=-1;
        }
        else if(velX < 0 && velY > 0) {
            this.enemy.body.velocity.x*=-1;
        }
    },

    collisionDetectionEnemy: function() {
        //----Enemy collide----------
        this.physics.arcade.collide(this.dude,this.enemy,function(dude,enemy) {
            if(!this.carryingVitamin) {
                dude.kill();
                this.vitamins = 0;
                this.refreshTexts();
            }
        }, null, this);
    },

    collisionDetectionVitamins: function() {
        //----Star collide----------
        this.physics.arcade.overlap(this.dude,this.stars,function(dude,star) {
            if(!this.carryingVitamin) {
                star.kill();
                this.carryingVitamin = true;
            }
        }, null, this);
    },

    collisionDetectionPowerups: function() {
        //----Carrot collide----------
        this.physics.arcade.overlap(this.dude,this.carrots,function(dude,carrot) {
            carrot.kill();
            this.playerSpeed = this.playerSpeed + 50;
            this.refreshTexts();
        }, null, this);
    },

    collisionDetectionAmeisenbau: function() {
        //----Ameisenbau Collide ---------
        this.physics.arcade.overlap(this.dude, this.ameisenbau, this.returnVitamins, null, this);
    },

    refreshTexts: function() {
        this.vitaminText.text = "Vitamins: " + this.vitamins;
        this.speedText.text = "PlayerSpeed: " + this.playerSpeed;
    },

    decreaseVitamins: function() {
        //---Decrease Vitamins---------
        this.vitamins--;
        this.refreshTexts();
    },

    returnVitamins: function() {
        if(this.carryingVitamin) {
            this.playerSpeed = this.playerSpeed + 25;
            this.vitamins = this.vitamins + 10;
            this.refreshTexts();
            this.carryingVitamin = false;
        }
    },
    pickupVitamin: function(sprite, tile) {
        if(!this.carryingVitamin) {
            //this.map.replace(15, 1);
            this.map.putTile(3, tile.x, tile.y);
            this.carryingVitamin = true;
        }
    }


};

game.state.add('LevelOne', Antom, true);
