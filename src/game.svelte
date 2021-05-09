<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import {
    INITIAL_SNAKE,
    TILES_SQUARE_ROOT,
    MOVE_TIME,
    MAP,
    TILES,
  } from './constants';
  import { gameStatus } from './status';

  let gameOver;

  gameStatus.subscribe((value) => (gameOver = value));

  let snakes = JSON.parse(JSON.stringify(INITIAL_SNAKE));

  const dispatch = createEventDispatcher();

  $: dispatch('snakes', {
    snakes,
  });

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

  onMount(() => {
    interval = setInterval(oneStep, MOVE_TIME);

    window.addEventListener('keydown', changeDirection);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', changeDirection);
    };
  });

  const restart = () => {
    gameStatus.set(false);
    food = getFood();

    snakes = JSON.parse(JSON.stringify(INITIAL_SNAKE));
    clearInterval(interval);
    interval = setInterval(oneStep, MOVE_TIME);
  };
</script>

{#if gameOver}
  <button on:click={restart}> Restart!</button>
{/if}

<div class="field">
  {#each MAP as row, row_index}
    <div class="row">
      {#each row as columnElement, column_index}
        {#if snakes.some((snake) => snake.x == row_index && snake.y == column_index && snake.head)}
          <div class="columnElement snake head" />
        {:else if snakes.some((snake) => snake.x == row_index && snake.y == column_index)}
          <div class="columnElement snake" />
        {:else if food.x == row_index && food.y == column_index}
          <div class="columnElement food" />
        {:else}
          <div class="columnElement " />
        {/if}
      {/each}
    </div>
  {/each}
</div>

<style>
  .field {
    width: fit-content;
    margin: auto;
  }

  .row {
    display: flex;
    width: fit-content;
  }

  .columnElement {
    background-color: var(--tile-color);
    width: var(--tile-size);
    height: var(--tile-size);
    margin: 1px;
  }

  .snake {
    background-color: green;
  }

  .food {
    background-color: red;
  }
  .head {
    background-color: orange;
  }
</style>
