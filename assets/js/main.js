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
  gameOver = false;
  score = 0;

  this.load.image('background', 'assets/img/background.png');
  this.load.image('kitchen-on-top', 'assets/img/kitchen-on-top.png');
  this.load.image('platform', 'assets/img/platform.png');

  // Load player spritesheet
  this.load.spritesheet('kiki-sprite', 'assets/img/kiki-sprite.png', {
    frameWidth: 123,
    frameHeight: 200,
  });

  // Load images and music into game
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
let score = 0;
let scoreText;
let moldyBread;
let gameOver;
let gameoverText;
let restartButton;

function create() {
  // The platforms group contains the 3 ledges we can jump between
  platforms = this.physics.add.staticGroup();

  // The two platform positions
  platforms.create(200, 340, 'platform');
  platforms.create(200, 180, 'platform');

  // The background images as tileSprites so they can move
  this.background1 = this.add
    .tileSprite(0, 0, 900, 900, 'background')
    .setOrigin(0, 0);
  this.background2 = this.add
    .tileSprite(0, 0, 900, 900, 'kitchen-on-top')
    .setOrigin(0, 0);

  // The player and its settings
  player = this.physics.add.sprite(200, 50, 'kiki-sprite');

  // Scale to fit the game
  player.setScale(0.75);
  player.setCollideWorldBounds(true);

  // Player animations
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('kiki-sprite', {
      start: 0,
      end: 5,
    }),
    frameRate: 10,
    repeat: -1,
  });

  // Input Events
  cursors = this.input.keyboard.createCursorKeys();

  // Collide the player with the platforms
  platformCollider = this.physics.add.collider(player, platforms);

  player.body.setGravityY(300);

  // Group and create food items
  this.items = this.physics.add.group();
  this.items.create(-100, -100, 'moldybread');
  this.items.create(-100, -100, 'pizza');
  this.items.create(-100, -100, 'cupcake');
  this.items.create(-100, -100, 'sushi');
  this.items.create(-100, -100, 'apple');
  this.items.create(-100, -100, 'cheese');

  // Checks to see if the player overlaps with any of the items, if she does call the collectItem function
  this.physics.add.overlap(player, this.items, collectItem);

  this.items.children.entries.forEach((item) => {
    resetLocation(item);
  });

  // Sound effects and play music
  getpoints = this.sound.add('getpoints');
  leveldown = this.sound.add('leveldown');
  music = this.sound.add('music');
  music.play();
  music.loop = true;

  // The score
  scoreText = this.add.text(820, 16, '0', {
    fontFamily: 'Comfortaa',
    fontSize: '30px',
    fill: '#88236D',
  });

  // Game over
  gameoverText = this.add.text(240, 210, '', {
    fontFamily: 'Comfortaa',
    fontSize: '70px',
    fill: '#88236d',
  });

  // Restart game
  restartButton = this.add.text(400, 310, '', {
    fontFamily: 'Comfortaa',
    fontSize: '20px',
    fill: '#fff',
    backgroundColor: '#88236d',
  });
  restartButton.setInteractive();
  restartButton.on('pointerdown', () => this.scene.restart());
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

  // Animate player
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

    // Game over text and stop player animation
    gameoverText.setText('Game Over');
    player.anims.stop();

    restartButton.setText('play again');

    // Pause the game when game over
    game.paused = true;
    gameOver = true;

    // Play sound effect
    leveldown.play();
    music.stop();
  } else {
    // Play sound effect
    getpoints.play();

    resetLocation(item);

    // Add and update the score
    score += 10;
    scoreText.setText(score);
  }
}
