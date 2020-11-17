const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', 'assets/img/background.png');
  this.load.image('player', 'assets/img/player.png');
}

function create() {
  this.add.image(400, 300, 'background');
  this.add.image(400, 300, 'player');
}

function update() {}
