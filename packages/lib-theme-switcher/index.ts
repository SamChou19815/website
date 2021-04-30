const initializeThemeSwitching = (): void => {
  const setTheme = (theme: string) => document.documentElement.setAttribute('data-theme', theme);
  if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('');
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: m }) => setTheme(m ? 'dark' : ''));
};

export default initializeThemeSwitching;
