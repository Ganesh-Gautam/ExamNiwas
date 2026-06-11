import { CircleHelp, Edit3, ListChecks, Plus, Save, Trash2, X } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { addTestQuestions, fetchTeacherTests, removeTestQuestion, updateTestQuestion } from "../../features/tests/testSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";
import { cn, EmptyState, PageHero, SectionCard, StatCard, inputClass, pageWrapClass, primaryButtonClass, secondaryButtonClass, surfaceClass, textareaClass } from "../../components/common/ui.jsx";

const createEmptyQuestion = () => ({
  type: "mcq",
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  marks: 1,
});

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

  const selectedTest = useMemo(() => items.find((test) => test._id === testId), [items, testId]);
  const existingQuestions = selectedTest?.questions ?? [];

  const updateQuestion = (index, key, value) => {
    setQuestions((current) => current.map((question, questionIndex) => (questionIndex === index ? { ...question, [key]: value } : question)));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) =>
      current.map((question, currentIndex) =>
        currentIndex === questionIndex
          ? { ...question, options: question.options.map((option, currentOptionIndex) => (currentOptionIndex === optionIndex ? value : option)) }
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

  const validateQuestionShape = (question, questionLabel) => {
    if (!question.question?.trim()) {
      toast.error(`${questionLabel}: Question text is required`);
      return false;
    }

    if (question.type === "mcq") {
      const nonEmptyOptions = question.options.filter((option) => option.trim().length > 0);
      if (nonEmptyOptions.length < 2) {
        toast.error(`${questionLabel}: At least 2 non-empty options are required`);
        return false;
      }

      if (!question.correctAnswer?.trim()) {
        toast.error(`${questionLabel}: Please select a correct answer`);
        return false;
      }

      if (!question.options.some((option) => option.trim() === question.correctAnswer.trim())) {
        toast.error(`${questionLabel}: Correct answer must match one of the provided options`);
        return false;
      }
    }

    const marksNum = Number(question.marks);
    if (Number.isNaN(marksNum) || marksNum < 1) {
      toast.error(`${questionLabel}: Marks must be at least 1`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    for (let index = 0; index < questions.length; index += 1) {
      if (!validateQuestionShape(questions[index], `Question ${index + 1}`)) {
        return;
      }
    }

    try {
      const preparedQuestions = questions.map((question) => ({
        type: question.type,
        question: question.question.trim(),
        marks: Number(question.marks),
        options: question.type === "mcq" ? question.options : [],
        correctAnswer: question.type === "mcq" ? question.correctAnswer.trim() : undefined,
      }));

      await dispatch(addTestQuestions({ testId, questions: preparedQuestions })).unwrap();
      toast.success("Questions saved successfully");
      setQuestions([createEmptyQuestion()]);
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const handleRemoveExistingQuestion = async (questionId) => {
    try {
      await dispatch(removeTestQuestion({ testId, questionId })).unwrap();
      toast.success("Question removed successfully");
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
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
    if (!editingQuestion || !validateQuestionShape(editingQuestion, "Edited question")) {
      return;
    }

    try {
      const questionData = {
        type: editingQuestion.type,
        question: editingQuestion.question.trim(),
        marks: Number(editingQuestion.marks),
        options: editingQuestion.type === "mcq" ? editingQuestion.options : [],
        correctAnswer: editingQuestion.type === "mcq" ? editingQuestion.correctAnswer.trim() : undefined,
      };

      await dispatch(updateTestQuestion({ testId, questionId: editingQuestionId, questionData })).unwrap();
      toast.success("Question updated successfully");
      handleCancelEdit();
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const updateEditingQuestion = (key, value) => {
    setEditingQuestion((current) => ({ ...current, [key]: value }));
  };

  const updateEditingOption = (optionIndex, value) => {
    setEditingQuestion((current) => ({
      ...current,
      options: current.options.map((option, index) => (index === optionIndex ? value : option)),
    }));
  };

  return (
    <div className={`${pageWrapClass} page-enter`}>
      <PageHero
        eyebrow="Question Builder"
        title={selectedTest ? selectedTest.title : "Question authoring workspace"}
        description="Create polished MCQ and written question blocks, manage saved items, and keep the authoring flow focused."
        accent="emerald"
        actions={<Link to="/teacher" className={secondaryButtonClass}>Back to dashboard</Link>}
        stats={[
          <StatCard key="subject" label="Subject" value={selectedTest?.subject || "Loading"} hint="Current test context." />,
          <StatCard key="duration" label="Duration" value={selectedTest ? `${selectedTest.duration} min` : "--"} hint="Exam window length." />,
          <StatCard key="saved" label="Saved Questions" value={existingQuestions.length} hint="Already attached to this test." />,
        ]}
      />

      <SectionCard title="Saved Questions" description="Previously added questions are editable here so you can refine the paper without leaving the page.">
        {isLoading && !selectedTest ? (
          <div className={noticeClass}>
            Loading saved questions...
          </div>
        ) : existingQuestions.length === 0 ? (
          <EmptyState title="No saved questions yet" description="Use the composer below to add the first questions to this test." />
        ) : (
          <div className="space-y-4">
            {existingQuestions.map((question, questionIndex) => {
              const isEditing = editingQuestionId === question._id;

              return (
                <article key={question._id} className={cn(surfaceClass, "p-5") }>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-slate-950">Editing Question {questionIndex + 1}</h3>
                          <p className="text-sm text-slate-500">Update the question details below.</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={handleCancelEdit} className={secondaryButtonClass}>
                            <X size={16} />
                            Cancel
                          </button>
                          <button type="button" onClick={handleUpdateExistingQuestion} disabled={isSaving} className={primaryButtonClass}>
                            <Save size={16} />
                            Save changes
                          </button>
                        </div>
                      </div>

                      <label>
                        <span className="text-sm font-semibold text-slate-700">Question statement</span>
                        <textarea className={textareaClass} value={editingQuestion.question} onChange={(event) => updateEditingQuestion("question", event.target.value)} required />
                      </label>

                      {editingQuestion.type === "mcq" ? (
                        <>
                          <div className="grid gap-4 md:grid-cols-2">
                            {editingQuestion.options.map((option, optionIndex) => (
                              <label key={`edit-${question._id}-${optionIndex}`}>
                                <span className="text-sm font-semibold text-slate-700">Option {optionIndex + 1}</span>
                                <input className={inputClass} value={option} onChange={(event) => updateEditingOption(optionIndex, event.target.value)} required />
                              </label>
                            ))}
                          </div>
                          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
                            <label>
                              <span className="text-sm font-semibold text-slate-700">Correct answer</span>
                              <select className={inputClass} value={editingQuestion.correctAnswer} onChange={(event) => updateEditingQuestion("correctAnswer", event.target.value)} required>
                                <option value="">Select correct answer</option>
                                {editingQuestion.options.map((option, optionIndex) => (
                                  <option key={`correct-${question._id}-${optionIndex}`} value={option}>
                                    {option || `Option ${optionIndex + 1}`}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label>
                              <span className="text-sm font-semibold text-slate-700">Marks</span>
                              <input className={inputClass} type="number" min="1" value={editingQuestion.marks} onChange={(event) => updateEditingQuestion("marks", event.target.value)} required />
                            </label>
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-950">Saved Question {questionIndex + 1}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{question.question}</p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => handleEditExistingQuestion(question)} disabled={isSaving} className={secondaryButtonClass}>
                            <Edit3 size={16} />
                            Edit
                          </button>
                          <button type="button" onClick={() => handleRemoveExistingQuestion(question._id)} disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60">
                            <Trash2 size={16} />
                            Remove
                          </button>
                        </div>
                      </div>

                      {question.type === "mcq" ? (
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {question.options?.map((option, optionIndex) => {
                            const isCorrect = option === question.correctAnswer;
                            return (
                              <div key={`${question._id}-${optionIndex}`} className={cn("rounded-[1.25rem] border px-4 py-3 text-sm", isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50/80 text-slate-700 dark:bg-slate-950/80") }>
                                <span className="font-semibold">Option {optionIndex + 1}:</span> {option}
                                {isCorrect ? " (Correct)" : ""}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-5 rounded-3xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          Written response question. This will be graded manually.
                        </div>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                        <div className="rounded-full bg-slate-50 px-4 py-2 dark:bg-slate-950/78">Marks: {question.marks}</div>
                        {question.correctAnswer ? <div className="rounded-full bg-slate-50 px-4 py-2 dark:bg-slate-950/78">Correct answer: {question.correctAnswer}</div> : null}
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Compose New Questions" description="Use dynamic blocks to add MCQ or written items and then save them to the test in one action.">
        <form onSubmit={handleSubmit} className="space-y-5">
          {questions.map((question, questionIndex) => (
            <section key={`question-${questionIndex}`} className={cn(surfaceClass, "p-6 shadow-[0_16px_40px_rgba(15,23,42,0.04)]")}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <CircleHelp size={18} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">Question {questionIndex + 1}</h2>
                    <p className="text-sm text-slate-500">{question.type === "mcq" ? "MCQ block" : "Written block"}</p>
                  </div>
                </div>
                <button type="button" onClick={() => removeQuestionCard(questionIndex)} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100">
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
                <label>
                  <span className="text-sm font-semibold text-slate-700">Question type</span>
                  <select className={inputClass} value={question.type} onChange={(event) => updateQuestion(questionIndex, "type", event.target.value)}>
                    <option value="mcq">MCQ</option>
                    <option value="written">Written</option>
                  </select>
                </label>
                <label>
                  <span className="text-sm font-semibold text-slate-700">Marks</span>
                  <input className={inputClass} type="number" min="1" value={question.marks} onChange={(event) => updateQuestion(questionIndex, "marks", event.target.value)} required />
                </label>
              </div>

              <label className="mt-5 block">
                <span className="text-sm font-semibold text-slate-700">Question statement</span>
                <textarea className={textareaClass} value={question.question} onChange={(event) => updateQuestion(questionIndex, "question", event.target.value)} required />
              </label>

              {question.type === "mcq" ? (
                <>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {question.options.map((option, optionIndex) => (
                      <label key={`option-${questionIndex}-${optionIndex}`}>
                        <span className="text-sm font-semibold text-slate-700">Option {optionIndex + 1}</span>
                        <input className={inputClass} value={option} onChange={(event) => updateOption(questionIndex, optionIndex, event.target.value)} required />
                      </label>
                    ))}
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-[1fr_180px]">
                    <label>
                      <span className="text-sm font-semibold text-slate-700">Correct answer</span>
                      <select className={inputClass} value={question.correctAnswer} onChange={(event) => updateQuestion(questionIndex, "correctAnswer", event.target.value)} required>
                        <option value="">Select correct answer</option>
                        {question.options.map((option, optionIndex) => (
                          <option key={`correct-${questionIndex}-${optionIndex}`} value={option}>
                            {option || `Option ${optionIndex + 1}`}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      Select the correct option once the answers are filled in.
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-3xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Written questions collect free-text responses and are graded manually by a teacher.
                </div>
              )}
            </section>
          ))}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={addQuestionCard} className={secondaryButtonClass}>
              <Plus size={16} />
              Add another question
            </button>
            <button type="submit" disabled={isSaving} className={primaryButtonClass}>
              <ListChecks size={16} />
              {isSaving ? "Saving questions..." : "Save all questions"}
            </button>
          </div>
        </form>
      </SectionCard>
    </div>
  );
}
