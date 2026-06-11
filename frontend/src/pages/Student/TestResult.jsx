import { AlertCircle, BookOpen, ClipboardList } from "../../lib/lucide-react.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { clearCurrentResult, fetchStudentTestResult } from "../../features/submissions/submissionSlice.js";
import { cn, EmptyState, PageHero, SectionCard, StatCard, primaryButtonClass, secondaryButtonClass, pageWrapClass, surfaceClass, noticeClass } from "../../components/common/ui.jsx";

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return remainingSeconds === 0 ? `${minutes} min` : `${minutes} min ${remainingSeconds} sec`;
};

export default function TestResult() {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const { currentResult, isLoading, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchStudentTestResult({ testId }));

    return () => {
      dispatch(clearCurrentResult());
    };
  }, [dispatch, testId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className={noticeClass}>
        Loading result...
      </div>
    );
  }

  const submission = currentResult?.submission;
  const answers = currentResult?.answers ?? [];
  const isPending = submission?.status === "submitted";
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const incorrectCount = answers.filter((answer) => answer.type === "mcq" && answer.selectedAnswer && !answer.isCorrect).length;
  const skippedCount = answers.filter((answer) => (answer.type === "mcq" ? !answer.selectedAnswer : !answer.answerText?.trim())).length;

  if (!submission) {
    return (
      <EmptyState
        icon={<AlertCircle size={24} />}
        title="Result not available"
        description="We could not find a submitted result for this test."
        action={
          <Link to="/student" className={primaryButtonClass}>
            Back to dashboard
          </Link>
        }
      />
    );
  }

  return (
    <div className={`${pageWrapClass} page-enter`}>
      <PageHero
        eyebrow="Result Overview"
        title={submission.testId?.title}
        description={
          isPending
            ? "Your written responses are waiting for teacher evaluation. You can still review your submission and status here."
            : "Your evaluation is complete. Review the overall score, answer quality, and detailed breakdown below."
        }
        accent={isPending ? "amber" : "emerald"}
        actions={
          <>
            <Link to="/student/tests/result" className={secondaryButtonClass}>
              <ClipboardList size={16} />
              All results
            </Link>
            <Link to="/student" className={primaryButtonClass}>
              <BookOpen size={16} />
              Dashboard
            </Link>
          </>
        }
        stats={[
          <StatCard key="score" label="Score" value={`${submission.score}/${submission.totalMarks}`} hint={`${submission.percentage}% overall`} tone="success" />,
          <StatCard key="correct" label="Correct" value={correctCount} hint="Auto-checked correct answers." />,
          <StatCard key="incorrect" label="Incorrect" value={incorrectCount} hint="Wrong MCQ responses." />,
          <StatCard key="time" label="Time Taken" value={formatDuration(submission.timeTaken)} hint={isPending ? "Waiting on final grading." : "Submission complete."} />,
        ]}
      />

      <SectionCard
        title="Performance Summary"
        description="A cleaner snapshot of what went right, what was skipped, and how the attempt was scored."
      >
        <div className="grid gap-4 lg:grid-cols-4">
          <div className={cn(surfaceClass, "p-5")}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Subject</p>
            <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-100">{submission.testId?.subject}</p>
          </div>
          <div className={cn(surfaceClass, "p-5")}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Questions</p>
            <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-100">{answers.length}</p>
          </div>
          <div className={cn(surfaceClass, "p-5")}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Skipped</p>
            <p className="mt-3 text-xl font-semibold text-slate-950 dark:text-slate-100">{skippedCount}</p>
          </div>
          <div className={cn(surfaceClass, "p-5")}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Negative Marking</p>
            <p className="mt-3 text-sm font-semibold text-slate-950 dark:text-slate-100">
              {submission.testId?.negativeMarkingEnabled ? `-${submission.testId?.negativeMarkingValue} per wrong MCQ` : "Not enabled"}
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Answer Review"
        description="Correct answers, skipped responses, and written submissions are grouped more clearly for quick review."
      >
        <div className="space-y-4">
          {answers.map((answer, index) => {
            const wasSkipped = answer.type === "mcq" ? !answer.selectedAnswer : !answer.answerText?.trim();
            const statusLabel = answer.type === "written"
              ? isPending
                ? "Awaiting evaluation"
                : "Evaluated"
              : answer.isCorrect
                ? "Correct"
                : wasSkipped
                  ? "Skipped"
                  : "Incorrect";

            const statusClass = answer.type === "written"
              ? isPending
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
              : answer.isCorrect
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700";

            return (
              <article key={answer.questionId} className={cn(surfaceClass, "p-5") }>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">Question {index + 1}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{answer.question}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>{statusLabel}</span>
                </div>

                {answer.type === "mcq" ? (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {answer.options?.map((option, optionIndex) => {
                      const isCorrectOption = option === answer.correctAnswer;
                      const isChosenOption = option === answer.selectedAnswer;

                      return (
                        <div
                          key={`${answer.questionId}-${optionIndex}`}
                          className={`rounded-[1.25rem] border px-4 py-3 text-sm ${
                            isCorrectOption
                              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                              : isChosenOption
                                ? "border-rose-200 bg-rose-50 text-rose-800"
                                : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-5 rounded-3xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">Answer text</p>
                    <p className="mt-2 whitespace-pre-line">{answer.answerText || "No answer provided."}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  {answer.type === "mcq" ? (
                    <>
                      <div className="rounded-full bg-white px-4 py-2 text-slate-700">
                        Your answer: <span className="font-semibold">{answer.selectedAnswer || "Not answered"}</span>
                      </div>
                      <div className="rounded-full bg-white px-4 py-2 text-slate-700">
                        Correct answer: <span className="font-semibold">{answer.correctAnswer}</span>
                      </div>
                    </>
                  ) : null}
                  <div className="rounded-full bg-white px-4 py-2 text-slate-700">
                    Marks: <span className="font-semibold">{answer.marksObtained} / {answer.marks}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
