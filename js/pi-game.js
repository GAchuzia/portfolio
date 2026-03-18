;(function () {
  var gameRoot = document.querySelector('[data-pi-game]');
  if (!gameRoot) return;

  var input = document.getElementById('pi-input');
  var digitsEl = document.getElementById('pi-digits');
  var statusEl = document.getElementById('pi-status');
  var factEl = document.getElementById('pi-fact');
  var retryBtn = document.getElementById('pi-retry');

  if (!input || !digitsEl || !statusEl || !factEl || !retryBtn) return;

  // Pi digits after "3."
  var PI_DIGITS = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482';

  var piFacts = [
    'π is irrational, meaning its decimal expansion never repeats or terminates',
    'The symbol π was popularized by the mathematician Leonhard Euler in the 18th century',
    'Pi Day is celebrated on March 14th (3/14) around the world',
    'NASA engineers sometimes use just 15 digits of π for interplanetary navigation',
    'Archimedes estimated π using polygons more than 2,000 years ago',
    'Since the exact value of π can never be calculated, we can never find the accurate area or circumference of a circle',
    'Physicist Larry Shaw started celebrating 14 March as Pi day at San Francisco’s Exploratorium science museum',
    'There is an entire writing style dedicated to π called Pilish',
    '"Cadae" is the alphabetical equivalent of the first five digits of π (3.14159)',
    'The first 144 digits of π add up to 666',
    'AKA "the quantity which when the diameter is multiplied by it, yields the circumference"',
    'π is an irrational number, meaning it cannot be expressed as a fraction of two integers',
    'As of November 2025 the most digits of π calculated is 314,000,000,000,000 digits (314 trillion), it took 110 days to compute',
    'The Greek letter π is the first letter of the word periphery and perimeter'
  ];

  var index = 0;
  var gameOver = false;

  function resetGame() {
    index = 0;
    gameOver = false;
    input.disabled = false;
    input.value = '';
    digitsEl.innerHTML = '';
    statusEl.textContent = 'Start typing the digits of π after 3. (numbers only)';
    factEl.textContent = '';
    retryBtn.hidden = true;
    input.focus();
  }

  function showRandomFact() {
    if (!piFacts.length) return;
    var fact = piFacts[Math.floor(Math.random() * piFacts.length)];
    factEl.textContent = fact;
  }

  input.addEventListener('input', function (e) {
    if (gameOver) return;

    var raw = e.target.value.replace(/\D/g, '');

    // If the user deletes everything, just reset state visually.
    if (raw.length === 0) {
      index = 0;
      digitsEl.innerHTML = '';
      statusEl.textContent = 'Start typing the digits of π after 3.';
      return;
    }

    if (raw.length < index) {
      resetGame();
      return;
    }

    while (index < raw.length && !gameOver) {
      var expected = PI_DIGITS.charAt(index);
      var actual = raw.charAt(index);

      var span = document.createElement('span');
      span.textContent = actual;
      span.className = 'pi-digit';
      digitsEl.appendChild(span);

      if (actual === expected) {
        span.classList.add('pi-digit-flash-correct');
        (function (s) {
          setTimeout(function () {
            s.classList.remove('pi-digit-flash-correct');
          }, 400);
        })(span);

        index += 1;
        statusEl.textContent = "You've guessed " + index + ' digit' + (index === 1 ? '' : 's') + ' of π!';
      } else {
        span.classList.add('pi-digit-flash-wrong');
        gameOver = true;
        input.disabled = true;
        var label = index === 1 ? 'digit' : 'digits';
        statusEl.innerHTML =
          'You reached <span class="pi-count">' +
          index +
          '</span> correct ' +
          label +
          ' of π.';
        showRandomFact();
        retryBtn.hidden = false;
      }
    }
  });

  retryBtn.addEventListener('click', function () {
    resetGame();
  });

  resetGame();
})();

