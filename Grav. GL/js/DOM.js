class Text {
  constructor (element, value = '') {
    this.element = element
    this.text(value)
  }

  text (val) {
    const { element } = this

    const child = element.firstChild
    const node = document.createTextNode(val)

    if (child) element.removeChild(child)

    element.appendChild(node)
  }
}
