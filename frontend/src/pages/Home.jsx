import { ArrowRight } from "../lib/lucide-react.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import homepageImage from "../assets/homepageImage.jpg";

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
    <div className="space-y-14 px-4 py-10 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden rounded-4xl border border-zinc-200 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.96))] p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-700">
              ExamNiwas
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
              Build tests/exams faster and grade written work with confidence.
            </h1>
            <p className="mt-6 text-sm leading-8 text-zinc-700 sm:text-xl">
              An exam platform which provides student exams, written answer submission, teachers create tests/exams and evaluate students submissions.
            </p>
 
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to={buttonLink}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                {buttonText}
                <ArrowRight size={16} />
              </Link> 
            </div>


          </div>

          <div className="rounded-4xl border border-white/80 bg-white/90 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
            <img
              src={homepageImage}
              alt="home page image"
              className="w-full rounded-4xl object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
}