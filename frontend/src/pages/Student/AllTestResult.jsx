import { AlertCircle, BadgeCheck, CalendarDays, ClipboardList, Clock3, Eye } from "../../lib/lucide-react.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchStudentResults } from "../../features/submissions/submissionSlice.js";
import { EmptyState, PageHero, SectionCard, StatCard, primaryButtonClass, pageWrapClass } from "../../components/common/ui.jsx";

const formatDuration = (seconds) => `${Math.round((Number(seconds) || 0) / 60)} min`;

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
    <div className={`${pageWrapClass} page-enter`}>
      <PageHero
        eyebrow="Result History"
        title="Your complete exam record"
        description="Review every attempted test, compare scoring trends, and reopen detailed answer analysis when you need it."
        accent="emerald"
        actions={
          <Link to="/student" className={primaryButtonClass}>
            <ClipboardList size={16} />
            Dashboard
          </Link>
        }
        stats={[
          <StatCard key="attempts" label="Attempts" value={studentResults.length} hint="All submitted tests." />,
          <StatCard key="average" label="Average" value={`${averagePercentage}%`} hint="Across evaluated tests." />,
          <StatCard key="best" label="Best Score" value={studentResults.length ? Math.max(...studentResults.map((result) => Number(result.score) || 0)) : 0} hint="Highest marks earned." />,
        ]}
      />

      <SectionCard
        title="Attempted Tests"
        description="Latest results appear first with score, duration, and a quick route to the full review."
      >
        {isLoading ? (
          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-sm text-slate-500">
            Loading your results...
          </div>
        ) : studentResults.length === 0 ? (
          <EmptyState
            icon={<AlertCircle size={24} />}
            title="No attempts yet"
            description="You have not submitted any tests yet. Once you do, they will appear here."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {studentResults.map((result) => (
              <article
                key={result._id}
                className="rounded-[1.75rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.88))] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">{result.testId?.subject}</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{result.testId?.title}</h3>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {result.percentage}%
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2"><BadgeCheck size={16} className="text-emerald-600" />Score {result.score}/{result.totalMarks}</div>
                  <div className="flex items-center gap-2"><Clock3 size={16} className="text-emerald-600" />Time taken {formatDuration(result.timeTaken)}</div>
                  <div className="flex items-center gap-2"><ClipboardList size={16} className="text-emerald-600" />Duration {result.testId?.duration} mins</div>
                  <div className="flex items-center gap-2"><CalendarDays size={16} className="text-emerald-600" />{new Date(result.createdAt).toLocaleString()}</div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <Link to={`/student/tests/${result.testId?._id}/result`} className={`${primaryButtonClass} w-full bg-emerald-600 hover:bg-emerald-700`}>
                    <Eye size={16} />
                    View full result
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
