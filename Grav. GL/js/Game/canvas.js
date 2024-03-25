class CanvasRatioManager {
  constructor (canvas, element, ratio) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.element = element || false
    this.elementSizing = {
      width: 0,
      height: 0
    }

    this.borderLeft = 0
    this.borderTop = 0
    this.left = 0
    this.right = 0

    this.setRatio(ratio)
    this.calcSize()
  }

  clearScreen () {
    const ctx = this.ctx
    const canvas = this.canvas
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
  }

  resize (w, h) {
    const width = w - this.borderLeft * 2
    const height = h - this.borderTop * 2

    this.canvas.width = width
    this.width = width

    this.canvas.height = height
    this.height = height

    this.area = width * height
  }

  setRatio (ratio) {
    this.ratio = ratio
    this.inv_ratio = 1 / ratio
  }

  getBestFit () {
    const { elementSizing } = this

    const width = elementSizing.width
    const height = elementSizing.height

    const elementArea = width * height

    const ratio = this.ratio
    const invRatio = this.inv_ratio

    const fullWidth = {
      width: width,
      height: width * invRatio
    }

    const fullHeight = {
      width: height * ratio,
      height: height
    }

    const area1 = fullWidth.width * fullWidth.height
    const area2 = fullHeight.width * fullHeight.height

    if (area1 > elementArea) {
      return fullHeight
    }

    if (area2 > elementArea) {
      return fullWidth
    }

    if (area1 > area2) {
      return fullWidth
    }

    return fullHeight
  }

  calcSize () {
    const { element, elementSizing } = this

    if (element) {
      elementSizing.width = element.clientWidth
      elementSizing.height = element.clientHeight
    } else {
      elementSizing.width = window.innerWidth
      elementSizing.height = window.innerHeight
    }

    const size = this.getBestFit()

    this.resize(size.width, size.height)
  }

  border (height, color = '#000') {
    const style = this.canvas.style
    const width = height * this.ratio

    style.borderStyle = 'solid'
    style.borderColor = color

    style.borderLeftWidth = `${width}px`;
    style.borderRightWidth = `${width}px`;

    style.borderTopWidth = `${height}px`
    style.borderBottomWidth = `${height}px`;

    this.borderLeft = width
    this.borderTop = height

    this.calcSize()
    this.center()
  }

  setPos (x, y) {
    const style = this.canvas.style

    style.position = 'relative'

    if (x) {
      const left = x - this.borderLeft

      style.left = `${left}px`
      this.left = left
    }

    if (y) {
      const top = y - this.borderTop

      style.top = `${top}px`
      this.top = top
    }
  }

  center () {
    const { elementSizing, canvas } = this

    let x = elementSizing.width - canvas.width
    let y = elementSizing.height - canvas.height

    x *= 0.5
    y *= 0.53

    this.setPos(x, y)
  }

  static create(canvas, element, ratio) {
    return new CanvasRatioManager(canvas, element, ratio)
  }
}
