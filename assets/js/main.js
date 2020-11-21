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

  this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', {
    frameWidth: 123,
    frameHeight: 200,
  });
}

// const platforms;

function create() {
  this.add.image(400, 300, 'background');

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'platform').refreshBody();

  platforms.create(400, 350, 'platform');
  platforms.create(400, 150, 'platform');

  player = this.physics.add.sprite(100, 50, 'kiki-sprite');

  player.setScale(1);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000',
  });

  this.physics.add.collider(player, platforms);

  player.body.setGravityY(300);
}

function update() {
  if ((cursors.space.isDown || cursors.up.isDown) && player.body.onFloor()) {
    player.body.setVelocityY(-600); // jump up
  }

  function collectFood(player, food) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
  }
}
