import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "../lib/lucide-react.jsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice.js";
import { extractApiErrorMessage } from "../utils/apiError.js";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="grid gap-6 bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur"
      >

        <h2 className="mt-3 text-3xl font-black text-zinc-950">Login to your account</h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Use your registered email and password to enter the teacher or student workspace.
        </p>

        {error ? (
          <div className="mt-6 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Email</span>

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-sky-400 focus-within:bg-white">
              <Mail className="text-zinc-400" size={18} />

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-zinc-700">Password</span>

            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 focus-within:border-sky-400 focus-within:bg-white">
              <LockKeyhole className="text-zinc-400" size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-zinc-400 transition hover:text-zinc-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-zinc-800 disabled:opacity-70"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>

        <p className="mt-6 text-sm text-zinc-500">
          New here?{" "}
          <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
