import { ArrowRight, Edit3, LockKeyhole, LogOut, Mail, Moon, Save, ShieldCheck, Sun, Upload, UserRound, X } from "../../lib/lucide-react.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { changePassword, logout, updateAvatar, updateProfileDetails } from "../../features/auth/authSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";
import logoImage from "../../assets/logo.png";

const profileInputClass =
  "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400";

export default function Header({ theme, onToggleTheme }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, user, isUpdating } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      setIsOpen(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Could not log out cleanly");
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(updateProfileDetails(profileForm)).unwrap();
      toast.success("Profile details updated");
      setModalMode(null);
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const handleAvatarSubmit = async (event) => {
    event.preventDefault();

    if (!avatarFile) {
      toast.error("Please select an avatar image");
      return;
    }

    try {
      await dispatch(updateAvatar(avatarFile)).unwrap();
      toast.success("Avatar updated");
      setAvatarFile(null);
      setModalMode(null);
      event.currentTarget.reset();
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
      setModalMode(null);
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const userName = user?.username || "";
  const displayName = user?.fullName || userName || "User";
  const userRole = user?.role === "teacher" ? "Teacher" : "Student";
  const userEmail = user?.email || user?.username || "";
  const userInitial = displayName.charAt(0).toUpperCase() || "U";

  const openEditModal = () => {
    setProfileForm({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
    setModalMode("details");
    setIsOpen(false);
  };

  const openAvatarModal = () => {
    setAvatarFile(null);
    setModalMode("avatar");
    setIsOpen(false);
  };

  const openPasswordModal = () => {
    setPasswordForm({ oldPassword: "", newPassword: "" });
    setModalMode("password");
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex flex-wrap max-w-360 items-center justify-between gap-4 rounded-[1.75rem] border border-white/70 bg-white/72 px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6 dark:border-slate-700/60 dark:bg-slate-950/80 dark:shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-3xl border border-slate-200/70 bg-white shadow-sm">
            <img src={logoImage} alt="logo" className="h-8 w-8 object-contain" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[-0.03em] text-slate-900">ExamNiwas</p>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">An Examination Platform</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-white/82 text-slate-700 shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:shadow-slate-950/30 dark:hover:border-emerald-400/50 dark:hover:bg-slate-800"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {status ? (
            <div ref={menuRef} className="relative inline-flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="group flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/82 py-1.5 pl-1.5 pr-4 text-left shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-200 dark:shadow-slate-950/30 dark:hover:border-emerald-400/50 dark:hover:bg-slate-800"
                aria-expanded={isOpen}
                aria-haspopup="menu"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border border-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-sky-500 text-sm font-semibold uppercase text-white shadow-inner">
                    {userInitial}
                  </div>
                )}
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-32 truncate text-sm font-semibold text-slate-900">{displayName}</span>
                  <span className="block text-xs font-medium text-slate-500">{userRole}</span>
                </span>
              </button>

              {isOpen && (
                <div className="absolute right-0 top-full z-20 mt-3 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/12 dark:border-slate-700/80 dark:bg-slate-950/95 dark:shadow-none" role="menu">
                  <div className="bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(14,165,233,0.12)),linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-5 dark:bg-slate-950/95">
                    <div className="flex items-center gap-4">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-sky-500 text-lg font-semibold uppercase text-white shadow-md">
                          {userInitial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-950">Hi, {displayName}</p>
                        <p className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/80 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                          <ShieldCheck size={13} />
                          {userRole}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 px-4 py-4 text-sm text-slate-700">
                    {userName ? (
                      <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <UserRound size={17} className="shrink-0 text-slate-400" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Username</p>
                          <p className="truncate font-medium text-slate-800">{userName}</p>
                        </div>
                      </div>
                    ) : null}
                    {userEmail ? (
                      <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Mail size={17} className="shrink-0 text-slate-400" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Email</p>
                          <p className="truncate font-medium text-slate-800">{userEmail}</p>
                        </div>
                      </div>
                    ) : null}
                    <div className="grid gap-2">
                      <button
                        type="button"
                        onClick={openEditModal}
                        className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        <span className="inline-flex items-center gap-2"><Edit3 size={15} />Edit full name/email</span>
                        <ArrowRight size={14} className="text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={openAvatarModal}
                        className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50"
                      >
                        <span className="inline-flex items-center gap-2"><Upload size={15} />Avatar upload</span>
                        <ArrowRight size={14} className="text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={openPasswordModal}
                        className="inline-flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
                      >
                        <span className="inline-flex items-center gap-2"><LockKeyhole size={15} />Change password</span>
                        <ArrowRight size={14} className="text-slate-300" />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-slate-200/80 px-4 py-3">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:bg-slate-800"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-full bg-slate-900 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Create account
              </NavLink>
            </>
          )}
        </nav>
      </div>
      {status && modalMode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-2xl shadow-slate-950/20">
            <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(14,165,233,0.12)),linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Account settings</p>
                <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  {modalMode === "details" ? "Edit details" : modalMode === "avatar" ? "Update avatar" : "Change password"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                aria-label="Close account settings"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 py-5">
              {modalMode === "details" ? (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Full name</span>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(event) => setProfileForm((current) => ({ ...current, fullName: event.target.value }))}
                      className={profileInputClass}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</span>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(event) => setProfileForm((current) => ({ ...current, email: event.target.value }))}
                      className={profileInputClass}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={15} />
                    {isUpdating ? "Saving..." : "Save details"}
                  </button>
                </form>
              ) : null}

              {modalMode === "avatar" ? (
                <form onSubmit={handleAvatarSubmit} className="space-y-4">
                  <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/70 dark:bg-slate-900/80">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Current profile" className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-sm" />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-sky-500 text-lg font-semibold uppercase text-white shadow-sm">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">{displayName}</p>
                      <p className="text-sm text-slate-500">Choose a new image for your profile.</p>
                    </div>
                  </div>
                  <label className="block rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-700/70 dark:bg-slate-900/80">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Avatar image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
                      className="mt-3 block w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-emerald-50"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isUpdating || !avatarFile}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={15} />
                    {isUpdating ? "Uploading..." : "Update avatar"}
                  </button>
                </form>
              ) : null}

              {modalMode === "password" ? (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Current password</span>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, oldPassword: event.target.value }))}
                      className={profileInputClass}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">New password</span>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))}
                      className={profileInputClass}
                      required
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LockKeyhole size={15} />
                    {isUpdating ? "Updating..." : "Change password"}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
