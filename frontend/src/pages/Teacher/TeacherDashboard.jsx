import { CalendarDays, ClipboardList, Clock3, Edit2, FileSpreadsheet, PenSquare, PlusCircle, Save, TimerReset, Trash2, X } from "../../lib/lucide-react.jsx";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createTeacherTest, deleteTeacherTest, fetchTeacherTests, updateTeacherTest } from "../../features/tests/testSlice.js";
import { extractApiErrorMessage } from "../../utils/apiError.js";
import { cn, EmptyState, PageHero, SectionCard, StatCard, inputClass, noticeClass, primaryButtonClass, secondaryButtonClass, pageWrapClass, surfaceClass } from "../../components/common/ui.jsx";

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, isLoading, isSaving } = useSelector((state) => state.tests);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    duration: 60,
    startTime: "",
    endTime: "",
    negativeMarkingEnabled: false,
    negativeMarkingValue: 0,
    randomizeQuestions: false,
  });
  const [editingTestId, setEditingTestId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    duration: 60,
    startTime: "",
    endTime: "",
    negativeMarkingEnabled: false,
    negativeMarkingValue: 0,
    randomizeQuestions: false,
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchTeacherTests());
  }, [dispatch]);

  const pendingTests = useMemo(
    () => items.filter((test) => new Date(test.endTime) > new Date()).length,
    [items]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openEditModal = (test) => {
    setEditingTestId(test._id);
    setEditForm({
      title: test.title,
      subject: test.subject,
      duration: test.duration,
      startTime: test.startTime.slice(0, 16),
      endTime: test.endTime.slice(0, 16),
      negativeMarkingEnabled: Boolean(test.negativeMarkingEnabled),
      negativeMarkingValue: test.negativeMarkingValue || 0,
      randomizeQuestions: Boolean(test.randomizeQuestions),
    });
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const closeEditModal = () => {
    setEditingTestId(null);
  };

  const handleEditFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateTest = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        updateTeacherTest({
          testId: editingTestId,
          testData: {
            title: editForm.title,
            subject: editForm.subject,
            duration: Number(editForm.duration),
            startTime: editForm.startTime,
            endTime: editForm.endTime,
            negativeMarkingEnabled: editForm.negativeMarkingEnabled,
            negativeMarkingValue: Number(editForm.negativeMarkingValue) || 0,
            randomizeQuestions: editForm.randomizeQuestions,
          },
        })
      ).unwrap();
      toast.success("Test updated successfully");
      closeEditModal();
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await dispatch(deleteTeacherTest({ testId })).unwrap();
      toast.success("Test deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await dispatch(createTeacherTest(form)).unwrap();
      toast.success("Test created. Add questions next.");
      setForm({
        title: "",
        subject: "",
        duration: 60,
        startTime: "",
        endTime: "",
        negativeMarkingEnabled: false,
        negativeMarkingValue: 0,
        randomizeQuestions: false,
      });
      navigate(`/teacher/tests/${response.data._id}/questions`);
    } catch (error) {
      toast.error(extractApiErrorMessage(error));
    }
  };

  return (
    <div className={`${pageWrapClass} page-enter`}>
      <PageHero
        eyebrow="Teacher Dashboard"
        title={`Welcome back, ${user?.fullName?.split(" ")[0] || "Teacher"}.`}
        description="Create the test, add questions, and keep track of every paper from one place."
        accent="amber"
        actions={
          <Link to="/teacher/tests/results" className={primaryButtonClass}>
            <FileSpreadsheet size={16} />
            Student results
          </Link>
        }
        stats={[
          <StatCard key="tests" label="Total Tests" value={items.length} hint="Everything created in your workspace." />, 
          <StatCard key="active" label="Active Windows" value={pendingTests} hint="Tests still running or upcoming." />,
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <SectionCard
          title="Create Test"
          description="A cleaner form for scheduling exams and setting rules."
        >
          <form onSubmit={handleSubmit} className="grid gap-5">
            <label>
              <span className="text-sm font-semibold text-slate-700">Test title</span>
              <input className={inputClass} name="title" value={form.title} onChange={handleChange} placeholder="Mid Term Physics Practice" required />
            </label>
            <label>
              <span className="text-sm font-semibold text-slate-700">Subject</span>
              <input className={inputClass} name="subject" value={form.subject} onChange={handleChange} placeholder="Physics" required />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label>
                <span className="text-sm font-semibold text-slate-700">Duration</span>
                <input className={inputClass} type="number" min="1" name="duration" value={form.duration} onChange={handleChange} required />
              </label>
              <label className="sm:col-span-2">
                <span className="text-sm font-semibold text-slate-700">Start time</span>
                <input className={inputClass} type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required />
              </label>
            </div>
            <label>
              <span className="text-sm font-semibold text-slate-700">End time</span>
              <input className={inputClass} type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} required />
            </label>
            <div className="rounded-3xl bg-amber-50/70 p-4 dark:bg-slate-600/70">
              <div className="grid gap-4">
                <label className="flex items-start gap-3">
                  <input type="checkbox" name="negativeMarkingEnabled" checked={form.negativeMarkingEnabled} onChange={handleChange} className="mt-1 h-4 w-4 accent-amber-600" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Enable negative marking</span>
                    <span className="block text-xs text-slate-500">Deduct marks for incorrect MCQ responses.</span>
                  </span>
                </label>
                <label>
                  <span className="text-sm font-semibold text-slate-700">Deduction per wrong answer</span>
                  <input className={inputClass} type="number" min="0" step="0.25" name="negativeMarkingValue" value={form.negativeMarkingValue} onChange={handleChange} disabled={!form.negativeMarkingEnabled} />
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" name="randomizeQuestions" checked={form.randomizeQuestions} onChange={handleChange} className="mt-1 h-4 w-4 accent-amber-600" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">Randomize question order</span>
                    <span className="block text-xs text-slate-500">Shuffle the order for each student attempt.</span>
                  </span>
                </label>
              </div>
            </div>
            <button type="submit" disabled={isSaving} className={`${primaryButtonClass} w-full`}>
              <PenSquare size={16} />
              {isSaving ? "Creating test..." : "Create test and add questions"}
            </button>
          </form>
        </SectionCard>

        <SectionCard
          title="Your Tests"
          description="Open any test, adjust its settings, or continue building the question set."
        >
          {isLoading ? (
            <div className={noticeClass}>
              Loading tests...
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No tests created yet"
              description="Create your first test from the form on the left and then continue into question authoring."
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {items.map((test) => (
                <article
                  key={test._id}
                  className={cn(surfaceClass, "p-5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.08)]")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">{test.subject}</p>
                      <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{test.title}</h3>
                    </div>
                    <span className="rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white dark:bg-slate-800/70">MCQ</span>
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2"><TimerReset size={16} className="text-amber-600" />{test.duration} minutes</div>
                    <div className="flex items-center gap-2"><ClipboardList size={16} className="text-amber-600" />{test.questionCount || 0} questions</div>
                    <div className="flex items-center gap-2"><Clock3 size={16} className="text-amber-600" />{test.totalMarks || 0} marks</div>
                    <div className="flex items-center gap-2"><CalendarDays size={16} className="text-amber-600" />{new Date(test.startTime).toLocaleString()}</div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                    <button onClick={() => openEditModal(test)} className={secondaryButtonClass} type="button">
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button onClick={() => setDeleteConfirmId(test._id)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100" type="button">
                      <Trash2 size={16} />
                      Delete
                    </button>
                    <Link to={`/teacher/tests/${test._id}/questions`} className={`${primaryButtonClass} flex-1 bg-amber-500 text-slate-950 hover:bg-amber-400`}>
                      <PlusCircle size={16} />
                      Add questions
                    </Link>
                  </div>

                  {deleteConfirmId === test._id ? (
                    <div className="mt-4 rounded-3xl border border-rose-200 bg-rose-50 p-4">
                      <p className="text-sm font-semibold text-rose-900">Delete this test?</p>
                      <p className="mt-1 text-xs text-rose-700">All questions in this test will also be removed.</p>
                      <div className="mt-3 flex gap-3">
                        <button onClick={() => handleDeleteTest(test._id)} disabled={isSaving} className="flex-1 rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60" type="button">
                          {isSaving ? "Deleting..." : "Delete"}
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} disabled={isSaving} className="flex-1 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60" type="button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      {editingTestId ? createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/55 px-3 py-2 sm:px-6 sm:py-8">
          <div className={cn(surfaceClass, "mx-auto w-full max-w-xl sm:max-w-2xl overflow-hidden rounded-4xl border border-white/70 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.16)] dark:border-slate-700/80 dark:bg-slate-950/95")}>
            <div className="flex min-h-96 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100dvh-4rem)] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-5 dark:border-slate-700/80">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Edit Test</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-slate-100">Update exam settings</h2>
                </div>
                <button onClick={closeEditModal} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800" type="button">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">
                <form onSubmit={handleUpdateTest} className="grid gap-5">
                  <label>
                    <span className="text-sm font-semibold text-slate-700">Test title</span>
                    <input className={inputClass} name="title" value={editForm.title} onChange={handleEditFormChange} required />
                  </label>
                  <label>
                    <span className="text-sm font-semibold text-slate-700">Subject</span>
                    <input className={inputClass} name="subject" value={editForm.subject} onChange={handleEditFormChange} required />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label>
                      <span className="text-sm font-semibold text-slate-700">Duration</span>
                      <input className={inputClass} type="number" min="1" name="duration" value={editForm.duration} onChange={handleEditFormChange} required />
                    </label>
                    <label className="sm:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Start time</span>
                      <input className={inputClass} type="datetime-local" name="startTime" value={editForm.startTime} onChange={handleEditFormChange} required />
                    </label>
                  </div>
                  <label>
                    <span className="text-sm font-semibold text-slate-700">End time</span>
                    <input className={inputClass} type="datetime-local" name="endTime" value={editForm.endTime} onChange={handleEditFormChange} required />
                  </label>
                  <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-4">
                    <div className="grid gap-4">
                      <label className="flex items-start gap-3">
                        <input type="checkbox" name="negativeMarkingEnabled" checked={editForm.negativeMarkingEnabled} onChange={handleEditFormChange} className="mt-1 h-4 w-4 accent-amber-600" />
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">Enable negative marking</span>
                          <span className="block text-xs text-slate-500">Deduct marks on incorrect MCQ responses.</span>
                        </span>
                      </label>
                      <label>
                        <span className="text-sm font-semibold text-slate-700">Deduction per wrong answer</span>
                        <input className={inputClass} type="number" min="0" step="0.25" name="negativeMarkingValue" value={editForm.negativeMarkingValue} onChange={handleEditFormChange} disabled={!editForm.negativeMarkingEnabled} />
                      </label>
                      <label className="flex items-start gap-3">
                        <input type="checkbox" name="randomizeQuestions" checked={editForm.randomizeQuestions} onChange={handleEditFormChange} className="mt-1 h-4 w-4 accent-amber-600" />
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">Randomize question order</span>
                          <span className="block text-xs text-slate-500">Shuffle sequence for student attempts.</span>
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 border-t border-slate-200/80 px-5 py-4 dark:border-slate-700/80 sm:px-6 sm:py-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button type="submit" disabled={isSaving} className={`${primaryButtonClass} w-full`}>
                        <Save size={16} />
                        {isSaving ? "Saving..." : "Save changes"}
                      </button>
                      <button type="button" onClick={closeEditModal} disabled={isSaving} className={`${secondaryButtonClass} w-full`}>
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>,document.body
      ) : null}
   
    </div>
  );
}
