// Enhanced Vercel-Inspired Theme System
// Combines the best of theme-simple.ts with advanced features

const THEME_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

// State management
let currentTheme = LIGHT;

// Get current theme
function getCurrentTheme(): string {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(THEME_KEY) || LIGHT;
  }
  return LIGHT;
}

// Set theme with enhanced features
function setTheme(theme: string): void {
  currentTheme = theme;
  
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_KEY, theme);
  }
  
  // Update DOM
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === DARK ? '#0A0A0A' : '#ffffff');
  }
  
  // Update Vercel theme CSS variables
  updateThemeCSS(theme);
  
  // Dispatch custom event for components
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

// Update CSS variables dynamically
function updateThemeCSS(theme: string): void {
  const root = document.documentElement;
  
  if (theme === DARK) {
    root.style.setProperty('--vercel-bg-primary', '#0A0A0A');
    root.style.setProperty('--vercel-text-primary', '#FAFAFA');
    root.style.setProperty('--vercel-accent', '#FFFFFF');
  } else {
    root.style.setProperty('--vercel-bg-primary', '#ffffff');
    root.style.setProperty('--vercel-text-primary', '#111827');
    root.style.setProperty('--vercel-accent', '#000000');
  }
}

// Toggle theme with smooth transition
function toggleTheme(): void {
  const newTheme = currentTheme === DARK ? LIGHT : DARK;
  
  // Add transition class for smooth animation
  document.documentElement.classList.add('theme-transitioning');
  
  setTimeout(() => {
    setTheme(newTheme);
    document.documentElement.classList.remove('theme-transitioning');
  }, 50);
}

// Initialize theme on page load
function initTheme(): void {
  const savedTheme = getCurrentTheme();
  
  // Detect system preference
  if (!localStorage.getItem(THEME_KEY)) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDark ? DARK : LIGHT;
    setTheme(systemTheme);
  } else {
    setTheme(savedTheme);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      const systemTheme = e.matches ? DARK : LIGHT;
      setTheme(systemTheme);
    }
  });
}

// Enhanced API
if (typeof window !== 'undefined') {
  window.enhancedTheme = {
    getCurrentTheme,
    setTheme,
    toggleTheme,
    initTheme,
    
    // Advanced features
    isDark: () => currentTheme === DARK,
    isLight: () => currentTheme === LIGHT,
    
    // Programmatic theme control
    enableDark: () => setTheme(DARK),
    enableLight: () => setTheme(LIGHT),
    
    // Theme utilities
    getCSSVariable: (name: string) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`),
    
    // Auto-theme based on time
    enableAutoTheme: () => {
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 6) {
        setTheme(DARK);
      } else {
        setTheme(LIGHT);
      }
    }
  };
}

// Auto-initialize
initTheme();

// Add transition styles
const style = document.createElement('style');
style.textContent = `
  [data-theme] {
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .theme-transitioning {
    transition: background-color 0.5s ease, color 0.5s ease !important;
  }
`;
document.head.appendChild(style);
