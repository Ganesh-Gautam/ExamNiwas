import { AlertCircle, BadgeCheck, Clock3, ClipboardList, FileSpreadsheet, Users } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchTeacherSubmissionDetails,
  evaluateTeacherSubmission,
} from "../../features/submissions/submissionSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
};

export default function SubmissionReview() {
  const { submissionId } = useParams();
  const dispatch = useDispatch();
  const { submissionDetails, isLoading, isSaving, error } = useSelector((state) => state.submissions);
  const [gradedMarks, setGradedMarks] = useState({});

  useEffect(() => {
    dispatch(fetchTeacherSubmissionDetails({ submissionId }));
  }, [dispatch, submissionId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!submissionDetails) {
      return;
    }

    const initialMarks = {};
    submissionDetails.answers?.forEach((answer) => {
      if (answer.type === "written") {
        initialMarks[answer.questionId] = answer.marksObtained || 0;
      }
    });
    setGradedMarks(initialMarks);
  }, [submissionDetails]);

  const submission = submissionDetails?.submission;
  const answers = submissionDetails?.answers ?? [];
  const pending = submission?.status === "submitted";

  const handleChangeMarks = (questionId, value) => {
    setGradedMarks((current) => ({
      ...current,
      [questionId]: value,
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

  const totalWritten = useMemo(
    () => answers.filter((answer) => answer.type === "written").length,
    [answers]
  );

  if (isLoading || !submission) {
    return (
      <div className="rounded-4xl border border-white/80 bg-white/80 px-6 py-12 text-sm text-zinc-500 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        Loading submission details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-amber-200/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.96),rgba(255,255,255,0.96)),radial-gradient(circle_at_top_right,rgba(251,191,36,0.15),transparent_30%)] p-8 shadow-[0_24px_70px_rgba(120,53,15,0.1)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Review submission</p>
        <h1 className="mt-3 font-['Georgia'] text-4xl font-bold text-zinc-950">{submission.testId?.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
          Review the student answers and assign marks for written questions. This page is for teacher evaluation only.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Student</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{submission.studentId?.fullName || "Unknown"}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Question count</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{answers.length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Written items</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{totalWritten}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Status</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{pending ? "Pending" : "Evaluated"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Student answers</h2>
            <p className="text-sm text-zinc-500">Enter marks for written responses and save your evaluation.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/teacher/tests/results"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <FileSpreadsheet size={16} />
              Back to results
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {answers.map((answer, index) => (
            <article key={answer.questionId} className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-black text-zinc-950">Question {index + 1}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">{answer.question}</p>
                </div>
                <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                  {answer.type === "written" ? "Written" : "MCQ"}
                </div>
              </div>

              {answer.type === "mcq" ? (
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {answer.options?.map((option, optionIndex) => {
                    const isCorrectOption = option === answer.correctAnswer;
                    const isChosenOption = option === answer.selectedAnswer;

                    return (
                      <div
                        key={`${answer.questionId}-${optionIndex}`}
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          isCorrectOption
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : isChosenOption
                              ? "border-rose-200 bg-rose-50 text-rose-800"
                              : "border-zinc-200 bg-white text-zinc-700"
                        }`}
                      >
                        <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm text-zinc-700">
                  <p className="font-semibold text-zinc-900">Student response</p>
                  <p className="mt-2 whitespace-pre-line">{answer.answerText || "No answer provided."}</p>
                </div>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700">
                  Marks available: <span className="font-semibold">{answer.marks}</span>
                </div>
                {answer.type === "written" ? (
                  <label className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm">
                    <span className="font-semibold text-zinc-700">Marks awarded</span>
                    <input
                      type="number"
                      min="0"
                      max={answer.marks}
                      value={gradedMarks[answer.questionId] ?? 0}
                      onChange={(event) => handleChangeMarks(answer.questionId, Math.max(0, Number(event.target.value || 0)))}
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-400"
                    />
                  </label>
                ) : (
                  <div className="rounded-full bg-white px-4 py-2 text-sm text-zinc-700">
                    Marks awarded: <span className="font-semibold">{answer.marksObtained} / {answer.marks}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500">
            {pending
              ? "Only written answers require grading. Fill in marks and save evaluation."
              : "Evaluation completed. Update marks and save again if needed."}
          </p>
          <button
            type="button"
            onClick={handleSaveEvaluation}
            disabled={isSaving || totalWritten === 0}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <BadgeCheck size={16} />
            {isSaving ? "Saving..." : "Save evaluation"}
          </button>
        </div>
      </section>
    </div>
  );
}
