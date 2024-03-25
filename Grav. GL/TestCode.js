window.addEventListener('load', () => {
    const game = new GameManager();
    game.world.border(6)
    game.restart()

    const fpsOutput = document.getElementById('fpsOutput');

    let fps = 0,
        referenceFrame = 0,
        referenceTime = Date.now();

    game.resize();

    const loop = () => {
        referenceFrame++;;
        if (referenceFrame > 10) {
            let currentTime = Date.now(),
                difference = currentTime - referenceTime,
                secondsPassed = difference * 0.001;
            fps = Math.round(referenceFrame / secondsPassed)
            fpsOutput.innerHTML = `${fps} fps`;
            referenceTime = Date.now();
            referenceFrame = 0;
        }

        game.resize();
        game.update();
        window.requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('resize', () => {
        game.resize();
    });
});
