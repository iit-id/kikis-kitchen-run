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
  // platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  //this.add.image(100, 300, 'player');
  // this.add.spritesheet(300, 200, 'kiki-sprite');
  // this.anims.create('run');
  // this.anims.create('run', 30, true);
  player = this.physics.add.sprite(100, 50, 'kiki-sprite');
  player.setScale(1);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
}

function update() {}
