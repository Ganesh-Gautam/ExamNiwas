import { AlertCircle, BadgeCheck, BookOpen, Clock3, ClipboardList } from "../../lib/lucide-react.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { clearCurrentResult, fetchStudentTestResult } from "../../features/submissions/submissionSlice.js";

const formatDuration = (seconds) => {
  const totalSeconds = Number(seconds) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${remainingSeconds} sec`;
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
      <div className="rounded-4xl border border-white/80 bg-white/80 px-6 py-12 text-sm text-zinc-500 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        Loading result...
      </div>
    );
  }

  const submission = currentResult?.submission;
  const answers = currentResult?.answers ?? [];

  if (!submission) {
    return (
      <div className="rounded-4xl border border-dashed border-zinc-200 bg-white/80 px-6 py-12 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <AlertCircle size={32} className="mx-auto mb-3 text-zinc-400" />
        <h1 className="text-2xl font-black text-zinc-950">Result not available</h1>
        <p className="mt-2 text-sm text-zinc-500">We could not find a submitted result for this test.</p>
        <Link
          to="/student"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(240,253,250,0.96),rgba(255,255,255,0.96)),radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_30%)] p-8 shadow-[0_24px_70px_rgba(15,118,110,0.1)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Test Result</p>
            <h1 className="mt-3 font-['Georgia'] text-4xl font-bold text-zinc-950">{submission.testId?.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Your evaluation is complete. Review the score summary and each answer below.
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-200 bg-white/90 px-6 py-5 text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">Score</p>
            <div className="mt-2 flex items-end justify-center gap-2">
              <span className="text-4xl font-black text-emerald-700">{submission.score}</span>
              <span className="pb-1 text-sm text-zinc-500">/ {submission.totalMarks}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-zinc-700">{submission.percentage}%</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Subject</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{submission.testId?.subject}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Questions</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{answers.length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Correct</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{answers.filter((answer) => answer.isCorrect).length}</p>
          </div>
          <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Time Taken</p>
            <p className="mt-2 text-lg font-black text-zinc-950">{formatDuration(submission.timeTaken)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Answer Review</h2>
            <p className="text-sm text-zinc-500">Green highlights correct responses. Incorrect and skipped responses are marked clearly.</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/student/tests/result"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <ClipboardList size={16} />
              All results
            </Link>
            <Link
              to="/student"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              <BookOpen size={16} />
              Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {answers.map((answer, index) => {
            const wasSkipped = !answer.selectedAnswer;

            return (
              <article
                key={answer.questionId}
                className="rounded-3xl border border-zinc-200 bg-zinc-50/70 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-zinc-950">Question {index + 1}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">{answer.question}</p>
                  </div>
                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      answer.isCorrect
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {answer.isCorrect ? "Correct" : wasSkipped ? "Skipped" : "Incorrect"}
                  </div>
                </div>

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

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <div className="rounded-full bg-white px-4 py-2 text-zinc-700">
                    Your answer: <span className="font-semibold">{answer.selectedAnswer || "Not answered"}</span>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-zinc-700">
                    Correct answer: <span className="font-semibold">{answer.correctAnswer}</span>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-zinc-700">
                    Marks: <span className="font-semibold">{answer.marksObtained} / {answer.marks}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
