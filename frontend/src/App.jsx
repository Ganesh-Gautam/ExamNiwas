import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";

const App = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem("examniwas-theme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const isAttemptTestPage = /^\/student\/tests\/[^/]+\/attempt\/?$/.test(location.pathname);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    window.localStorage.setItem("examniwas-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(196,181,253,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#b1edff_40%,#f8fafc_100%)] text-slate-950 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,rgba(56,139,252,0.12),transparent_28%),radial-gradient(circle_at_right,rgba(94,97,183,0.10),transparent_24%),linear-gradient(180deg,rgba(17,24,39,0.98)_0%,rgba(15,23,42,0.92)_45%,rgba(17,24,39,0.98)_100%)] dark:text-slate-100">
      {isAttemptTestPage ? null : <Header theme={theme} onToggleTheme={toggleTheme} />}
      <main className={isAttemptTestPage ? "" : "mx-auto w-full max-w-360 px-4 py-6 sm:px-6 lg:px-8"}>
        <Outlet />
      </main>
      {isAttemptTestPage ? null : <Footer />}
    </div>
  );
};

export default App;
