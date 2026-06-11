import { ArrowRight, BadgeCheck, BookOpen, ClipboardList, ShieldCheck } from "../lib/lucide-react.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import homepageImage from "../assets/homepageImage.jpg";
import { PageHero, SectionCard, pageWrapClass } from "../components/common/ui.jsx";


export default function Home() {
  const { status, user } = useSelector((state) => state.auth);

  const role = user?.role;
  let buttonLink = "/register";
  let buttonText = "Create your account";

  if (status) {
    if (role === "teacher") {
      buttonLink = "/teacher";
      buttonText = "Open teacher dashboard";
    } else if (role === "student") {
      buttonLink = "/student";
      buttonText = "Open student dashboard";
    } else {
      buttonLink = "/";
      buttonText = "Explore platform";
    }
  }

  return (
    <div className={`${pageWrapClass} page-enter pb-6`}>
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/60 p-8 backdrop-blur-xl shadow-[0_25px_80px_rgba(15,23,42,0.08)] lg:p-12 dark:border-slate-700/70 dark:bg-slate-900/80">

          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-sky-300/20 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-300/20 blur-[100px]" />

          <div className="relative z-10">

            <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">
              Build tests/exams faster and grade written work with confidence.
            </span>
            <h1 className="mt-6 text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              ExamNiwas
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              An exam platform which provides student exams, written answer
              submission, teachers create tests/exams and evaluate students
              submissions.
            </p>
            <div className="mt-30 flex flex-wrap items-center gap-4">
              <Link
                to={buttonLink}
                className="group inline-flex items-center gap-3 rounded-2xl bg-slate-800 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(15,23,42,0.25)] dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {buttonText}

                <ArrowRight
                  size={16}
                  className="mt-1 ml-2 transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </Link>

              {!status && (
                <Link
                  to="/login"
                  className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/78 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                >
                  Sign in
                </Link>
              )}

            </div>

          </div>
        </div>
        <div className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/50 sm:p-6 dark:border-slate-700/70 dark:bg-slate-900/75">
          <div className="absolute inset-x-8 top-0 h-28 rounded-full bg-sky-200/40 blur-3xl" />
          <img
            src={homepageImage}
            alt="ExamNiwas platform preview"
            className="relative h-full min-h-80 w-full rounded-3xl object-cover"
          />
        </div>
      </section>
    </div>
  );
}
