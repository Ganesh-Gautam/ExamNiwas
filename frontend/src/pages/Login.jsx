import { Eye, EyeOff, LockKeyhole, Mail } from "../lib/lucide-react.jsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice.js";
import { extractApiErrorMessage } from "../utils/apiError.js";
import { formShellClass, inputClass, primaryButtonClass } from "../components/common/ui.jsx";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (status) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await dispatch(login(form)).unwrap();
      toast.success("Welcome back to ExamNiwas");
      navigate("/");
    } catch (err) {
      const message = extractApiErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={formShellClass}>
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Welcome back</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Login to your account</h2>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Use your registered email and password to enter the student or teacher workspace.
      </p>

      {error ? (
        <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type="email"
              placeholder="you@example.com"
              className={`${inputClass} pl-11`}
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={`${inputClass} pl-11 pr-12`}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} mt-8 w-full`}>
        {isSubmitting ? "Signing in..." : "Login"}
      </button>

      <p className="mt-6 text-sm text-slate-500">
        New here?{" "}
        <Link to="/register" className="font-semibold text-sky-700 transition hover:text-sky-800">
          Create an account
        </Link>
      </p>
    </form>
  );
}
