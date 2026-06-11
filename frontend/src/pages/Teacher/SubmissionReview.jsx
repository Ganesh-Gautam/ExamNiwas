import { AlertCircle, BadgeCheck, FileSpreadsheet } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { evaluateTeacherSubmission, fetchTeacherSubmissionDetails } from "../../features/submissions/submissionSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";
import { cn, EmptyState, PageHero, SectionCard, StatCard, inputClass, primaryButtonClass, secondaryButtonClass, pageWrapClass, surfaceClass, noticeClass } from "../../components/common/ui.jsx";

export default function SubmissionReview() {
  const { submissionId } = useParams();
  const dispatch = useDispatch();
  const { submissionDetails, isLoading, isSaving, error } = useSelector((state) => state.submissions);
  const [gradedMarksBySubmission, setGradedMarksBySubmission] = useState({});

  useEffect(() => {
    dispatch(fetchTeacherSubmissionDetails({ submissionId }));
  }, [dispatch, submissionId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const submission = submissionDetails?.submission;
  const answers = useMemo(() => submissionDetails?.answers ?? [], [submissionDetails?.answers]);
  const initialGradedMarks = useMemo(() => {
    const initialMarks = {};
    answers.forEach((answer) => {
      if (answer.type === "written") {
        initialMarks[answer.questionId] = answer.marksObtained || 0;
      }
    });
    return initialMarks;
  }, [answers]);

  const gradedMarks = {
    ...initialGradedMarks,
    ...(gradedMarksBySubmission[submissionId] || {}),
  };
  const pending = submission?.status === "submitted";

  const totalWritten = useMemo(() => answers.filter((answer) => answer.type === "written").length, [answers]);

  const handleChangeMarks = (questionId, value) => {
    setGradedMarksBySubmission((current) => ({
      ...current,
      [submissionId]: {
        ...(current[submissionId] || {}),
        [questionId]: value,
      },
    }));
  };

  const handleSaveEvaluation = async () => {
    try {
      const answersToEvaluate = answers
        .filter((answer) => answer.type === "written")
        .map((answer) => ({
          questionId: answer.questionId,
          marksObtained: Number(gradedMarks[answer.questionId] || 0),
        }));

      await dispatch(evaluateTeacherSubmission({ submissionId, answers: answersToEvaluate })).unwrap();
      toast.success("Submission evaluated successfully");
    } catch (submitError) {
      toast.error(extractApiErrorMessage(submitError));
    }
  };

  if (isLoading) {
    return (
      <div className={noticeClass}>
        Loading submission details...
      </div>
    );
  }

  if (!submission) {
    return (
      <EmptyState
        icon={<AlertCircle size={24} />}
        title="Submission unavailable"
        description="This submission could not be loaded for review."
        action={<Link to="/teacher/tests/results" className={primaryButtonClass}>Back to results</Link>}
      />
    );
  }

  return (
    <div className={`${pageWrapClass} page-enter`}>
      <PageHero
        eyebrow="Review Submission"
        title={submission.testId?.title}
        description="Review each answer, assign marks to written responses, and finalize the student submission."
        accent="amber"
        actions={<Link to="/teacher/tests/results" className={secondaryButtonClass}><FileSpreadsheet size={16} />Back to results</Link>}
        stats={[
          <StatCard key="student" label="Student" value={submission.studentId?.fullName || "Unknown"} hint={submission.studentId?.email || "Student submission"} />,
          <StatCard key="questions" label="Questions" value={answers.length} hint="Total submitted responses." />,
          <StatCard key="written" label="Written Items" value={totalWritten} hint="Require manual grading." />,
          <StatCard key="status" label="Status" value={pending ? "Pending" : "Evaluated"} hint={pending ? "Awaiting final review." : "Marks already saved."} />,
        ]}
      />

      <SectionCard title="Student Answers" description="MCQ items show correctness immediately. Written responses can be graded directly inline.">
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <article key={answer.questionId} className={cn(surfaceClass, "p-5")}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Question {index + 1}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{answer.question}</p>
                </div>
                <span className="rounded-full bg-slate-50/95 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-950/80 dark:text-slate-100">
                  {answer.type === "written" ? "Written" : "MCQ"}
                </span>
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
                              : "border-slate-200 bg-slate-50/95 text-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                        }`}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50/95 px-4 py-4 text-sm text-slate-700 dark:bg-slate-950/80 dark:text-slate-100">
                  <p className="font-semibold text-slate-900">Student response</p>
                  <p className="mt-2 whitespace-pre-line">{answer.answerText || "No answer provided."}</p>
                </div>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.25rem] bg-white px-4 py-3 text-sm text-slate-700">
                  Marks available: <span className="font-semibold">{answer.marks}</span>
                </div>
                {answer.type === "written" ? (
                  <label className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 text-sm">
                    <span className="font-semibold text-slate-700">Marks awarded</span>
                    <input
                      type="number"
                      min="0"
                      max={answer.marks}
                      value={gradedMarks[answer.questionId] ?? 0}
                      onChange={(event) => handleChangeMarks(answer.questionId, Math.max(0, Number(event.target.value || 0)))}
                      className={inputClass}
                    />
                  </label>
                ) : (
                  <div className="rounded-[1.25rem] bg-white px-4 py-3 text-sm text-slate-700">
                    Marks awarded: <span className="font-semibold">{answer.marksObtained} / {answer.marks}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            {pending
              ? "Only written answers require grading. Assign marks and save when ready."
              : "This paper has already been evaluated. You can still update marks and save again if needed."}
          </p>
          <button type="button" onClick={handleSaveEvaluation} disabled={isSaving || totalWritten === 0} className={primaryButtonClass}>
            <BadgeCheck size={16} />
            {isSaving ? "Saving..." : "Save evaluation"}
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
