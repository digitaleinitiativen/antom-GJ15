game = new (Phaser.Game)(800, 400, Phaser.AUTO, 'game')

ASGame = (game) ->
  @game = game
  this.bg = null
  this.dude = null
  this.cursors = null
  this.stars = null
  this.scorebox = null
  this.score = 0
  return

ASGame.prototype =

  init: ->
    this.physics.startSystem(Phaser.Physics.ARCADE)
    this.cursors = this.input.keyboard.createCursorKeys()
    console.log 'init'
    return

  preload: ->
    this.load.baseURL = '/'
    this.load.image 'bg', 'images/background.png'
    this.load.image 'star2', 'images/star2.png'
    this.load.image 'star', 'images/star.png'
    this.load.spritesheet 'dude', 'images/dude.png', 32, 48
    return

  create: ->
    style =
      fill: '#ffffff'

    this.world.setBounds 0, 0, 1600, 400

    this.bg = this.add.tileSprite 0,130,1600,400, 'bg'

    this.stars = this.add.group()
    this.stars.enableBody = true
    i = 0
    while i < 40
      $star = this.stars.create Math.random() * this.world.width, Math.random() * this.world.height, 'star'
#      this.stars.create Math.random() * this.world.width, Math.random() * this.world.height, 'star2'
      i++

    this.scorebox = this.add.text(10,10, '0 Sterne', style)
    this.scorebox.fixedToCamera = true

    this.dude = this.add.sprite 0,0, 'dude'

    this.physics.enable this.dude
    this.dude.body.gravity.y = 1000
    this.dude.body.collideWorldBounds = true
    this.dude.body.bounce.y = 0.3

    this.dude.animations.add 'stand', [4], 1, false
    this.dude.animations.add 'left', [0,1,2,3], 10, true
    this.dude.animations.add 'right', [5,6,7,8], 10, true

    this.camera.follow this.dude

    return

  update: ->
    this.physics.arcade.overlap this.dude, this.stars, (dude, star) =>
      star.kill()
      @addScore()

    this.dude.body.velocity.x = 0
    $speed = 260

    if this.cursors.right.isDown
      this.dude.body.velocity.x = $speed
      this.dude.animations.play('right')
    else if this.cursors.left.isDown
      this.dude.body.velocity.x = -$speed
      this.dude.animations.play('left')
    else
      this.dude.animations.play('stand')

    if this.cursors.up.isDown && this.dude.body.onFloor()
      this.dude.body.velocity.y = -$speed * 5

  addScore: ->
    this.score++
    this.scorebox.text = this.score + ' Store'

game.state.add 'LevelOne', ASGame, true
