/**
 * ThemeScript — inline, render-blocking theme bootstrap.
 * Sets the `.dark` class on <html> from localStorage or system preference
 * BEFORE first paint, so there is no light/dark flash on load.
 *
 * Shared SOV marketplace module — identical across Shop868 and Mom & Pop Store.
 */
export function ThemeScript() {
  const code = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
