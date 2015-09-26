game = new (Phaser.Game)(800, 400, Phaser.AUTO, 'game')

Antom = (game) ->
  @game = game
  this.bg = null
  this.dude = null
  this.cursors = null
  this.stars = null
  this.scorebox = null
  this.score = 0
  return