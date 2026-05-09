import { LogOut, ShieldCheck } from "../../lib/lucide-react.jsx";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../features/auth/authSlice.js";
import logoImage from "../../assets/logo.png";
export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Could not log out cleanly");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div >
            <img src={logoImage} alt="logo" className="h-10 w-10" />
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-[#324A5E]">ExamNiwas</p>
            <p className="text-xs font-medium text-zinc-500">An Examination Platform</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          
          {status ? (
            <>
              <div className="hidden rounded-full border border-emerald-200 bg-[#cfebf7] px-4 py-2 text-sm font-medium text-emerald-700 sm:flex sm:items-center sm:gap-2">
                <ShieldCheck size={16} />
                {user?.role === "teacher" ? "Teacher access" : "Student access"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[#324A5E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Create account
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
