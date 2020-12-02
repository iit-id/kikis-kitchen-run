const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 555,
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
}

let platforms;
let platformCollider;
let food;

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

  // this.food = this.physics.add.group();
  // this.food.add(this.pizza);
  // this.food.add(this.cupcake);
  // this.food.add(this.sushi);
  // this.food.add(this.cheese);
  // this.food.add(this.apple);

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

  scoreText = this.add.text(10, 16, '0', {
    fontSize: '30px',
    fill: '#88236D',
  });

  platformCollider = this.physics.add.collider(player, platforms);

  player.body.setGravityY(300);

  // let food = this.game.rnd.integerInRange(0, 5);
  // let food;

  this.food = this.add.group({
    key: 'cupcake',
    setXY: {
      x: 1000,
      y: 500,
      stepX: 70,
    },
  });

  this.physics.add.overlap(player, food, null, this);
}

function update() {
  this.background1.tilePositionX += 5;
  this.background2.tilePositionX += 5;
  this.food.incX(-5);

  if (cursors.up.isDown && player.body.onFloor()) {
    platformCollider.active = false;
    player.body.setVelocityY(-600); // jump up
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

function collectFood(player, food) {
  food.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
}
