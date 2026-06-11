/* eslint-disable react-refresh/only-export-components */

export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const pageWrapClass = "space-y-8 md:space-y-10";

export const shellClass =
  "relative overflow-hidden rounded-4xl border border-white/70 bg-white/72 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/75 dark:shadow-[0_30px_90px_rgba(15,23,42,0.16)]";

export const formShellClass =
  "w-full rounded-4xl border border-white/70 bg-white/78 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-10 dark:border-slate-700/70 dark:bg-slate-900/80";

export const surfaceClass =
  "rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] dark:border-slate-700/70 dark:bg-slate-900/84 dark:text-slate-100";

export const noticeClass =
  "rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-900/84 dark:text-slate-400";

export const gradientHeroClass =
  "relative overflow-hidden rounded-4xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(248,250,252,0.72)),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.12),transparent_28%)] shadow-[0_30px_100px_rgba(15,23,42,0.08)] dark:border-slate-700/60 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.72),rgba(30,41,59,0.86)),radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_28%)]";

export const inputClass =
  "mt-2 w-full rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(56,189,248,0.12)] dark:border-slate-600 dark:bg-slate-950/75 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:bg-slate-900";

export const textareaClass = `${inputClass} min-h-28 resize-y`;

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800";

export function PageHero({ eyebrow, title, description, actions, stats, accent = "sky" }) {
  const accentGlow =
    accent === "emerald"
      ? "before:bg-emerald-300/30"
      : accent === "amber"
        ? "before:bg-amber-300/35"
        : "before:bg-sky-300/30";

  return (
    <section className={cn(gradientHeroClass, accentGlow, "before:absolute before:-right-10 before:top-0 before:h-48 before:w-48 before:rounded-full before:blur-3xl")}>
      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
            ) : null}
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100 sm:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {stats ? <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats}</div> : null}
      </div>
    </section>
  );
}

export function StatCard({ label, value, hint, tone = "default" }) {
  const toneClass =
    tone === "success"
      ? "border-emerald-100 bg-emerald-50/70 dark:border-emerald-800/40 dark:bg-emerald-950/20"
      : tone === "warning"
        ? "border-amber-100 bg-amber-50/80 dark:border-amber-800/40 dark:bg-amber-950/20"
        : "border-white/80 bg-white/76 dark:border-slate-700/40 dark:bg-slate-900/30";

  return (
    <div className={cn("rounded-3xl border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]", toneClass)}>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-slate-100">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{hint}</p> : null}
    </div>
  );
}

export function SectionCard({ title, description, action, children }) {
  return (
    <section className={cn(shellClass, "p-6 sm:p-7")}>
      {(title || action) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {title ? <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">{title}</h2> : null}
            {description ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          {action}
        </div>
      )}
      <div className={title || action ? "mt-6" : ""}>{children}</div>
    </section>
  );
}

export function EmptyState({ title, description, action, icon }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center dark:border-slate-700/70 dark:bg-slate-950/80 dark:text-slate-100">
      {icon ? <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-slate-900/80 dark:text-slate-300">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-slate-950 dark:text-slate-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
