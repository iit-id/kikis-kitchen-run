const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
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

  this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', {
    frameWidth: 123,
    frameHeight: 200,
  });
}

// const platforms;

function create() {
  this.add.image(400, 300, 'background');

  platforms = this.physics.add.staticGroup();

  player = this.physics.add.sprite(100, 50, 'kiki-sprite');
  player.setScale(1);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  platforms.create(400, 568, 'platform').refreshBody();

  platforms.create(400, 350, 'platform');
  platforms.create(400, 150, 'platform');
}

function update() {}
