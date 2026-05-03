import { ArrowRight } from "../lib/lucide-react.jsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

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
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        to={buttonLink}
        className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        {buttonText}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}