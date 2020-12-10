const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 555,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
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
  game.paused = false;
  this.load.image('background', 'assets/img/background.png');
  this.load.image('kitchen-on-top', 'assets/img/kitchen-on-top.png');
  this.load.image('platform', 'assets/img/platform.png');

  this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', {
    frameWidth: 123,
    frameHeight: 200,
  });

  this.load.image('apple', 'assets/img/apple.png');
  this.load.image('cheese', 'assets/img/cheese.png');
  this.load.image('cupcake', 'assets/img/cupcake.png');
  this.load.image('pizza', 'assets/img/pizza.png');
  this.load.image('sushi', 'assets/img/sushi.png');
  this.load.image('moldybread', 'assets/img/moldybread.png');
  this.load.audio('music', ['assets/audio/music.mp3']);
  this.load.audio('getpoints', ['assets/audio/getpoints.mp3']);
  this.load.audio('leveldown', ['assets/audio/leveldown.mp3']);
}

const platformHeights = [130, 280, 500];

let platforms;
let platformCollider;
let item;
let player;
let foodlist;
let score = 0;
let scoreText;
let moldyBread;
let gameOver;
let gameoverText;

function create() {
  platforms = this.physics.add.staticGroup();

  platforms.create(200, 340, 'platform');
  platforms.create(200, 180, 'platform');

  this.background1 = this.add
    .tileSprite(0, 0, 900, 900, 'background')
    .setOrigin(0, 0);

  this.background2 = this.add
    .tileSprite(0, 0, 900, 900, 'kitchen-on-top')
    .setOrigin(0, 0);

  player = this.physics.add.sprite(200, 50, 'kiki-sprite');

  player.setScale(0.75);
  player.setCollideWorldBounds(true);

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

  platformCollider = this.physics.add.collider(player, platforms);

  player.body.setGravityY(300);

  this.items = this.physics.add.group();
  this.items.create(-100, -100, 'moldybread');
  this.items.create(-100, -100, 'pizza');
  this.items.create(-100, -100, 'cupcake');
  this.items.create(-100, -100, 'sushi');
  this.items.create(-100, -100, 'apple');
  this.items.create(-100, -100, 'cheese');
  this.physics.add.overlap(player, this.items, collectItem);

  this.items.children.entries.forEach((item) => {
    resetLocation(item);
  });

  getpoints = this.sound.add('getpoints');
  leveldown = this.sound.add('leveldown');
  music = this.sound.add('music');
  music.play();

  scoreText = this.add.text(840, 16, '0', {
    fontFamily: 'Comfortaa',
    fontSize: '30px',
    fill: '#88236D',
  });

  gameoverText = this.add.text(175, 200, '', {
    fontFamily: 'Comfortaa',
    fontSize: '100px',
    fill: '#88236D',
    stroke: '#000',
    strokeThickness: 1,
    shadow: {
      offsetX: 2,
      offsetY: 2,
      color: '#A9A9A9',
      blur: 2,
      stroke: true,
      fill: true,
    },
  });
}

function update() {
  if (gameOver) {
    return;
  }

  // Move background
  this.background1.tilePositionX += 5;
  this.background2.tilePositionX += 5;

  this.items.children.entries.forEach((item) => {
    // Move items
    item.x -= 5;

    // Warp items to new location if off screen
    if (item.x < 0) {
      resetLocation(item);
    }
  });

  if (cursors.up.isDown && player.body.onFloor()) {
    platformCollider.active = false;
    player.body.setVelocityY(-800); // jump up
    setTimeout(() => {
      platformCollider.active = true;
    }, 100);
  }
  if (cursors.down.isDown && player.body.onFloor()) {
    platformCollider.active = false;
    player.body.setVelocityY(600); // jump down
    setTimeout(() => {
      platformCollider.active = true;
    }, 100);
  }

  player.anims.play('run', true);
}

function resetLocation(object) {
  object.x = Phaser.Math.Between(config.width, config.width * 4);
  object.y = platformHeights[Phaser.Math.Between(0, 2)];
}

function collectItem(player, item) {
  const key = item.texture.key;

  if (key === 'moldybread') {
    item.disableBody(true, true);

    gameoverText.setText('Game Over');
    player.anims.stop();

    game.paused = true;
    gameOver = true;

    leveldown.play();
  } else {
    getpoints.play();

    resetLocation(item);

    score += 10;
    scoreText.setText(score);
  }
}
