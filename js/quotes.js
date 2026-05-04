(function () {
  var el = document.getElementById('quote');
  if (!el) return;

  var base = window.location.pathname.indexOf('blog/') !== -1 ? '../' : '';
  var STORAGE_KEY = 'portfolio_quote_state_v1';

  function readState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Ignore storage errors and continue gracefully.
    }
  }

  function nextSeed(seed) {
    // Simple deterministic LCG.
    return (seed * 1664525 + 1013904223) >>> 0;
  }

  function nextIndex(linesLength, state) {
    if (linesLength <= 1) return 0;

    var seed = typeof state.seed === 'number' ? state.seed >>> 0 : (Date.now() >>> 0);
    var candidate = 0;

    do {
      seed = nextSeed(seed);
      candidate = seed % linesLength;
    } while (candidate === state.lastIndex);

    state.seed = seed;
    return candidate;
  }

  fetch(base + 'assets/quotes.txt')
    .then(function (r) {
      return r.ok ? r.text() : Promise.reject();
    })
    .then(function (text) {
      var lines = text.split('\n').map(function (line) {
        return line.replace(/^\s*"?|"?\s*$/g, '').trim();
      }).filter(Boolean);
      if (lines.length) {
        var state = readState();
        var idx;

        if (!state.hasSeenFirstQuote) {
          idx = 0;
          state.hasSeenFirstQuote = true;
        } else {
          idx = nextIndex(lines.length, state);
        }

        state.lastIndex = idx;
        writeState(state);
        el.textContent = '"' + lines[idx] + '"';
      }
    })
    .catch(function () {
      el.textContent = '';
    });
})();
