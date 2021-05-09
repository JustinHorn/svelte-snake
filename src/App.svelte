<script>
  import { gameStatus } from './status';

  import Game from './game.svelte';

  let gameOver;

  let snakes = [];

  const updateSnakes = (event) => {
    snakes = event.detail.snakes;
  };

  gameStatus.subscribe((value) => (gameOver = value));
</script>

<header>
  {#if !gameOver}
    <h1>Hello Player!</h1>
  {:else}
    <h1>Game Over!</h1>
  {/if}
</header>
<main>
  <span>
    Score: {snakes.length}
  </span>

  <Game on:snakes={updateSnakes} />
</main>

<style>
  :root {
    --tile-size: 25px;
    --tile-color: grey;
  }
  main,
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

  header {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
