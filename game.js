Antom.State.Game = function(game) {
    this.game = game;
    this.arrow = null;
    this.dude = null;
    this.purpleEnemies = null;
    this.blueEnemies = null;
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
    this.bar = null;
    this.barSprite = null;
};
Antom.State.Game.prototype = {
    init: function() {
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.controls = this.input.keyboard.createCursorKeys();
    },
    preload: function() {

    },
    initPlayer: function() {
        //----Initialize player----
        this.dude = this.add.sprite(this.game.world.centerX, this.game.world.centerY,'dude');
        //this.dude = this.add.sprite(200, 200,'dude');
        this.physics.arcade.enable(this.dude);
        this.dude.body.collideWorldBounds = true;
        this.camera.follow(this.dude);
        this.dude.animations.add('stand', [3], 1, false);
        this.dude.animations.add('left', [0,1,2], 10, true);
        this.dude.animations.add('right', [4,5,6], 10);
        this.dude.animations.add('up', [8,9,10], 10);
        this.dude.animations.add('down', [11,12,13], 10);
        this.dude.animations.add('jump', [3,7,3,7], 10);
    },

    initEnemyGroups: function() {
        this.purpleEnemies = this.add.group();
        this.purpleEnemies.enableBody = true;
        this.blueEnemies = this.add.group();
        this.blueEnemies.enableBody = true;

    },

    initEnemyPurple: function(x,y) {
        var purpleEnemy = this.purpleEnemies.create(x,y, '001_Enemy_Purple');
        purpleEnemy.body.collideWorldBounds = true;
        purpleEnemy.body.immovable = true;
        purpleEnemy.body.velocity.x = purpleEnemy.body.velocity.y = this.enemySpeed;
    },

    initEnemyBlue: function(x,y) {
        var blueEnemy = this.blueEnemies.create(x,y, '001_Enemy_Blue');
        blueEnemy.body.collideWorldBounds = true;
        blueEnemy.body.immovable = true;
        blueEnemy.body.velocity.x = this.enemySpeed;
    },

    initText: function() {
        //-----Score Text----
        var style = {
            fill: "#fff"
        };

        this.vitaminText = this.add.text(10,10, "Vitaminlevel:", style);
        this.vitaminText.fixedToCamera = true;

        this.speedText = this.add.text(10, 40, "PlayerSpeed: " + this.playerSpeed, style);
        this.speedText.fixedToCamera = true;
    },
    initHealthBar: function() {
        this.bar = this.add.bitmapData(100,8);
        this.barSprite = this.add.sprite(200,22.5, this.bar);
        this.barSprite.fixedToCamera = true;
    },
    initAmeisenbau: function() {
        //----Ameisenbau----
        this.ameisenbau = this.add.sprite(this.world.centerX, this.world.centerY,'ameisenbau');
        this.ameisenbau.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.ameisenbau);
    },
    setTilemap: function() {
        // set tilemap
        this.map = this.add.tilemap('map');
        this.map.addTilesetImage('001_Lawn_Sprite');
        this.map.setCollisionBetween(4, 14);

        this.map.addTilesetImage('001_Fruititem_Lemon');
        this.map.addTilesetImage('001_Fruititem_Orange');
        this.map.addTilesetImage('001_Enemy_Blue');
        this.map.addTilesetImage('001_Enemy_Purple');
        this.layer = this.map.createLayer('Kachelebene 1');
        //  This will set Tile ID 15 (the lemon) to call the function when collided with
        this.map.setTileIndexCallback(15, this.pickupVitamin, this);


    },


    create: function() {

        this.setTilemap();

        this.initText();
        this.initHealthBar();
        this.initAmeisenbau();
        this.initPlayer();
        this.initEnemyGroups();
        this.initEnemyBlue(500,500);
        this.initEnemyPurple(400,400);

        this.arrow = this.add.sprite(this.world.centerX, this.world.centerY, 'arrow');
        this.arrow.anchor.setTo(0.5, 0.5);

        ///Timer for Vitamins
        this.time.events.loop(Phaser.Timer.SECOND * 0.5, this.decreaseVitamins, this);
        this.time.events.repeat(Phaser.Timer.SECOND * 1.25, Infinity, this.updatePurpleEnemies, this);
        this.time.events.repeat(Phaser.Timer.SECOND * 1.25, Infinity, this.updateBlueEnemies, this);
    },

    update: function() {
        this.game.physics.arcade.collide(this.dude, this.layer);

        this.playerMovement();
        this.showArrow();
        this.updateHealthBar();
        this.collisionDetectionPurpleEnemy();
        this.collisionDetectionBlueEnemy();
        this.collisionDetectionVitamins();
        this.collisionDetectionPowerups();
        this.collisionDetectionAmeisenbau();

        this.arrow.rotation = this.physics.arcade.angleBetween(this.arrow, this.ameisenbau);
    },
    updateHealthBar: function() {
        this.bar.context.clearRect(0, 0, this.bar.width, this.bar.height);
        if (this.vitamins < 32) {
            this.bar.context.fillStyle = '#f00';
        }
        else if (this.vitamins < 64) {
            this.bar.context.fillStyle = '#ff0';
        }
        else {
            this.bar.context.fillStyle = '#0f0';
        }
        this.bar.context.fillRect(0, 0, this.vitamins, 8);
        this.bar.dirty = true;
        this.barSprite.position.x = this.dude.position.x - this.barSprite.width / 4;
        this.barSprite.position.y = this.dude.position.y - 50;
    },
    showArrow: function() {
        if(this.carryingVitamin) {
            this.arrow.position.x = this.dude.position.x + 50;
            this.arrow.position.y = this.dude.position.y + 50;
            this.arrow.visible = true;
        }
        else {
            this.arrow.visible = false;
        }
    },
    playerMovement: function() {
        //-----Player movement--------
        this.dude.body.velocity.x = 0;
        this.dude.body.velocity.y = 0;

        if(this.controls.left.isDown) {
            this.dude.body.velocity.x = -this.playerSpeed;
            this.dude.animations.play('left')
        }
        else if(this.controls.right.isDown) {
            this.dude.body.velocity.x = this.playerSpeed;
            this.dude.animations.play('right')
        }
        else if(this.controls.up.isDown) {
            this.dude.body.velocity.y = -this.playerSpeed;
            this.dude.animations.play('up')
        }
        else if(this.controls.down.isDown) {
            this.dude.body.velocity.y = this.playerSpeed;
            this.dude.animations.play('down')
        }
        else {
            this.dude.animations.play('jump')
        }

    },

    updatePurpleEnemies: function() {
        this.purpleEnemies.forEach(function(item) {
            var velX = item.body.velocity.x,
                velY = item.body.velocity.y;

            if(velX > 0 && velY > 0) {
                item.body.velocity.y*=-1;
            }
            else if(velX > 0 && velY < 0) {
                item.body.velocity.x*=-1;
            }
            else if(velX < 0 && velY < 0) {
                item.body.velocity.y*=-1;
            }
            else if(velX < 0 && velY > 0) {
                item.body.velocity.x*=-1;
            }
        });
    },

    updateBlueEnemies: function() {
        this.blueEnemies.forEach(function(item) {
            item.body.velocity.x *= -1;
        });
    },

    collisionDetectionPurpleEnemy: function() {
        //----Enemy collide----------
        this.physics.arcade.collide(this.dude,this.purpleEnemies,function(dude,enemy) {
            dude.kill();
            enemy.kill();
            this.vitamins = 0;
            this.refreshTexts();
        }, null, this);
    },

    collisionDetectionBlueEnemy: function() {
        //----Enemy collide----------
        this.physics.arcade.collide(this.dude,this.blueEnemies,function(dude,enemy) {
            dude.kill();
            enemy.kill();
            this.vitamins = 0;
            this.refreshTexts();
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
        //this.vitaminText.text = "Vitamins: " + this.vitamins;
        this.speedText.text = "PlayerSpeed: " + this.playerSpeed;
    },
    decreaseVitamins: function() {
        //---Decrease Vitamins---------
        this.vitamins--;
        if(this.vitamins <= 0) {
            this.dude.kill();
        }
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
        if (!this.carryingVitamin) {
            //this.map.replace(15, 1);
            this.map.putTile(3, tile.x, tile.y);
            this.carryingVitamin = true;
        }
    }

};

//game.state.add('LevelOne', Antom, true);
