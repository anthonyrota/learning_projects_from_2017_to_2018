class InputManager {
  constructor (element) {
    this.element = element

    this.mouse = Vector.create()
    this.drag = false
    this.keystates = {}

    this.add('document-keydown', (e) => {
      this.keystates[e.keyCode] = true
    })

    this.add('document-keyup', (e) => {
      delete this.keystates[e.keyCode]
    })

    this.add('mousedown', (e) => {
      e.preventDefault()
      const rect = this.element.getBoundingClientRect()
      this.drag = this.contains(rect, e.clientX, e.clientY)
    })

    this.add('mouseup touchend', (e) => {
      e.preventDefault()
      this.drag = false
    })

    this.add('mousemove', (e) => {
      e.preventDefault()

      const rect = this.element.getBoundingClientRect()
      this.mouse.x = e.clientX - rect.left
      this.mouse.y = e.clientY - rect.top

      if (this.drag && !this.contains(rect, e.clientX, e.clientY)) {
        this.drag = false
      }
    })

    this.add('touchstart', (e) => {
      const rect = this.element.getBoundingClientRect()
      const touch = e.touches[0]
      this.mouse.x = touch.clientX - rect.left
      this.mouse.y = touch.clientY - rect.top
      this.drag = this.contains(rect, touch.clientX, touch.clientY)
    })

    this.add('touchmove', (e) => {
      const rect = this.element.getBoundingClientRect()
      const touch = e.touches[0]
      this.mouse.x = touch.clientX - rect.left
      this.mouse.y = touch.clientY - rect.top
      this.drag = this.contains(rect, touch.clientX, touch.clientY)
    })
  }

  contains (rect, x, y) {
    const { mouse } = this
    return (
      x > rect.left &&
      x < rect.right &&
      y > rect.top &&
      y < rect.bottom
    )
  }

  add (events, callback) {
    const array = events.split(' ')

    for (let i = 0; i < array.length; i++) {
      const event = array[i]

      if (event.includes('window-')) {
        const name = event.slice(7)

        window.addEventListener(name, callback)
        continue;
      }

      if (event.includes('document-')) {
        const name = event.slice(9)

        window.addEventListener(name, callback)
      }

      window.addEventListener(event, callback)
    }
  }

  static create (element) {
    return new InputManager(element)
  }
}
