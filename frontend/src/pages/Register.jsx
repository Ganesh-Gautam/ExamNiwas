import { Eye, EyeOff, ImagePlus, LockKeyhole, Mail, ShieldCheck, Upload, UserRound, Users } from "../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../features/auth/authSlice";
import { extractApiErrorMessage } from "../utils/apiError.js";
import { formShellClass, inputClass, primaryButtonClass } from "../components/common/ui.jsx";

const iconFieldClass = `${inputClass} pl-11`;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "student",
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  const avatarPreview = useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  if (status) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("username", form.username);
    formData.append("role", form.role);
    formData.append("password", form.password);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    setIsSubmitting(true);

    try {
      await dispatch(register(formData)).unwrap();
      toast.success("Registered successfully. Please log in.");
      navigate("/login");
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
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Create workspace access</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Create your account</h1>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        Register as a student or teacher and move into a cleaner exam workflow.
      </p>

      {error ? (
        <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Full name</span>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Sayajirao Gaekwad III"
              className={iconFieldClass}
              required
            />
          </div>
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Role</span>
          <div className="relative">
            <Users className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <select name="role" value={form.role} onChange={handleChange} className={iconFieldClass}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={iconFieldClass}
              required
            />
          </div>
        </label>

        <label>
          <span className="text-sm font-semibold text-slate-700">Username</span>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="exam_ready_user"
              className={iconFieldClass}
              required
            />
          </div>
        </label>

        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-5 text-slate-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Choose a secure password"
              className={`${inputClass} pl-11 pr-12`}
              minLength={6}
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

        <label className="md:col-span-2">
          <span className="text-sm font-semibold text-slate-700">Avatar</span>
          <div className="mt-2 flex items-center gap-4 rounded-3xl border border-white/80 bg-white/80 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <div className="relative flex-1">
              <Upload className="pointer-events-none absolute left-0 top-2 text-slate-400" size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setAvatar(event.target.files?.[0] || null)}
                className="w-full pl-7 text-sm text-slate-600 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-50 text-slate-400">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={18} />
              )}
            </div>
          </div>
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} mt-8 w-full`}>
        {isSubmitting ? "Creating..." : "Register"}
      </button>

      <p className="mt-6 text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-sky-700 transition hover:text-sky-800">
          Login
        </Link>
      </p>
    </form>
  );
};

export default Register;
