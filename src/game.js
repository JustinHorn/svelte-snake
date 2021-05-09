class Game {

  let snakes = JSON.parse(JSON.stringify(INITIAL_SNAKE));

  const getFood = () => {
    const freeTiles = TILES.filter(
      (t) => !snakes.some((s) => s.x == t.x && s.y == t.y)
    );
    return freeTiles[Math.floor(freeTiles.length * Math.random())];
  };

  let food = getFood();

  let interval;

  const oneStep = () => {
    if (gameOver) return;
    const head = { ...snakes[0] };

    const snakeOnFood = head.x == food.x && head.y == food.y;

    if (snakeOnFood) {
      const lastSnake = snakes[snakes.length - 1];
      snakes = [
        ...snakes,
        { direction: lastSnake.direction, x: lastSnake.x, y: lastSnake.y },
      ];
    }

    const move = {
      0: () =>
        head.x - 1 == -1 ? (head.x = TILES_SQUARE_ROOT - 1) : (head.x -= 1),
      1: () => (head.y + 1 == TILES_SQUARE_ROOT ? (head.y = 0) : (head.y += 1)),
      2: () => (head.x + 1 == TILES_SQUARE_ROOT ? (head.x = 0) : (head.x += 1)),
      3: () =>
        head.y - 1 == -1 ? (head.y = TILES_SQUARE_ROOT - 1) : (head.y -= 1),
    };
    move[head.direction]();

    for (let i = snakes.length - (snakeOnFood ? 2 : 1); i > 0; i--) {
      snakes[i].x = snakes[i - 1].x;
      snakes[i].y = snakes[i - 1].y;
    }

    const gameNowOver = snakes.some(
      (snake) => snake.x === head.x && snake.y === head.y
    );

    gameStatus.set(gameNowOver);
    if (gameNowOver) {
      clearInterval(interval);
      return;
    }

    snakes[0] = head;
    snakes = snakes;
    if (snakeOnFood) {
      food = getFood();
    }
  };

  const changeDirection = (e) => {
    clearInterval(interval);
    if (gameOver) return;
    const head = snakes[0];
    switch (e.code) {
      case 'ArrowRight':
      case 'KeyD':
        head.direction += 1;
        if (head.direction == 4) head.direction = 0;
        break;
      case 'ArrowLeft':
      case 'KeyA':
        head.direction -= 1;
        if (head.direction == -1) head.direction = 3;

        break;
    }
    snakes[0] = head;

    oneStep();
    interval = setInterval(oneStep, MOVE_TIME);
  };


}
