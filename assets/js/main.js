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

  // this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', 3, 5);
}

// const platforms;

function create() {
  this.add.image(400, 300, 'background');

  // platforms = this.physics.add.staticGroup();
  // platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  this.add.image(100, 300, 'player');
  // this.add.spritesheet(300, 200, 'kiki-sprite');
  // this.anims.create('run');
  // this.anims.create('run', 30, true);
  player = this.physics.add.sprite(100, 450, 'kiki-sprite');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
}

function update() {}
