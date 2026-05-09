import { AlertCircle, ArrowRight, CircleHelp, Clock3, ClipboardList, ListChecks, TimerReset } from "../../lib/lucide-react.jsx";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { clearCurrentTest, fetchTestQuestions, submitTestAnswers } from "../../features/submissions/submissionSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";

const formatTime = (totalSeconds) => {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
};

function AttemptTestSession({ testId, currentTest, currentQuestions, isSaving }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const hasAutoSubmittedRef = useRef(false);
  const isSubmittingRef = useRef(false);

   useEffect(() => {
    if (!currentTest?.duration || isSaving) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [currentTest, isSaving]);

  const isQuestionAnswered = (question) => {
    const answer = answersByQuestion[question._id] || {};
    return question.type === "mcq"
      ? Boolean(answer.selectedAnswer)
      : Boolean(answer.answerText?.trim());
  };

  const answeredCount = currentQuestions.filter(isQuestionAnswered).length;
  const markedCount = currentQuestions.filter((question) => Boolean(markedForReview[question._id])).length;
  const remainingSeconds = Math.max((currentTest?.duration || 0) * 60 - elapsedSeconds, 0);

  const handleSelectAnswer = (questionId, selectedAnswer) => {
    setAnswersByQuestion((current) => ({
      ...current,
      [questionId]: {
        ...current[questionId],
        selectedAnswer,
      },
    }));
  };

  const handleAnswerTextChange = (questionId, answerText) => {
    setAnswersByQuestion((current) => ({
      ...current,
      [questionId]: {
        ...current[questionId],
        answerText,
      },
    }));
  };

  const handleToggleReview = (questionId) => {
    setMarkedForReview((current) => ({
      ...current,
      [questionId]: !current[questionId],
    }));
  };

  const handleJumpToQuestion = (questionId) => {
    document.getElementById(`question-card-${questionId}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const getQuestionPaletteStatus = (question) => {
    const isMarked = Boolean(markedForReview[question._id]);
    const isAnswered = isQuestionAnswered(question);

    if (isMarked && isAnswered) {
      return {
        label: "Answered + Review",
        className: "border-amber-300 bg-amber-100 text-amber-900",
      };
    }

    if (isMarked) {
      return {
        label: "Review",
        className: "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-900",
      };
    }

    if (isAnswered) {
      return {
        label: "Answered",
        className: "border-emerald-300 bg-emerald-100 text-emerald-900",
      };
    }

    return {
      label: "Unanswered",
      className: "border-zinc-200 bg-white text-zinc-600",
    };
  };

  const handleSubmit = async (shouldNotify = true) => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;

    try {
      const answers = currentQuestions.map((question) => ({
        questionId: question._id,
        selectedAnswer: question.type === "mcq" ? answersByQuestion[question._id]?.selectedAnswer || "" : "",
        answerText: question.type === "written" ? answersByQuestion[question._id]?.answerText || "" : "",
      }));

      await dispatch(
        submitTestAnswers({
          testId,
          answers,
          timeTaken: elapsedSeconds,
        })
      ).unwrap();

      if (shouldNotify) {
        toast.success("Test submitted successfully");
      }

      navigate(`/student/tests/${testId}/result`);
    } catch (submitError) {
      toast.error(extractApiErrorMessage(submitError));
      isSubmittingRef.current = false;
    }
  };

  const autoSubmit = useEffectEvent(() => {
    toast("Time is up. Submitting your test...");
    handleSubmit(false);
  });

  useEffect(() => {
    if (remainingSeconds === 300) {
      toast("⏱️ 5 minutes remaining", { icon: "⏱️" });
    } else if (remainingSeconds === 60) {
      toast.error("🚨 Only 1 minute left! Get ready to submit.");
    } else if (remainingSeconds === 30) {
      toast.error("⚠️ 30 seconds remaining!", { duration: 3000 });
    }
  }, [remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds !== 0 || hasAutoSubmittedRef.current || isSaving) {
      return;
    }

    hasAutoSubmittedRef.current = true;
    autoSubmit();
  }, [currentTest, isSaving, remainingSeconds]);

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(255,255,255,0.96)),radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_30%)] p-8 shadow-[0_24px_70px_rgba(15,118,110,0.1)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Attempt Test</p>
            <h1 className="mt-3 font-['Georgia'] text-4xl font-bold text-zinc-950">{currentTest.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Read each MCQ carefully and submit before the timer ends.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Subject</p>
              <p className="mt-2 text-lg font-black text-zinc-950">{currentTest.subject}</p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/80 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Questions</p>
              <p className="mt-2 text-lg font-black text-zinc-950">{currentTest.totalQuestions}</p>
            </div>
            <div
              className={`rounded-3xl border p-4 ${
                remainingSeconds > 300
                  ? "border-emerald-200 bg-emerald-50"
                  : remainingSeconds > 60
                    ? "border-amber-200 bg-amber-50"
                    : "border-rose-200 bg-rose-50"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-[0.25em] ${
                  remainingSeconds > 300
                    ? "text-emerald-700"
                    : remainingSeconds > 60
                      ? "text-amber-700"
                      : "text-rose-700"
                }`}
              >
                {remainingSeconds > 60 ? "Time Left" : "⏰ HURRY UP"}
              </p>
              <p
                className={`mt-2 text-lg font-black ${
                  remainingSeconds > 300
                    ? "text-emerald-700"
                    : remainingSeconds > 60
                      ? "text-amber-700"
                      : "text-rose-700"
                }`}
              >
                {formatTime(remainingSeconds)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
        <div className="space-y-5">
          {currentQuestions.map((question, index) => (
            <article
              key={question._id}
              id={`question-card-${question._id}`}
              className="rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <CircleHelp size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-black text-zinc-950">Question {index + 1}</h2>
                    <div className="flex flex-wrap items-center gap-2">
                      {markedForReview[question._id] && (
                        <div className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-800">
                          Marked for review
                        </div>
                      )}
                      <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                        {question.marks} mark{question.marks > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-base leading-7 text-zinc-700">{question.question}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {question.type === "written" ? (
                  <label className="grid gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-sm">
                    <span className="text-sm font-semibold text-zinc-700">Your answer</span>
                    <textarea
                      value={answersByQuestion[question._id]?.answerText || ""}
                      onChange={(event) => handleAnswerTextChange(question._id, event.target.value)}
                      className="min-h-[180px] resize-y rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-400"
                      placeholder="Write your answer here..."
                    />
                  </label>
                ) : (
                  question.options.map((option, optionIndex) => {
                    const isSelected = answersByQuestion[question._id]?.selectedAnswer === option;

                    return (
                      <label
                        key={`${question._id}-${optionIndex}`}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                          isSelected
                            ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                            : "border-zinc-200 bg-white text-zinc-700 hover:border-emerald-200 hover:bg-emerald-50/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question._id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() => handleSelectAnswer(question._id, option)}
                          className="mt-1 h-4 w-4 accent-emerald-600"
                        />
                        <span className="leading-6">
                          <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleReview(question._id)}
                  className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                    markedForReview[question._id]
                      ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900 hover:bg-fuchsia-100"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-fuchsia-200 hover:bg-fuchsia-50"
                  }`}
                >
                  <ListChecks size={16} />
                  {markedForReview[question._id] ? "Unmark review" : "Mark for review"}
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-4xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <h2 className="text-2xl font-black text-zinc-950">Submission Panel</h2>
          <p className="mt-2 text-sm text-zinc-500">You can review your progress and submit whenever you are ready.</p>

          {/* Time Progress Bar */}
          <div className="mt-6 rounded-2xl bg-zinc-100 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 mb-2">
              <span>Time Progress</span>
              <span>{Math.round((elapsedSeconds / (currentTest.duration * 60)) * 100)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                className={`h-full transition-all ${
                  remainingSeconds > 300
                    ? "bg-emerald-500"
                    : remainingSeconds > 60
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
                style={{
                  width: `${Math.min((elapsedSeconds / (currentTest.duration * 60)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-zinc-700">
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
              <span className="flex items-center gap-2">
                <ClipboardList size={16} className="text-emerald-600" />
                Answered
              </span>
              <span className="font-black text-zinc-950">{answeredCount}/{currentQuestions.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-fuchsia-50 px-4 py-3 text-fuchsia-900">
              <span className="flex items-center gap-2">
                <ListChecks size={16} className="text-fuchsia-700" />
                Marked for review
              </span>
              <span className="font-black">{markedCount}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
              <span className="flex items-center gap-2">
                <TimerReset size={16} className="text-emerald-600" />
                Duration
              </span>
              <span className="font-black text-zinc-950">{currentTest.duration} mins</span>
            </div>
            <div
              className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                remainingSeconds > 300
                  ? "bg-zinc-50 text-zinc-700"
                  : remainingSeconds > 60
                    ? "bg-amber-50 text-amber-700"
                    : "bg-rose-50 text-rose-700 font-bold"
              }`}
            >
              <span className="flex items-center gap-2">
                <Clock3 size={16} className={remainingSeconds > 300 ? "text-emerald-600" : remainingSeconds > 60 ? "text-amber-600" : "text-rose-600"} />
                Time left
              </span>
              <span className="font-black text-zinc-950">{formatTime(remainingSeconds)}</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-black text-zinc-950">Question Palette</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
                Jump to any question
              </span>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 xl:grid-cols-4">
              {currentQuestions.map((question, index) => {
                const paletteStatus = getQuestionPaletteStatus(question);

                return (
                  <button
                    key={question._id}
                    type="button"
                    onClick={() => handleJumpToQuestion(question._id)}
                    className={`rounded-2xl border px-3 py-3 text-center text-sm font-black transition hover:-translate-y-0.5 ${paletteStatus.className}`}
                    title={`Question ${index + 1}: ${paletteStatus.label}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-2 text-xs text-zinc-600">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
                Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-fuchsia-300" />
                Marked for review
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                Answered and marked for review
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border border-zinc-300 bg-white" />
                Unanswered
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSaving || remainingSeconds === 0}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition ${
              remainingSeconds === 0
                ? "cursor-not-allowed bg-zinc-300 text-white opacity-50"
                : "bg-zinc-950 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            }`}
          >
            <ArrowRight size={16} />
            {isSaving ? "Submitting..." : remainingSeconds === 0 ? "Auto-submitting..." : "Submit Test"}
          </button>

          {remainingSeconds === 0 && (
            <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-center text-sm text-rose-700">
              ⏰ Time is up! Your test is being auto-submitted...
            </div>
          )}

          <Link
            to="/student"
            className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Exit to dashboard
          </Link>
        </aside>
      </section>
    </div>
  );
}

export default function AttemptTest() {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const { currentTest, currentQuestions, isLoading, isSaving, error } = useSelector((state) => state.submissions);

  useEffect(() => {
    dispatch(fetchTestQuestions({ testId }));

    return () => {
      dispatch(clearCurrentTest());
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
        Loading your test...
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="rounded-4xl border border-dashed border-zinc-200 bg-white/80 px-6 py-12 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <AlertCircle size={32} className="mx-auto mb-3 text-zinc-400" />
        <h1 className="text-2xl font-black text-zinc-950">Test unavailable</h1>
        <p className="mt-2 text-sm text-zinc-500">This test could not be loaded or has already been submitted.</p>
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
    <AttemptTestSession
      key={testId}
      testId={testId}
      currentTest={currentTest}
      currentQuestions={currentQuestions}
      isSaving={isSaving}
    />
  );
}
