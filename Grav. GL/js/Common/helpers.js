const calculateAttraction = (a, b) => {
  let force = a.pos.clone().sub(b.pos).normalize()

  let dist = force.len2()
  dist = constrain(dist, 0.01, 1000)

  const strength = (AG * a.mass * b.mass) / dist

  force.scale(strength)
  return force
}

const constrain = (a, min, max) => {
  if (a < min) return min
  if (a > max) return max
  return a
}

const cloneVectorArray = (a, len = a.length) => {
  let copy = []
  for (let i = 0; i < len; i++) {
    copy[i] = a[i].clone()
  }
  return copy
}

const copyVectorArray = (a, output, len = a.length) => {
    for (let i = 0; i < len; i++) {
        output[i].copy(a[i])
    }
    return output.slice(0, len)
};

const formatString = (string, value, amount) => {
  const padding = value.repeat(amount)
  const str = padding.concat(string)

  return str.slice(-amount)
}

const firstCharUpperCase = (string) => string.charAt(0).toUpperCase().concat(string.slice(1))

const random = (min, max = 0) => Math.random() * (max - min) + min;

const randomInt = (min, max) => Math.floor( random(min, max + 1) );
