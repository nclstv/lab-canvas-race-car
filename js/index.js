const obstacles = []

const backgroundImage = new Image()
backgroundImage.src = './images/road.png'

const carImage = new Image()
carImage.src = './images/car.png'

const game = {
  canvas: document.getElementById('canvas'),
  img: backgroundImage,
  frames: 0,
  speed: 5,
  y: 0,
  isRunning: false,

  start: function () {
    if (this.isRunning) return
    this.isRunning = true
    this.context = this.canvas.getContext('2d')
    this.interval = setInterval(updateGame, 20)

  },
  stop: function () {
    clearInterval(this.interval);
    this.isRunning = false
    this.context.fillStyle = 'black'
    this.context.fillRect(0, 0, 500, 700)
    this.context.fillStyle = 'red'
    this.context.font = '50px Arial';
    this.context.fillText('Game Over!', 110, 150, 400)
    this.context.fillStyle = 'white'
    this.context.font = '30px Arial'
    this.context.fillText(`Your score is: ${this.points}`, 125, 200, 400)
  },
  move: function () {
    this.y += this.speed;
    this.y %= canvas.height;
  },

  draw: function () {
    this.context.drawImage(this.img, 0, this.y, 500, 700);
    if (this.speed < 0) {
      this.context.drawImage(this.img, 0, this.y + canvas.height, 500, 700);
    } else {
      this.context.drawImage(this.img, 0, this.y - canvas.height, 500, 700);
    }
  },
  clear: function () {
    this.context.clearRect(0, 0, 500, 700);
  },
  score: function () {
    this.points = Math.floor(this.frames / 5);
    this.context.font = '18px Arial';
    this.context.fillStyle = 'black';
    this.context.fillText(`Score: ${this.points}`, 400, 50);
  }
}


class Car {
  constructor(image, width, height, x, y) {
    this.image = image
    this.width = width
    this.height = height
    this.x = x
    this.y = y
  }
  update() {
    const ctx = game.context
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
  }
  move(event) {
    const key = event.key
    if (key === 'ArrowLeft') this.x -= 5
    if (key === 'ArrowRight') this.x += 5
    if (this.x < 0) this.x = 0
    if (this.x > 500 - this.width) this.x = 500 - this.width
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
  crashWith(obstacle) {
    return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
  }
}

class Obstacle {
  constructor(width, height, color, x, y) {
    this.width = width
    this.height = height
    this.color = color
    this.x = x
    this.y = y
  }
  update() {
    const ctx = game.context
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
}


const player = new Car(carImage, 50, 100, 225, 400)


function updateObstacles() {

  obstacles.forEach(obstacle => {
    obstacle.y += 2
    obstacle.update()
  })

  game.frames += 1
  if (game.frames % 120 === 0) {
    let minWidth = 100
    let maxWidth = 300
    let width = Math.floor(Math.random() * (maxWidth - minWidth) + minWidth)
    obstacles.push(new Obstacle(width, 10, 'red', width, -10))
  }
}

function checkGameOver() {
  const crashed = obstacles.some(function (obstacle) {
    return player.crashWith(obstacle);
  });

  if (crashed) {
    game.stop();
  }
}

function updateGame() {
  game.move()
  game.clear()
  game.draw()
  player.update()
  updateObstacles()
  checkGameOver()
  game.score()
}


window.addEventListener('load', () => {

  const startButton = document.getElementById('start-button')
  startButton.addEventListener('click', () => { game.start() })

  document.addEventListener('keydown', event => { player.move(event) })

})