import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function TeacherRoute({ children }) {
  const { isLoading, status, user } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-white/60 bg-white/70 p-10 text-sm font-semibold text-zinc-500 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
        Checking your teacher access...
      </div>
    );
  }

  if (!status) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "teacher") {
    return <Navigate to="/" replace />;
  }

  return children;
}
