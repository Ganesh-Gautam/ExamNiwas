import { Link } from "react-router-dom";
import logoImage from "../../assets/logo.png";
export default function Footer() {
  return (
    <footer className="px-4 pb-4 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360 overflow-hidden rounded-4xl border border-white/70 bg-white/68 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/85 dark:shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
        <div className="grid gap-8 px-6 py-10 sm:px-8 md:grid-cols-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200/70 bg-white shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80">
              <img src={logoImage} alt="logo" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-slate-900 dark:text-slate-100">ExamNiwas</p>
              <p className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">An Examination Platform</p>
            </div>
          </Link>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">  </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">About Us</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">Services</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">Blog</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">Contact</a></li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">Follow Us</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">examniwas.vercel.app</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">Twitter</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">GitHub</a></li>
              <li><a href="#" className="hover:text-zinc-900 dark:hover:text-slate-100">LinkedIn</a></li>

            </ul>
          </div>
        </div>
        <div className="border-t border-white/60 px-6 py-4 text-center text-xs uppercase tracking-[0.18em] text-slate-400 sm:px-8 dark:border-slate-700/60 dark:text-slate-500">
          &copy; {new Date().getFullYear()} ExamNiwas. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
