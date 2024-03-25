class GameManager {
  constructor () {
    this.ratio = 12 / 17
    this.size = 26

    this.canvas = document.getElementById('game-canvas')
    this.info = document.getElementById('info')
    this.stats = document.getElementById('stats')
    this.screen = document.getElementById('game-screen')
    this.pause = document.getElementById('pause')
    this.coinImage = document.getElementById('coins-svg')
    this.closePause = document.getElementById('close-pause')
    this.continueBtn = document.getElementById('pause-button--continue')
    this.restartBtn = document.getElementById('pause-button--restart')

    const main = document.getElementById('simulation-container')
    const score = document.getElementById('score')
    const coinImage = document.getElementById('coins-image')
    const stats = document.getElementById('stats')
    const pause = document.getElementById('pause-screen')

    this.container = { main, score, coinImage, stats, pause }

    const scoreText = document.getElementById('score-value')
    const coinsText = document.getElementById('coins-value')
    const timerText = document.getElementById('timer-value')
    const hitTargetText = document.getElementById('targets-hit-value')

    this.text = {
      score: new Text(scoreText, '0'),
      coins: new Text(coinsText, '10'),
      timer: new Text(timerText, '00:00'),
      hitTarget: new Text(hitTargetText, '70 | 500')
    }

    this.paused = false

    const handlePauseClick = (e) => window.setTimeout(() => {
      this.paused = true
      this.timer.stop()
    }, 120)

    this.pause.addEventListener('mousedown', handlePauseClick)
    this.pause.addEventListener('touchstart', handlePauseClick)

    const handleClosePause = (e) => window.setTimeout(() => {
      this.paused = false
      this.timer.start()
    }, 80)

    this.closePause.addEventListener('mousedown', handleClosePause)
    this.closePause.addEventListener('touchstart', handleClosePause)
    this.continueBtn.addEventListener('mousedown', handleClosePause)
    this.continueBtn.addEventListener('touchstart', handleClosePause)

    const handleRestartGame = (e) => window.setTimeout(() => {
      handleClosePause()
      this.restart()
    }, 90)

    this.restartBtn.addEventListener('mousedown', handleRestartGame)
    this.restartBtn.addEventListener('touchstart', handleRestartGame)

    const {
      canvas,
      ratio,
      size,
      screen
    } = this

    this.world = World.create(canvas, ratio, size, screen)
    this.world.init()

    this.timer = Timer.create()
    this.timer.restart()
  }

  restart () {
    this.world.reset()
    this.timer.restart()

    this.world.init()

    const { world } = this
    const { width, height } = world
    const halfWidth = width * 0.5
    const halfHeight = height * 0.5

    {
      const pos = Vector.create(halfWidth, halfHeight)
      const circle = Circle.create(pos, 1.5, 0.5)
      const body = Body.create(circle)
      const def = Def.create({
        oscilate: true,
        oscilationStrength: 0.05,
        minOscilationSize: 0.5,
        oscilationSpeed: 10,
        rotate: 1,
        vel: Vector.create(random(-0.1, 0.1), random(-0.2, 0.2))
      })

      world.addGravity(body, def)
    }

    {
      const amount = 10

      for (let i = 0; i < amount; i++) {
        const pos = Vector.randomFromBox(width / 3, height / 3).add(Vector.create(halfWidth, halfHeight))

        const def = Def.create({
          oscilate: true,
          oscilationStrength: 0.05,
          minOscilationSize: 0.5,
          oscilationSpeed: 10,
          angle: random(0, TWO_PI),
          rotate: random(-0.05, 0.05),
          vel: Vector.create(random(-0.1, 0.1), random(-0.1, 0.1))
        })
        const sides = randomInt(3, 8)

        const poly = RegularPolygon.create(pos, sides, 1, 2)
        const body = Body.create(poly)

        world.addStatic(body, def)
      }
    }

    world.shake(0.7, 105);

    this.resize()
  }

  resize () {
    const {
      canvas,
      container,
      world,
      info,
      pause,
      coinImage
    } = this

    world.resize()

    const canvasBounds = canvas.getBoundingClientRect()
    const containerBounds = container.main.getBoundingClientRect()

    const ratio = world.canvasRatio

    let height = canvasBounds.top - containerBounds.top
    let width = canvasBounds.right - containerBounds.left
    let screenHeight = containerBounds.bottom - containerBounds.top

    height = constrain(height, 0, screenHeight * 0.13)

    const fullWidth = containerBounds.right - containerBounds.left
    const infoLeft = (fullWidth - width) / 2

    info.style.left = `${infoLeft}px`
    info.style.height = `${height}px`
    info.style.width = `${width}px`

    const pauseHeight = height * 0.7

    pause.style.height = `${pauseHeight}px`
    pause.style.width = `${pauseHeight}px`

    const score = container.score
    const scoreLeft = width * 0.04 + pauseHeight

    score.style.left = `${scoreLeft}px`

    const coin = container.coinImage
    const radius = height * 0.1
    const radiusWidth = radius * 0.25
    const coinLeft = width - 3 * radius

    coinImage.setAttribute('r', radius)
    coinImage.setAttribute('stroke-width', radiusWidth)

    coin.style.marginLeft = `${coinLeft}px`

    const coinText = this.text.coins.element
    const coinTextRight = radius * 4.7

    coinText.style.right = `${coinTextRight}px`

    const stats = container.stats

    height = containerBounds.bottom - canvasBounds.bottom

    stats.style.left = `${infoLeft}px`
    stats.style.width = `${width}px`
    stats.style.height = `${height}px`
  }

  update () {
    const { container, canvas } = this
    const { pause } = container
    const ctx = this.world.ctx

    if (this.paused) {
      canvas.style.opacity = '0.2'

      window.setTimeout(() => {
        pause.style.opacity = '.7'
      }, 80)

      pause.style.display = 'block'

      return
    }

    this.world.renderScene()

    if (canvas.style.opacity !== '1' || pause.style.opacity !== '0' || pause.style.display !== 'none') {
      pause.style.opacity = '0'

      window.setTimeout(() => {
        canvas.style.opacity = '1'
      }, 80)

      window.setTimeout(() => {
        pause.style.display = 'none'
      }, 200)
    }

    this.world.update()

    const { score, timer, hitTarget } = this.text

    const targetToHit = 500
    const moversHit = constrain(this.world.moversHit, 0, targetToHit)

    let hitText = `${moversHit}`
    if (hitText.length === 1) {
      hitText = _SPACE.concat(hitText)
    }

    score.text(`${this.world.score}`)
    timer.text(`${this.timer.get()}`)
    hitTarget.text(`${hitText} / ${targetToHit}`)
  }
}
