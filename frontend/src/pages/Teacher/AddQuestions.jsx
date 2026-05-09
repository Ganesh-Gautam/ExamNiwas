import { CircleHelp, ListChecks, Plus, Trash2, Edit3, Save, X } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addTestQuestions, fetchTeacherTests, removeTestQuestion, updateTestQuestion } from "../../features/tests/testSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";

const createEmptyQuestion = () => ({
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
});

const inputClass =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-400";

export default function AddQuestions() {
  const { testId } = useParams();
  const dispatch = useDispatch();
  const { items, isLoading, isSaving } = useSelector((state) => state.tests);
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    dispatch(fetchTeacherTests());
  }, [dispatch]);

  const selectedTest = useMemo(
    () => items.find((test) => test._id === testId),
    [items, testId]
  );
  const existingQuestions = selectedTest?.questions ?? [];

  const updateQuestion = (index, key, value) => {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [key]: value } : question
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) =>
      current.map((question, currentIndex) =>
        currentIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, currentOptionIndex) =>
                currentOptionIndex === optionIndex ? value : option
              ),
            }
          : question
      )
    );
  };

  const addQuestionCard = () => {
    setQuestions((current) => [...current, createEmptyQuestion()]);
  };

  const removeQuestionCard = (index) => {
    setQuestions((current) => (current.length === 1 ? current : current.filter((_, itemIndex) => itemIndex !== index)));
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question?.trim()) {
        toast.error(`Question ${i + 1}: Question text is required`);
        return false;
      }

      if (q.type === "mcq") {
        const nonEmptyOptions = q.options.filter((opt) => opt.trim().length > 0);
        if (nonEmptyOptions.length < 2) {
          toast.error(`Question ${i + 1}: At least 2 non-empty options are required`);
          return false;
        }

        if (!q.correctAnswer?.trim()) {
          toast.error(`Question ${i + 1}: Please select a correct answer`);
          return false;
        }

        if (!q.options.some((opt) => opt.trim() === q.correctAnswer.trim())) {
          toast.error(
            `Question ${i + 1}: Correct answer must match one of the provided options`
          );
          return false;
        }
      }

      const marksNum = Number(q.marks);
      if (isNaN(marksNum) || marksNum < 1) {
        toast.error(`Question ${i + 1}: Marks must be at least 1`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateQuestions()) {
      return;
    }

    try {
      const preparedQuestions = questions.map((question) => ({
        type: question.type,
        question: question.question?.trim(),
        marks: Number(question.marks),
        options: question.type === "mcq" ? question.options : [],
        correctAnswer: question.type === "mcq" ? question.correctAnswer?.trim() : undefined,
      }));

      await dispatch(addTestQuestions({ testId, questions: preparedQuestions })).unwrap();
      toast.success("Questions saved to the database");
      setQuestions([createEmptyQuestion()]);
    } catch (error) {
      const message = extractApiErrorMessage(error);
      toast.error(message);
    }
  };

  const handleRemoveExistingQuestion = async (questionId) => {
    try {
      await dispatch(removeTestQuestion({ testId, questionId })).unwrap();
      toast.success("Question removed successfully");
    } catch (error) {
      const message = extractApiErrorMessage(error);
      toast.error(message);
    }
  };

  const handleEditExistingQuestion = (question) => {
    setEditingQuestionId(question._id);
    setEditingQuestion({
      type: question.type || "mcq",
      question: question.question,
      options: question.options ? [...question.options] : ["", "", "", ""],
      correctAnswer: question.correctAnswer,
      marks: question.marks,
    });
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditingQuestion(null);
  };

  const handleUpdateExistingQuestion = async () => {
    if (!editingQuestion) return;

    // Validate
    if (!editingQuestion.question?.trim()) {
      toast.error("Question text is required");
      return;
    }

    if (editingQuestion.type === "mcq") {
      const nonEmptyOptions = editingQuestion.options.filter((opt) => opt.trim().length > 0);
      if (nonEmptyOptions.length < 2) {
        toast.error("At least 2 non-empty options are required");
        return;
      }
      if (!editingQuestion.correctAnswer?.trim()) {
        toast.error("Please select a correct answer");
        return;
      }
      if (!editingQuestion.options.some((opt) => opt.trim() === editingQuestion.correctAnswer.trim())) {
        toast.error("Correct answer must match one of the provided options");
        return;
      }
    }

    const marksNum = Number(editingQuestion.marks);
    if (isNaN(marksNum) || marksNum < 1) {
      toast.error("Marks must be at least 1");
      return;
    }

    try {
      const questionData = {
        type: editingQuestion.type,
        question: editingQuestion.question?.trim(),
        marks: Number(editingQuestion.marks),
        options: editingQuestion.type === "mcq" ? editingQuestion.options : [],
        correctAnswer: editingQuestion.type === "mcq" ? editingQuestion.correctAnswer?.trim() : undefined,
      };

      await dispatch(updateTestQuestion({
        testId,
        questionId: editingQuestionId,
        questionData,
      })).unwrap();
      toast.success("Question updated successfully");
      setEditingQuestionId(null);
      setEditingQuestion(null);
    } catch (error) {
      const message = extractApiErrorMessage(error);
      toast.error(message);
    }
  };

  const updateEditingQuestion = (key, value) => {
    setEditingQuestion((current) => ({ ...current, [key]: value }));
  };

  const updateEditingOption = (optionIndex, value) => {
    setEditingQuestion((current) => ({
      ...current,
      options: current.options.map((option, index) => index === optionIndex ? value : option),
    }));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-4xl border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(236,253,245,0.98),rgba(240,253,250,0.92)),radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_28%)] p-8 shadow-[0_24px_70px_rgba(15,118,110,0.1)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Add Questions</p>
            <h1 className="mt-3 font-['Georgia'] text-4xl font-bold text-zinc-950">
              {selectedTest ? selectedTest.title : "MCQ Test Builder"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
              Add MCQ questions with answer options, marks, and the correct answer for each one.
            </p>
          </div>

          <Link
            to="/teacher"
            className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-950"
          >
            Back to dashboard
          </Link>
        </div>

        {selectedTest ? (
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-700">
            <div className="rounded-full bg-white/80 px-4 py-2">{selectedTest.subject}</div>
            <div className="rounded-full bg-white/80 px-4 py-2">{selectedTest.duration} min</div>
            <div className="rounded-full bg-white/80 px-4 py-2">{selectedTest.questionCount || 0} existing questions</div>
          </div>
        ) : isLoading ? (
          <p className="mt-6 text-sm text-zinc-500">Loading test details...</p>
        ) : (
          <p className="mt-6 text-sm text-amber-700">
            Test details are not loaded yet, but you can still submit questions to this test id.
          </p>
        )}
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Previously added questions</h2>
            <p className="text-sm text-zinc-500">Every saved question for this test appears here, and you can edit or remove any one of them.</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {existingQuestions.length} saved
          </div>
        </div>

        {isLoading && !selectedTest ? (
          <p className="mt-6 text-sm text-zinc-500">Loading saved questions...</p>
        ) : existingQuestions.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
            No saved questions yet for this test.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {existingQuestions.map((question, questionIndex) => {
              const isEditing = editingQuestionId === question._id;

              return (
                <article
                  key={question._id}
                  className="rounded-3xl border border-zinc-200 bg-zinc-50/80 p-5"
                >
                  {isEditing ? (
                    // Edit mode
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                            <Edit3 size={18} />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-zinc-950">Editing Question {questionIndex + 1}</h3>
                            <p className="text-sm text-zinc-500">Update the question details below</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleUpdateExistingQuestion}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Save size={16} />
                            Save changes
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <label>
                          <span className="text-sm font-semibold text-zinc-700">Question statement</span>
                          <textarea
                            className={inputClass}
                            value={editingQuestion.question}
                            onChange={(event) => updateEditingQuestion("question", event.target.value)}
                            placeholder="What is the SI unit of force?"
                            required
                          />
                        </label>

                        <div className="grid gap-4 md:grid-cols-2">
                          {editingQuestion.options.map((option, optionIndex) => (
                            <label key={`edit-option-${questionIndex}-${optionIndex}`}>
                              <span className="text-sm font-semibold text-zinc-700">Option {optionIndex + 1}</span>
                              <input
                                className={inputClass}
                                value={option}
                                onChange={(event) => updateEditingOption(optionIndex, event.target.value)}
                                placeholder={`Enter option ${optionIndex + 1}`}
                                required
                              />
                            </label>
                          ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                          <label>
                            <span className="text-sm font-semibold text-zinc-700">Correct answer</span>
                            <select
                              className={inputClass}
                              value={editingQuestion.correctAnswer}
                              onChange={(event) => updateEditingQuestion("correctAnswer", event.target.value)}
                              required
                            >
                              <option value="">Select correct answer</option>
                              {editingQuestion.options.map((option, optionIndex) => (
                                <option key={`edit-correct-${questionIndex}-${optionIndex}`} value={option}>
                                  {option || `Option ${optionIndex + 1}`}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label>
                            <span className="text-sm font-semibold text-zinc-700">Marks</span>
                            <input
                              className={inputClass}
                              type="number"
                              min="1"
                              value={editingQuestion.marks}
                              onChange={(event) => updateEditingQuestion("marks", event.target.value)}
                              required
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-black text-zinc-950">Saved Question {questionIndex + 1}</h3>
                          <p className="mt-2 text-sm leading-6 text-zinc-700">{question.question}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditExistingQuestion(question)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 self-start rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Edit3 size={16} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingQuestion(question._id)}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 self-start rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {question.options?.map((option, optionIndex) => {
                          const isCorrect = option === question.correctAnswer;

                          return (
                            <div
                              key={`${question._id}-option-${optionIndex}`}
                              className={`rounded-2xl border px-4 py-3 text-sm ${
                                isCorrect
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                  : "border-zinc-200 bg-white text-zinc-700"
                              }`}
                            >
                              <span className="font-semibold">Option {optionIndex + 1}:</span> {option}
                              {isCorrect ? " (Correct)" : ""}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-600">
                        <div className="rounded-full bg-white px-4 py-2">Marks: {question.marks}</div>
                        <div className="rounded-full bg-white px-4 py-2">Correct answer: {question.correctAnswer}</div>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <form onSubmit={handleSubmit} className="space-y-5">
        {questions.map((question, questionIndex) => (
          <section
            key={`question-${questionIndex}`}
            className="rounded-4xl border border-white/80 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <CircleHelp size={18} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-zinc-950">Question {questionIndex + 1}</h2>
                  <p className="text-sm text-zinc-500">
                    {question.type === "mcq" ? "MCQ Question" : "Written Question"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeQuestionCard(questionIndex)}
                className="inline-flex items-center gap-2 self-start rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
              <label>
                <span className="text-sm font-semibold text-zinc-700">Question type</span>
                <select
                  className={inputClass}
                  value={question.type}
                  onChange={(event) => updateQuestion(questionIndex, "type", event.target.value)}
                >
                  <option value="mcq">MCQ</option>
                  <option value="written">Written</option>
                </select>
              </label>

              <label>
                <span className="text-sm font-semibold text-zinc-700">Marks</span>
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  value={question.marks}
                  onChange={(event) => updateQuestion(questionIndex, "marks", event.target.value)}
                  required
                />
              </label>
            </div>

            <div className="mt-6 grid gap-5">
              <label>
                <span className="text-sm font-semibold text-zinc-700">Question statement</span>
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={question.question}
                  onChange={(event) => updateQuestion(questionIndex, "question", event.target.value)}
                  placeholder="What is the SI unit of force?"
                  required
                />
              </label>

              {question.type === "mcq" ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={`option-${questionIndex}-${optionIndex}`}>
                        <span className="text-sm font-semibold text-zinc-700">Option {optionIndex + 1}</span>
                        <input
                          className={inputClass}
                          value={option}
                          onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)}
                          placeholder={`Enter option ${optionIndex + 1}`}
                          required
                        />
                      </label>
                    ))}
                  </div>

                  <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                    <label>
                      <span className="text-sm font-semibold text-zinc-700">Correct answer</span>
                      <select
                        className={inputClass}
                        value={question.correctAnswer}
                        onChange={(event) => updateQuestion(questionIndex, "correctAnswer", event.target.value)}
                        required
                      >
                        <option value="">Select correct answer</option>
                        {question.options.map((option, optionIndex) => (
                          <option key={`correct-${questionIndex}-${optionIndex}`} value={option}>
                            {option || `Option ${optionIndex + 1}`}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      <span className="text-sm font-semibold text-zinc-700">Marks</span>
                      <input
                        className={inputClass}
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(event) => updateQuestion(questionIndex, "marks", event.target.value)}
                        required
                      />
                    </label>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                  This is a written question. Students will submit a free-text answer and it will be graded manually by a teacher.
                </div>
              )}
            </div>
          </section>
        ))}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={addQuestionCard}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={16} />
            Add another question
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ListChecks size={16} />
            {isSaving ? "Saving questions..." : "Save all questions"}
          </button>
        </div>
      </form>
    </div>
  );
}
