const container = document.getElementById('container');
const toggleBtn = document.getElementById('theme-toggle');

const themes = ['dark', 'light'];
let currentTheme = 0;

function updateTheme() {

  document.body.classList.remove(...themes);

  const theme = themes[currentTheme];
  document.body.classList.add(theme);
  currentTheme = (currentTheme + 1) % themes.length;
}

function updateButtonName(){
  
}

toggleBtn.addEventListener('click', updateTheme);

updateTheme();
