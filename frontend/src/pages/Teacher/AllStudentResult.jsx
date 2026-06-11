import { AlertCircle, BadgeCheck, FileSpreadsheet } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchTeacherStudentResults } from "../../features/submissions/submissionSlice.js";
import { EmptyState, PageHero, SectionCard, StatCard, primaryButtonClass, secondaryButtonClass, pageWrapClass } from "../../components/common/ui.jsx";

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
      const key = result.testId?._id || "unknown";
      if (!accumulator[key]) {
        accumulator[key] = {
          testTitle: result.testId?.title || "Untitled test",
          subject: result.testId?.subject || "Unknown subject",
          attempts: 0,
          averagePercentage: 0,
          topScore: 0,
        };
      }

      accumulator[key].attempts += 1;
      accumulator[key].averagePercentage += Number(result.percentage) || 0;
      accumulator[key].topScore = Math.max(accumulator[key].topScore, Number(result.score) || 0);
      return accumulator;
    }, {});
  }, [teacherResults]);

  const testSummaries = Object.values(groupedByTest).map((summary) => ({
    ...summary,
    averagePercentage: summary.attempts ? (summary.averagePercentage / summary.attempts).toFixed(1) : "0.0",
  }));

  const globalAverage = teacherResults.length
    ? (
        teacherResults.reduce((sum, result) => sum + (Number(result.percentage) || 0), 0) /
        teacherResults.length
      ).toFixed(1)
    : "0.0";

  return (
    <div className={`${pageWrapClass} page-enter`}>
      <PageHero
        eyebrow="Teacher Analytics"
        title="All student results"
        description="Review submission volume, compare test performance, and jump into detailed paper evaluation."
        accent="amber"
        actions={<Link to="/teacher" className={primaryButtonClass}><FileSpreadsheet size={16} />Dashboard</Link>}
        stats={[
          <StatCard key="submissions" label="Submissions" value={teacherResults.length} hint="All recorded attempts." />,
          <StatCard key="tests" label="Tests Attempted" value={testSummaries.length} hint="Unique tests with submissions." />,
          <StatCard key="average" label="Average Score" value={`${globalAverage}%`} hint="Across all submitted results." />,
        ]}
      />

      <SectionCard title="Results by Test" >
        {isLoading ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-sm text-slate-500">
            Loading student results...
          </div>
        ) : teacherResults.length === 0 ? (
          <EmptyState icon={<AlertCircle size={24} />} title="No student submissions yet" description="As students submit tests, they will appear here for review and analysis." />
        ) : (
          <>
            <div className="grid gap-4 xl:grid-cols-2">
              {testSummaries.map((summary) => (
                <article key={`${summary.subject}-${summary.testTitle}`} className="rounded-[1.75rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.88))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">{summary.subject}</p>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{summary.testTitle}</h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Attempts</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{summary.attempts}</p>
                    </div>
                    <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Average</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{summary.averagePercentage}%</p>
                    </div>
                    <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Top Score</p>
                      <p className="mt-2 text-xl font-semibold text-slate-950">{summary.topScore}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Student</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Test</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Score</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Percentage</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Submitted</th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {teacherResults.map((result) => (
                      <tr key={result._id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-slate-950">{result.studentId?.fullName}</div>
                          <div className="mt-1 text-xs text-slate-500">{result.studentId?.email}</div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="font-semibold text-slate-950">{result.testId?.title}</div>
                          <div className="mt-1 text-xs text-slate-500">{result.testId?.subject}</div>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                            <BadgeCheck size={14} />
                            {result.score}/{result.totalMarks}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-slate-700">{result.percentage}%</td>
                        <td className="px-4 py-4 align-top">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${result.status === "submitted" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                            {result.status === "submitted" ? "Pending" : "Evaluated"}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-top text-slate-700">{Math.round((Number(result.timeTaken) || 0) / 60)} mins</td>
                        <td className="px-4 py-4 align-top text-slate-700">{new Date(result.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-4 align-top">
                          <Link to={`/teacher/submissions/${result._id}`} className={secondaryButtonClass}>
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
