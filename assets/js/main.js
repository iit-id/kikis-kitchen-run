const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 565,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 450 },
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
  this.load.image('kitchen-on-top', 'assets/img/kitchen-on-top.png');

  this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', {
    frameWidth: 123,
    frameHeight: 200,
  });
}

let platforms;
let platformCollider;

function create() {
  this.add.image(0, 0, 'background').setOrigin(0, 0);
  this.add.image(0, 0, 'kitchen-on-top').setOrigin(0, 0);

  platforms = this.physics.add.staticGroup();

  platforms.create(200, 350, 'platform');
  platforms.create(200, 200, 'platform');

  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;

  player = this.physics.add.sprite(200, 50, 'kiki-sprite');

  player.setScale(0.75);
  player.setCollideWorldBounds(true);
  // player = this.player.animations.add('run');

  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('kiki-sprite', {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });

  cursors = this.input.keyboard.createCursorKeys();

  scoreText = this.add.text(10, 16, '0', {
    fontSize: '30px',
    fill: '#88236D',
  });

  platformCollider = this.physics.add.collider(player, platforms);

  player.body.setGravityY(300);
}

function update() {
  if (cursors.up.isDown && player.body.onFloor()) {
    player.body.setVelocityY(-600); // jump up
  }
  if (cursors.down.isDown && player.body.onFloor()) {
    platformCollider.active = false;
    player.body.setVelocityY(600); // jump up
    setTimeout(() => {
      platformCollider.active = true;
    }, 100);
  }

  player.anims.play('run', true);
}

function collectFood(player, food) {
  food.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
}
