import { CalendarDays, Clock3, ClipboardList, PlusCircle, TimerReset, BookOpen, AlertCircle } from "../../lib/lucide-react.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchAvailableTests, fetchStudentResults } from "../../features/submissions/submissionSlice.js"; 

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { availableTests, studentResults, isLoading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchAvailableTests());
    dispatch(fetchStudentResults());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const attemptedTestIds = new Set(studentResults.map((r) => r.testId._id || r.testId));

  const getResultForTest = (testId) => {
    return studentResults.find((r) => (r.testId._id || r.testId) === testId);
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-4xl border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(240,253,250,0.95),rgba(236,253,245,0.95)),radial-gradient(circle_at_top_right,rgba(16,185,129,0.25),transparent_32%)] p-8 shadow-[0_30px_90px_rgba(5,150,105,0.12)]">
        <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Student Portal</p>
          <h1 className="mt-4 max-w-xl font-['Georgia'] text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
            Take tests and track your progress.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
            Welcome, {user?.fullName || "Student"}. Choose a test, answer questions, and see your results instantly.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
              <p className="text-sm text-zinc-500">Available tests</p>
              <p className="mt-2 text-3xl font-black text-zinc-950">{availableTests.length}</p>
            </div>
            <Link
              to="/student/tests/result"
              className="rounded-3xl border border-white/80 bg-white/70 p-4 transition hover:bg-white"
            >
              <p className="text-sm text-zinc-500">Tests attempted</p>
              <p className="mt-2 text-3xl font-black text-zinc-950">{studentResults.length}</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Available Tests</h2>
            <p className="text-sm text-zinc-500">Tests currently open for attempt.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
            Loading tests...
          </div>
        ) : availableTests.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
            <AlertCircle size={32} className="mx-auto text-zinc-400 mb-2" />
            <p className="text-sm text-zinc-500">No tests available at the moment. Check back later!</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {availableTests.map((test) => {
              const isAttempted = attemptedTestIds.has(test._id);
              const result = getResultForTest(test._id);

              return (
                <article
                  key={test._id}
                  className="rounded-[1.75rem] border border-emerald-200/60 bg-[linear-gradient(180deg,#f0fdfa_0%,#ffffff_100%)] p-5 shadow-[0_18px_45px_rgba(16,185,129,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{test.subject}</p>
                      <h3 className="mt-2 text-2xl font-black text-zinc-950">{test.title}</h3>
                    </div>
                    {isAttempted && (
                      <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        Attempted
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <TimerReset size={16} className="text-emerald-600" />
                      {test.duration} minutes
                    </div>
                    <div className="flex items-center gap-2">
                      <ClipboardList size={16} className="text-emerald-600" />
                      {test.totalQuestions || 0} questions
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock3 size={16} className="text-emerald-600" />
                      {new Date(test.startTime).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-emerald-600" />
                      Ends {new Date(test.endTime).toLocaleTimeString()}
                    </div>
                  </div>

                  {result && (
                    <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                      <p className="text-xs font-semibold text-emerald-900">Your Score</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-600">{result.score}</span>
                        <span className="text-sm text-emerald-700">/ {result.totalMarks}</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-700">
                        {result.percentage.toFixed(1)}% • {Math.round(result.timeTaken / 60)} mins
                      </p>
                    </div>
                  )}

                  <div className="mt-5 border-t border-emerald-100 pt-4">
                    {isAttempted ? (
                      <Link
                        to={`/student/tests/${test._id}/result`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200"
                      >
                        <BookOpen size={16} />
                        View Result
                      </Link>
                    ) : (
                      <Link
                        to={`/student/tests/${test._id}/attempt`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <PlusCircle size={16} />
                        Attempt Now
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
