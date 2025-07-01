(async () => {
  const quoteElement = document.getElementById('quote');
  try {
    const resource = await fetch('quotes.txt');
    if (!resource.ok) throw new Error(`HTTP ${resource.status}`);
    const text = await resource.text();

    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      quoteElement.textContent = 'No quotes found, darn.';
      return;
    }

    const randomIndex = Math.floor(Math.random() * lines.length);
    quoteElement.textContent = lines[randomIndex];
  } catch (err) {
    console.error('Failed to load quotes:', err);
    quoteElement.textContent = 'Could not load quotes, darn.';
  }
})();
