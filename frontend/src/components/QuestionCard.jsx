import { CircleHelp, ListChecks } from "../lib/lucide-react.jsx";
import { cn, shellClass } from "./common/ui.jsx";

export default function QuestionCard({
  question,
  index,
  answeredValue,
  isMarked,
  onSelectAnswer,
  onAnswerTextChange,
  onToggleReview,
}) {
  return (
    <article className={cn(shellClass, "p-6")}> 
      <div className="flex items-start gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <CircleHelp size={18} />
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-1xl font-semibold tracking-[-0.03em] text-slate-950">
                Question {index + 1}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {isMarked ? (
                <span className="rounded-full bg-fuchsia-100 px-3 py-1 text-xs font-semibold text-fuchsia-700">
                  Marked for review
                </span>
              ) : null}
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {question.marks} mark{question.marks > 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <p className="mt-1 text-base leading-7 text-slate-700">{question.question}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-3">
        {question.type === "written" ? (
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-700">Your answer</span>
            <textarea
              value={answeredValue?.answerText || ""}
              onChange={(event) => onAnswerTextChange(question._id, event.target.value)}
              className="min-h-44 resize-y rounded-3xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-300 focus:bg-white focus:shadow-[0_0_0_4px_rgba(16,185,129,0.12)]"
              placeholder="Write your answer here..."
            />
          </label>
        ) : (
          question.options.map((option, optionIndex) => {
            const isSelected = answeredValue?.selectedAnswer === option;

            return (
              <label
                key={`${question._id}-${optionIndex}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-3xl border px-2 py-2 text-sm transition duration-200",
                  isSelected
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900 shadow-[0_10px_30px_rgba(16,185,129,0.08)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/40"
                )}
              >
                <input
                  type="radio"
                  name={`question-${question._id}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => onSelectAnswer(question._id, option)}
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

      <div className="mt-3 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onToggleReview(question._id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition duration-200",
            isMarked
              ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-900 hover:bg-fuchsia-100"
              : "border-slate-200 bg-white text-slate-700 hover:border-fuchsia-200 hover:bg-fuchsia-50"
          )}
        >
          <ListChecks size={16} />
          {isMarked ? "Unmark review" : "Mark for review"}
        </button>
      </div>
    </article>
  );
}
