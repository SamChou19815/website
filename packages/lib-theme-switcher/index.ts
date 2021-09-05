const initializeThemeSwitching = (): void => {
  const setTheme = (t: string) => document.documentElement.setAttribute('data-theme', t);
  if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('');
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: m }) => setTheme(m ? 'dark' : ''));
};

export default initializeThemeSwitching;
