(function () {
  const canvas = document.getElementById('snake-game');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const status = document.getElementById('snake-status');

  const gridSize = 16;
  const tileCount = canvas.width / gridSize;
  let snake = [{ x: 8, y: 8 }];
  let direction = { x: 0, y: 0 };
  let nextDirection = { x: 0, y: 0 };
  let food = { x: 12, y: 8 };
  let speed = 120;
  let lastTime = 0;
  let accumulator = 0;
  let running = false;

  function resetGame() {
    snake = [{ x: 8, y: 8 }];
    direction = { x: 0, y: 0 };
    nextDirection = { x: 0, y: 0 };
    food = { x: 12, y: 8 };
    speed = 120;
    running = false;
    if (status) status.textContent = 'Press any arrow key to start.';
    draw();
  }

  function randomFood() {
    let pos;
    do {
      pos = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    } while (snake.some(seg => seg.x === pos.x && seg.y === pos.y));
    food = pos;
  }

  function handleKey(e) {
    const key = e.key;
    if (['ArrowUp', 'w', 'W'].includes(key) && direction.y !== 1) {
      nextDirection = { x: 0, y: -1 };
    } else if (['ArrowDown', 's', 'S'].includes(key) && direction.y !== -1) {
      nextDirection = { x: 0, y: 1 };
    } else if (['ArrowLeft', 'a', 'A'].includes(key) && direction.x !== 1) {
      nextDirection = { x: -1, y: 0 };
    } else if (['ArrowRight', 'd', 'D'].includes(key) && direction.x !== -1) {
      nextDirection = { x: 1, y: 0 };
    } else {
      return;
    }

    if (!running) {
      running = true;
      if (status) status.textContent = 'Game on! Eat the food.';
    }
  }

  function update() {
    if (!running) return;
    direction = nextDirection;
    if (direction.x === 0 && direction.y === 0) return;

    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
      if (status) status.textContent = 'You hit a wall! Press an arrow key to play again.';
      resetGame();
      return;
    }

    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      if (status) status.textContent = 'You ate yourself! Press an arrow key to play again.';
      resetGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      randomFood();
      speed = Math.max(60, speed - 4);
    } else {
      snake.pop();
    }
  }

  function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f0';
    snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#4caf50' : '#0f0';
      ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize - 1, gridSize - 1);
    });

    ctx.fillStyle = '#ff5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
  }

  function loop(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += delta;

    while (accumulator >= speed) {
      update();
      accumulator -= speed;
    }

    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('keydown', handleKey);
  resetGame();
  requestAnimationFrame(loop);
})();
