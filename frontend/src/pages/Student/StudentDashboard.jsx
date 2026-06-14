import { AlertCircle, BookOpen, CalendarDays, ClipboardList, Clock3, PlusCircle, TimerReset } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchAvailableTests, fetchStudentResults } from "../../features/submissions/submissionSlice.js";
import { EmptyState, PageHero, SectionCard, StatCard, cn, noticeClass, primaryButtonClass, secondaryButtonClass, pageWrapClass, surfaceClass } from "../../components/common/ui.jsx";

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

  const now = new Date();

  const resolveTestId = (result) => result.testId?._id || result.testId || "";

  const attemptedTestIds = useMemo(
    () => new Set(studentResults.map((result) => resolveTestId(result)).filter(Boolean)),
    [studentResults]
  );

  const averagePercentage = studentResults.length
    ? (
        studentResults.reduce((sum, result) => sum + (Number(result.percentage) || 0), 0) /
        studentResults.length
      ).toFixed(1)
    : "0.0";

  const completedCount = studentResults.length;
  const upcomingCount = availableTests.filter((test) => new Date(test.startTime) > now).length;
  const openTests = availableTests.filter((test) => new Date(test.startTime) <= now && new Date(test.endTime) >= now);
  const nextOpenTest = openTests[0] || null;

  const getResultForTest = (testId) => studentResults.find((result) => resolveTestId(result) === testId);

  return (
    <div className={`${pageWrapClass} page-enter`}> 
      <PageHero
        eyebrow="Student Portal"
        title={`Welcome back, ${user?.fullName?.split(" ")[0] || "Student"}.`}
        description="Start live exams, revisit completed attempts, and track your performance."
        accent="emerald"
        actions={
          <>
            <Link to="/student/tests/result" className={secondaryButtonClass}>
              <ClipboardList size={16} />
              View result history
            </Link>
            {nextOpenTest ? (
              <Link to={`/student/tests/${nextOpenTest._id}/attempt`} className={primaryButtonClass}>
                <PlusCircle size={16} />
                Start latest test
              </Link>
            ) : null}
          </>
        }
        stats={[
          <StatCard key="available" label="Available Tests" value={availableTests.length} hint="Tests currently visible for you." />,
          <StatCard key="upcoming" label="Upcoming Exams" value={upcomingCount} hint="Scheduled to open soon." />,
          <StatCard key="completed" label="Completed Exams" value={completedCount} hint="Your submitted attempts." />,
          <StatCard key="average" label="Average Score" value={`${averagePercentage}%`} hint="Across evaluated submissions." tone="success" />,
        ]}
      />

      <SectionCard
        title="Available Tests"
        description="Open tests are listed here with timing, question count, and direct actions."
      >
        {isLoading ? (
          <div className={noticeClass}>
            Loading tests...
          </div>
        ) : availableTests.length === 0 ? (
          <EmptyState
            icon={<AlertCircle size={24} />}
            title="No tests available yet"
            description="Nothing is open for attempt right now. Check back later for newly scheduled exams."
          />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {availableTests.map((test) => {
              const isAttempted = attemptedTestIds.has(test._id);
              const result = getResultForTest(test._id);

              return (
                <article
                  key={test._id}
                  className={cn(surfaceClass, "group p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">{test.subject}</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{test.title}</h3>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${isAttempted ? "bg-emerald-100 text-emerald-700" : "bg-slate-950/10 text-slate-600 dark:bg-slate-800/70 dark:text-slate-200"}`}>
                      {isAttempted ? "Completed" : "Open"}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2"><TimerReset size={16} className="text-emerald-600" />{test.duration} minutes</div>
                    <div className="flex items-center gap-2"><ClipboardList size={16} className="text-emerald-600" />{test.totalQuestions || 0} questions</div>
                    <div className="flex items-center gap-2"><Clock3 size={16} className="text-emerald-600" />{new Date(test.startTime).toLocaleString()}</div>
                    <div className="flex items-center gap-2"><CalendarDays size={16} className="text-emerald-600" />Ends {new Date(test.endTime).toLocaleString()}</div>
                  </div>

                  {result ? (
                    <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">Latest Score</p>
                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-3xl font-semibold tracking-[-0.04em] text-emerald-700">{result.score}</span>
                        <span className="pb-1 text-sm text-emerald-700">/ {result.totalMarks}</span>
                      </div>
                      <p className="mt-2 text-sm text-emerald-800">{result.percentage.toFixed(1)}% scored</p>
                    </div>
                  ) : (
                    <div className={cn(surfaceClass, "mt-5 p-4 text-sm text-slate-500") }>
                      This exam has not been attempted yet.
                    </div>
                  )}

                  <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                    {isAttempted ? (
                      <Link to={`/student/tests/${test._id}/result`} className={`${secondaryButtonClass} flex-1`}>
                        <BookOpen size={16} />
                        View result
                      </Link>
                    ) : new Date(test.startTime) > now ? (
                      <button className={`${secondaryButtonClass} flex-1 cursor-not-allowed opacity-60`} type="button" disabled>
                        <Clock3 size={16} />
                        Scheduled
                      </button>
                    ) : (
                      <Link to={`/student/tests/${test._id}/attempt`} className={`${primaryButtonClass} flex-1 bg-emerald-600 hover:bg-emerald-700`}>
                        <PlusCircle size={16} />
                        Attempt now
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
