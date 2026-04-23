import { Eye, EyeOff, ImagePlus, LockKeyhole, Mail, ShieldCheck, Upload, UserRound, Users } from "../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../features/auth/authSlice";
import { extractApiErrorMessage } from "../utils/apiError.js";

const inputWrapperClass =
  "flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 " +
  "focus-within:border-sky-400 focus-within:bg-white";

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="rounded-4xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur"
      >
        <h1 className="mt-3 text-3xl font-black text-zinc-950">Create your account</h1>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Register as a student or teacher 
        </p>

        {error ? (
          <div className="mt-6 rounded-[1.3rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700">Full name</span>
            <div className={inputWrapperClass}>
              <UserRound className="text-zinc-400" size={18} />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Sayajirao Gaekwad III"
                className="w-full bg-transparent outline-none text-sm text-zinc-900"
                required
              />
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700">Role</span>
            <div className={inputWrapperClass}>
              <Users className="text-zinc-400" size={18} />
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-sm text-zinc-900"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </label>

          <label>
            <span className="text-sm font-semibold text-zinc-700">Email</span>
            <div className={inputWrapperClass}>
              <Mail className="text-zinc-400" size={18} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-transparent outline-none text-sm text-zinc-900"
                required
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-semibold text-zinc-700">Username</span>
            <div className={inputWrapperClass}>
              <ShieldCheck className="text-zinc-400" size={18} />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="exam_ready_user"
                className="w-full bg-transparent outline-none text-sm text-zinc-900"
                required
              />
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700">Password</span>
            <div className={inputWrapperClass}>
              <LockKeyhole className="text-zinc-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Choose a secure password"
                className="w-full bg-transparent outline-none text-sm text-zinc-900"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-zinc-400 transition hover:text-zinc-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="md:col-span-2">
            <span className="text-sm font-semibold text-zinc-700">Avatar</span>
            <div className={inputWrapperClass}>
              <Upload className="text-zinc-400" size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                className="w-full bg-transparent text-sm text-zinc-700 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-zinc-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              <span className="text-sm text-zinc-500">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-zinc-100 text-zinc-500">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImagePlus size={18} />
                  )}
                  
                </div> 
              </span>
            </div>
          </label>
        </div>


        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:cursor-pointer hover:bg-zinc-800 disabled:opacity-70"
        >
          {isSubmitting ? "Creating..." : "Register"}
        </button>

        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>

    </div>
  );
};

export default Register;
