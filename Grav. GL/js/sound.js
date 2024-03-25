let AUDIO_STORAGE = {}

const LoadSound = (name, src) => {
  AUDIO_STORAGE[name] = new Audio(src)
}

const PlaySound = (name) => {
  if (window.options.sound) {
    const src = AUDIO_STORAGE[name].src
    const audio = new Audio(src)

    audio.play()
    return audio
  }

  return false
}

LoadSound('shootCannon', 'assets/shoot_cannon_sound.mp3')
LoadSound('hitTarget', 'assets/hit_target_sound.mp3')
