// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem("portfolio-theme") || "light";
    this.themeText = document.getElementById("theme-text");
    this.init();
  }

  init() {
    // Apply saved theme or default
    this.applyTheme(this.currentTheme);

    // Add event listener to theme text
    this.themeText.addEventListener("click", () => {
      this.toggleTheme();
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem("portfolio-theme")) {
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
    }

    // Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + T)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(newTheme);
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.updateText();
    localStorage.setItem("portfolio-theme", theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }

  updateText() {
    this.themeText.textContent =
      this.currentTheme === "light" ? "dark mode" : "light mode";
  }
}

// Quote Management
class QuoteManager {
  constructor() {
    this.quoteElement = document.getElementById("quote");
    this.quotes = [];
    this.loadQuotes();
  }

  async loadQuotes() {
    try {
      const response = await fetch("assets/quotes.txt");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const text = await response.text();
      this.quotes = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (this.quotes.length === 0) {
        this.showFallbackQuote(
          "No quotes found, but the portfolio looks great!"
        );
        return;
      }

      this.displayRandomQuote();
    } catch (error) {
      console.error("Failed to load quotes:", error);
      this.showFallbackQuote("Could not load quotes, but hey, nice portfolio!");
    }
  }

  displayRandomQuote() {
    if (this.quotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[randomIndex];

    // Add a subtle animation when changing quotes
    this.quoteElement.style.opacity = "0";

    setTimeout(() => {
      this.quoteElement.textContent = quote;
      this.quoteElement.style.opacity = "1";
    }, 150);
  }

  showFallbackQuote(message) {
    this.quoteElement.textContent = message;
  }

  // Method to get a new random quote
  getNewQuote() {
    this.displayRandomQuote();
  }
}

// Smooth Animations
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    // Add intersection observer for scroll animations
    this.setupScrollAnimations();

    // Add click effect for quote refresh
    this.setupQuoteRefresh();

    // Add hover effects
    this.setupHoverEffects();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    // Observe all sections for scroll animations
    document.querySelectorAll(".section").forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(element);
    });
  }

  setupQuoteRefresh() {
    const quoteElement = document.getElementById("quote");
    if (quoteElement && window.quoteManager) {
      quoteElement.addEventListener("click", () => {
        window.quoteManager.getNewQuote();
      });

      // Add cursor pointer to indicate clickability
      quoteElement.style.cursor = "pointer";
      quoteElement.title = "Click for a new quote!";
    }
  }

  setupHoverEffects() {
    // Add subtle hover effects to contact links
    document.querySelectorAll(".contact-link").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        link.style.transform = "translateY(-2px)";
      });

      link.addEventListener("mouseleave", () => {
        link.style.transform = "translateY(0)";
      });
    });
  }
}

// Performance Optimization
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Preload critical resources
    this.preloadResources();

    // Optimize images if any are added later
    this.optimizeImages();
  }

  preloadResources() {
    // Preload the quotes file for faster loading
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = "assets/quotes.txt";
    document.head.appendChild(link);
  }

  optimizeImages() {
    // Add lazy loading to any images that might be added
    document.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }
    });
  }
}

// Initialize function
function initializePortfolio() {
  console.log("Initializing portfolio...");

  // Initialize managers
  try {
    window.themeManager = new ThemeManager();
    console.log("Theme manager initialized");

    window.quoteManager = new QuoteManager();
    console.log("Quote manager initialized");

    window.animationManager = new AnimationManager();
    console.log("Animation manager initialized");

    window.performanceManager = new PerformanceManager();
    console.log("Performance manager initialized");
  } catch (error) {
    console.error("Error initializing managers:", error);
  }

  // Add a subtle loading animation
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(20px)";

  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    document.body.style.opacity = "1";
    document.body.style.transform = "translateY(0)";
  }, 100);

  console.log(
    "Portfolio loaded successfully! Try the theme toggle and click the quote for a new one!"
  );
}

// Initialize when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePortfolio);
} else {
  // DOM is already loaded
  initializePortfolio();
}

// Fallback initialization after a short delay
setTimeout(() => {
  if (!window.themeManager) {
    console.log("Fallback initialization triggered");
    initializePortfolio();
  }
}, 100);

// Add keyboard navigation for accessibility
document.addEventListener("keydown", (e) => {
  // Allow theme switching with keyboard shortcuts
  if (e.altKey) {
    switch (e.key) {
      case "t":
        e.preventDefault();
        window.themeManager.toggleTheme();
        break;
      case "q":
        e.preventDefault();
        window.quoteManager.getNewQuote();
        break;
    }
  }
});

// Add some Easter eggs for fun
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (konamiCode.join(",") === konamiSequence.join(",")) {
    // Easter egg: Rapid theme switching
    const themes = ["light", "dark"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      window.themeManager.setTheme(themes[currentIndex]);
      currentIndex = (currentIndex + 1) % themes.length;
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      window.themeManager.setTheme("dark"); // End on dark theme
    }, 2000);

    konamiCode = []; // Reset
  }
});
