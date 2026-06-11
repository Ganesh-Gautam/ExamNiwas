import { AlertCircle, ArrowRight, ArrowLeft, Clock3, ClipboardList, ListChecks } from "../../lib/lucide-react.jsx";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { clearCurrentTest, fetchTestQuestions, submitTestAnswers } from "../../features/submissions/submissionSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";
import { cn, EmptyState, primaryButtonClass, secondaryButtonClass, surfaceClass, noticeClass } from "../../components/common/ui.jsx";
import QuestionCard from "../../components/QuestionCard.jsx";

const formatTime = (totalSeconds) => {
  const safeSeconds = Math.max(totalSeconds, 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");

  return hours > 0 ? `${hours.toString().padStart(2, "0")}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
};

function AttemptTestSession({ testId, currentTest, currentQuestions, isSaving }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [answersByQuestion, setAnswersByQuestion] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
    const questionIndex = currentQuestions.findIndex((q) => q._id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const getQuestionPaletteStatus = (question) => {
    const isMarked = Boolean(markedForReview[question._id]);
    const isAnswered = isQuestionAnswered(question);

    if (isMarked && isAnswered) {
      return { label: "Answered and marked", className: "border-amber-300 bg-amber-100 text-amber-900" };
    }
    if (isMarked) {
      return { label: "Marked for review", className: "border-fuchsia-300 bg-fuchsia-100 text-fuchsia-900" };
    }
    if (isAnswered) {
      return { label: "Answered", className: "border-emerald-300 bg-emerald-100 text-emerald-900" };
    }
    return { label: "Unanswered", className: "border-slate-200 bg-slate-50/95 text-slate-600 dark:bg-slate-950/75 dark:text-slate-200" };
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
      toast("5 minutes remaining");
    } else if (remainingSeconds === 60) {
      toast.error("Only 1 minute left. Please review and submit.");
    } else if (remainingSeconds === 30) {
      toast.error("30 seconds remaining.", { duration: 3000 });
    }
  }, [remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds !== 0 || hasAutoSubmittedRef.current || isSaving) {
      return;
    }

    hasAutoSubmittedRef.current = true;
    autoSubmit();
  }, [ currentTest, isSaving, remainingSeconds]);

  return (
    <div className="page-enter space-y-6">
      <section className="rounded-4xl border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(241,245,249,0.8)),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_28%)] p-1 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
          
          <div className="grid gap-3 sm:grid-cols-3 ">
            <div className="p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Subject</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{currentTest.subject}</p>
            </div>
            <div className="p-4">
              <p className="mt-2 text-lg font-semibold text-slate-950">{currentTest.title}</p>
            </div>
            <div className="p-4">
              <p className="text-xs uppercase items-right tracking-[0.24em] text-slate-500">Time Left</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">{formatTime(remainingSeconds)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-[65%_35%] gap-6">
        <div className="space-y-5 ">
          {currentQuestions.length > 0 && (
            <QuestionCard
              question={currentQuestions[currentQuestionIndex]}
              index={currentQuestionIndex}
              answeredValue={answersByQuestion[currentQuestions[currentQuestionIndex]._id]}
              isMarked={markedForReview[currentQuestions[currentQuestionIndex]._id]}
              onSelectAnswer={handleSelectAnswer}
              onAnswerTextChange={handleAnswerTextChange}
              onToggleReview={handleToggleReview}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 justify-between pt-4">
            <button
              type="button"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition duration-200",
                currentQuestionIndex === 0
                  ? "border-slate-200 bg-slate-50/95 text-slate-400 cursor-not-allowed dark:bg-slate-950/70"
                  : "border-slate-200 bg-slate-50/95 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 dark:bg-slate-950/75 dark:text-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === currentQuestions.length - 1}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition duration-200",
                currentQuestionIndex === currentQuestions.length - 1
                  ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50"
              )}
            >
              Next
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className={cn(surfaceClass, "p-6") }>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-950">Question Palette</h3>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Jump</span>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 xl:grid-cols-4">
                {currentQuestions.map((question, index) => {
                  const paletteStatus = getQuestionPaletteStatus(question);

                  return (
                    <button
                      key={question._id}
                      type="button"
                      onClick={() => handleJumpToQuestion(question._id)}
                      className={cn("rounded-2xl border px-3 py-3 text-center text-sm font-semibold transition duration-200 hover:-translate-y-0.5", paletteStatus.className)}
                      title={`Question ${index + 1}: ${paletteStatus.label}`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>


            {currentTest.negativeMarkingEnabled ? (
              <div className="mt-5 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Wrong MCQ answers deduct <span className="font-semibold">{currentTest.negativeMarkingValue}</span> marks.
              </div>
            ) : null}

            <div className="mt-2 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>Time progress</span>
                <span>{Math.min(Math.round((elapsedSeconds / (currentTest.duration * 60)) * 100), 100)}%</span>
              </div>
              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    remainingSeconds > 300 ? "bg-emerald-500" : remainingSeconds > 60 ? "bg-amber-500" : "bg-rose-500"
                  )}
                  style={{ width: `${Math.min((elapsedSeconds / (currentTest.duration * 60)) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="mt-2 grid gap-2 text-sm text-slate-700">
              <div className="flex items-center justify-between rounded-[1.25rem] bg-slate-50/80 px-4 py-3">
                <span className="flex items-center gap-2"><ClipboardList size={16} className="text-emerald-600" />Answered</span>
                <span className="font-semibold text-slate-950">{answeredCount}/{currentQuestions.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1.25rem] bg-fuchsia-50 px-4 py-3 text-fuchsia-900">
                <span className="flex items-center gap-2"><ListChecks size={16} className="text-fuchsia-700" />Marked</span>
                <span className="font-semibold">{markedCount}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isSaving || remainingSeconds === 0}
              className={`${primaryButtonClass} mt-6 w-full`}
            >
              <ArrowRight size={16} />
              {isSaving ? "Submitting..." : remainingSeconds === 0 ? "Auto-submitting..." : "Submit Test"}
            </button>

            <Link to="/student" className={`${secondaryButtonClass} mt-3 w-full`}>
              Exit to dashboard
            </Link>
          </div>
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(196,181,253,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#b1edff_40%,#f8fafc_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,139,252,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(94,97,183,0.12),transparent_24%),linear-gradient(180deg,#111827_0%,#0f172a_45%,#111827_100%)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-4xl border border-white/80 bg-white/80 px-6 py-12 text-sm text-slate-500 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
            Loading your test...
          </div>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(196,181,253,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#b1edff_40%,#f8fafc_100%)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <EmptyState
            icon={<AlertCircle size={24} />}
            title="Test unavailable"
            description="This test could not be loaded or may already have been submitted."
            action={
              <Link to="/student" className={primaryButtonClass}>
                Back to dashboard
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_right,rgba(196,181,253,0.12),transparent_22%),linear-gradient(180deg,#f8fbff_0%,#b1edff_40%,#f8fafc_100%)]">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <AttemptTestSession
          key={testId}
          testId={testId}
          currentTest={currentTest}
          currentQuestions={currentQuestions}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
