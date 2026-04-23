import { ArrowRight, ClipboardList, ShieldCheck } from "../lib/lucide-react.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Home() {
  const { status, user } = useSelector((state) => state.auth);
  const isTeacher = status && user?.role === "teacher";

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {isTeacher ? (
        <Link
          to="/teacher"
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Open teacher dashboard
          <ArrowRight size={16} />
        </Link>
      ) : (
        <Link
          to={status ? "/" : "/register"}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {status ? "Explore platform" : "Create your account"}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
