import { AlertCircle, BadgeCheck, CalendarDays, ClipboardList, Clock3, Eye } from "../../lib/lucide-react.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchStudentResults } from "../../features/submissions/submissionSlice.js";

const formatDuration = (seconds) => {
  const minutes = Math.round((Number(seconds) || 0) / 60);
  return `${minutes} min`;
};

export default function AllTestResult() {
  const dispatch = useDispatch();
  const { studentResults, isLoading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchStudentResults());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const averagePercentage = studentResults.length
    ? (
        studentResults.reduce((sum, result) => sum + (Number(result.percentage) || 0), 0) /
        studentResults.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.96)),radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_30%)] p-8 shadow-[0_24px_70px_rgba(15,118,110,0.1)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">All Results</p>
        <h1 className="mt-3 font-['Georgia'] text-4xl font-bold text-zinc-950">Your result history</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Review every attempted test, compare scores, and reopen any result for detailed answer analysis.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Attempts</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">{studentResults.length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Average</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">{averagePercentage}%</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Best Score</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">
              {studentResults.length ? Math.max(...studentResults.map((result) => Number(result.score) || 0)) : 0}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Attempted Tests</h2>
            <p className="text-sm text-zinc-500">Latest results appear first.</p>
          </div>
          <Link
            to="/student"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <ClipboardList size={16} />
            Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
            Loading your results...
          </div>
        ) : studentResults.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
            <AlertCircle size={32} className="mx-auto mb-2 text-zinc-400" />
            <p className="text-sm text-zinc-500">You have not attempted any tests yet.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {studentResults.map((result) => (
              <article
                key={result._id}
                className="rounded-[1.75rem] border border-zinc-200 bg-[linear-gradient(180deg,#f8fffc_0%,#ffffff_100%)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{result.testId?.subject}</p>
                    <h3 className="mt-2 text-2xl font-black text-zinc-950">{result.testId?.title}</h3>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {result.percentage}%
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <BadgeCheck size={16} className="text-emerald-600" />
                    Score {result.score}/{result.totalMarks}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-emerald-600" />
                    Time taken {formatDuration(result.timeTaken)}
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-emerald-600" />
                    Duration {result.testId?.duration} mins
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-emerald-600" />
                    {new Date(result.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-5 border-t border-zinc-100 pt-4">
                  <Link
                    to={`/student/tests/${result.testId?._id}/result`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Eye size={16} />
                    View full result
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
