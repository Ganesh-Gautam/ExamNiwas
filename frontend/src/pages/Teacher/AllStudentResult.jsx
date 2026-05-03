import { AlertCircle, BadgeCheck, CalendarDays, ClipboardList, Clock3, FileSpreadsheet, Users } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchTeacherStudentResults } from "../../features/submissions/submissionSlice.js";

export default function AllStudentResult() {
  const dispatch = useDispatch();
  const { teacherResults, isLoading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchTeacherStudentResults());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const groupedByTest = useMemo(() => {
    return teacherResults.reduce((accumulator, result) => {
      const testId = result.testId?._id || "unknown";

      if (!accumulator[testId]) {
        accumulator[testId] = {
          testTitle: result.testId?.title || "Untitled test",
          subject: result.testId?.subject || "Unknown subject",
          attempts: 0,
          averagePercentage: 0,
          topScore: 0,
        };
      }

      accumulator[testId].attempts += 1;
      accumulator[testId].averagePercentage += Number(result.percentage) || 0;
      accumulator[testId].topScore = Math.max(accumulator[testId].topScore, Number(result.score) || 0);

      return accumulator;
    }, {});
  }, [teacherResults]);

  const testSummaries = Object.values(groupedByTest).map((summary) => ({
    ...summary,
    averagePercentage: summary.attempts ? (summary.averagePercentage / summary.attempts).toFixed(1) : "0.0",
  }));

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-amber-200/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.96),rgba(255,255,255,0.96)),radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_30%)] p-8 shadow-[0_24px_70px_rgba(120,53,15,0.1)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Student Performance</p>
        <h1 className="mt-3 font-['Georgia'] text-4xl font-bold text-zinc-950">All student results</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          View every submission for your tests, compare performance across papers, and keep a quick eye on attempt counts.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Submissions</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">{teacherResults.length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Tests Attempted</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">{testSummaries.length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Avg Percentage</p>
            <p className="mt-2 text-3xl font-black text-zinc-950">
              {teacherResults.length
                ? (
                    teacherResults.reduce((sum, result) => sum + (Number(result.percentage) || 0), 0) /
                    teacherResults.length
                  ).toFixed(1)
                : "0.0"}
              %
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Results by Test</h2>
            <p className="text-sm text-zinc-500">A quick summary of how each test is performing.</p>
          </div>
          <Link
            to="/teacher"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <FileSpreadsheet size={16} />
            Dashboard
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
            Loading student results...
          </div>
        ) : teacherResults.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center">
            <AlertCircle size={32} className="mx-auto mb-2 text-zinc-400" />
            <p className="text-sm text-zinc-500">No student submissions have been recorded for your tests yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 xl:grid-cols-2">
              {testSummaries.map((summary) => (
                <article
                  key={`${summary.subject}-${summary.testTitle}`}
                  className="rounded-[1.75rem] border border-zinc-200 bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">{summary.subject}</p>
                  <h3 className="mt-2 text-2xl font-black text-zinc-950">{summary.testTitle}</h3>

                  <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-3">
                    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Attempts</p>
                      <p className="mt-2 text-xl font-black text-zinc-950">{summary.attempts}</p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Average</p>
                      <p className="mt-2 text-xl font-black text-zinc-950">{summary.averagePercentage}%</p>
                    </div>
                    <div className="rounded-2xl bg-zinc-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Top Score</p>
                      <p className="mt-2 text-xl font-black text-zinc-950">{summary.topScore}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 bg-white text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-600">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-600">Test</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-600">Score</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-600">Percentage</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-600">Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-zinc-600">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {teacherResults.map((result) => (
                      <tr key={result._id} className="hover:bg-zinc-50/80">
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-zinc-950">{result.studentId?.fullName}</div>
                          <div className="mt-1 text-xs text-zinc-500">{result.studentId?.email}</div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-zinc-950">{result.testId?.title}</div>
                          <div className="mt-1 text-xs text-zinc-500">{result.testId?.subject}</div>
                        </td>
                        <td className="px-4 py-4 align-top text-zinc-700">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                            <BadgeCheck size={14} />
                            {result.score}/{result.totalMarks}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-zinc-700">{result.percentage}%</td>
                        <td className="px-4 py-4 align-top text-zinc-700">{Math.round((Number(result.timeTaken) || 0) / 60)} mins</td>
                        <td className="px-4 py-4 align-top text-zinc-700">{new Date(result.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
