// Enhanced Vercel-Inspired Theme System
// Combines the best of theme-simple.ts with advanced features

const THEME_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

// State management
let currentTheme = LIGHT;

// Get current theme
function getCurrentTheme() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(THEME_KEY) || LIGHT;
  }
  return LIGHT;
}

// Set theme with enhanced features
function setTheme(theme) {
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
function updateThemeCSS(theme) {
  const root = document.documentElement;
  
  if (theme === DARK) {
    root.style.setProperty('--bg-primary', '#0A0A0A');
    root.style.setProperty('--bg-secondary', '#111111');
    root.style.setProperty('--bg-tertiary', '#1A1A1A');
    root.style.setProperty('--bg-card', '#1A1A1A');
    root.style.setProperty('--bg-hover', '#262626');
    root.style.setProperty('--bg-border', '#2A2A2A');
    root.style.setProperty('--surface-primary', '#111111');
    root.style.setProperty('--surface-secondary', '#191919');
    root.style.setProperty('--surface-elevated', '#262626');
    root.style.setProperty('--text-primary', '#FAFAFA');
    root.style.setProperty('--text-secondary', '#E5E5E5');
    root.style.setProperty('--text-tertiary', '#A1A1A1');
    root.style.setProperty('--text-muted', '#6B7280');
    root.style.setProperty('--accent-primary', '#FFFFFF');
    root.style.setProperty('--accent-secondary', '#F8FAFC');
    root.style.setProperty('--accent-hover', '#FFFFFF');
    root.style.setProperty('--border-primary', '#2A2A2A');
    root.style.setProperty('--border-secondary', '#333333');
  } else {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f8fafc');
    root.style.setProperty('--bg-tertiary', '#f1f5f9');
    root.style.setProperty('--bg-card', '#ffffff');
    root.style.setProperty('--bg-hover', '#f8fafc');
    root.style.setProperty('--bg-border', '#e2e8f0');
    root.style.setProperty('--surface-primary', '#ffffff');
    root.style.setProperty('--surface-secondary', '#f8fafc');
    root.style.setProperty('--surface-elevated', '#ffffff');
    root.style.setProperty('--text-primary', '#111827');
    root.style.setProperty('--text-secondary', '#64748b');
    root.style.setProperty('--text-tertiary', '#94a3b8');
    root.style.setProperty('--text-muted', '#6b7280');
    root.style.setProperty('--accent-primary', '#000000');
    root.style.setProperty('--accent-secondary', '#111827');
    root.style.setProperty('--accent-hover', '#000000');
    root.style.setProperty('--border-primary', '#e2e8f0');
    root.style.setProperty('--border-secondary', '#cbd5e1');
  }
}

// Toggle theme with smooth transition
function toggleTheme() {
  const newTheme = currentTheme === DARK ? LIGHT : DARK;
  
  // Add transition class for smooth animation
  document.documentElement.classList.add('theme-transitioning');
  
  setTimeout(() => {
    setTheme(newTheme);
    document.documentElement.classList.remove('theme-transitioning');
  }, 50);
}

// Initialize theme on page load
function initTheme() {
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
    getCSSVariable: (name) => getComputedStyle(document.documentElement).getPropertyValue(`--${name}`),
    
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
