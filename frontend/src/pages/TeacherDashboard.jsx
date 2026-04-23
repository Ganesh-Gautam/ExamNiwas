import { CalendarDays, Clock3, ClipboardList, PenSquare, PlusCircle, TimerReset, Edit2, Trash2, X, Save } from "../lib/lucide-react.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createTeacherTest, fetchTeacherTests, updateTeacherTest, deleteTeacherTest } from "../features/tests/testSlice.js";
import { extractApiErrorMessage } from "../utils/apiError.js";

const inputClass =
  "mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-400";

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
  });
  const [editingTestId, setEditingTestId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    duration: 60,
    startTime: "",
    endTime: "",
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    dispatch(fetchTeacherTests());
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const openEditModal = (test) => {
    setEditingTestId(test._id);
    setEditForm({
      title: test.title,
      subject: test.subject,
      duration: test.duration,
      startTime: test.startTime.slice(0, 16),
      endTime: test.endTime.slice(0, 16),
    });
  };

  const closeEditModal = () => {
    setEditingTestId(null);
    setEditForm({
      title: "",
      subject: "",
      duration: 60,
      startTime: "",
      endTime: "",
    });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
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
          },
        })
      ).unwrap();
      toast.success("Test updated successfully");
      closeEditModal();
    } catch (error) {
      const message = extractApiErrorMessage(error);
      toast.error(message);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await dispatch(deleteTeacherTest({ testId })).unwrap();
      toast.success("Test deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      const message = extractApiErrorMessage(error);
      toast.error(message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await dispatch(createTeacherTest(form)).unwrap();
      toast.success("Test created. Add MCQ questions next.");
      setForm({
        title: "",
        subject: "",
        duration: 60,
        startTime: "",
        endTime: "",
      });
      navigate(`/teacher/tests/${response.data._id}/questions`);
    } catch (error) {
      const message = extractApiErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-4xl border border-amber-200/80 bg-[linear-gradient(135deg,rgba(255,251,235,0.95),rgba(255,237,213,0.95)),radial-gradient(circle_at_top_right,rgba(251,191,36,0.25),transparent_32%)] p-8 shadow-[0_30px_90px_rgba(120,53,15,0.12)]">
        <div className="absolute -right-12 top-8 h-40 w-40 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Teacher Dashboard</p>
            <h1 className="mt-4 max-w-xl font-['Georgia'] text-4xl font-bold leading-tight text-zinc-950 sm:text-5xl">
              Create and manage your tests with ease.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700">
              Welcome back, {user?.fullName || "Teacher"}. Create the test, add questions, and keep track of every paper from one place.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
                <p className="text-sm text-zinc-500">Your tests</p>
                <p className="mt-2 text-3xl font-black text-zinc-950">{items.length}</p>
              </div>
              <div className="rounded-3xl border border-white/80 bg-white/70 p-4">
                <p className="text-sm text-zinc-500">Total questions</p>
                <p className="mt-2 text-3xl font-black text-zinc-950">
                  {items.reduce((sum, test) => sum + (test.questionCount || 0), 0)}
                </p>
              </div> 
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-4xl border border-white/80 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.1)] backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <PlusCircle size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-zinc-950">Create Test</h2>
                <p className="text-sm text-zinc-500">MCQ first, fast and teacher-friendly.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <label>
                <span className="text-sm font-semibold text-zinc-700">Test title</span>
                <input
                  className={inputClass}
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Mid Term Physics Practice"
                  required
                />
              </label>

              <label>
                <span className="text-sm font-semibold text-zinc-700">Subject</span>
                <input
                  className={inputClass}
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Physics"
                  required
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-3">
                <label>
                  <span className="text-sm font-semibold text-zinc-700">Duration (mins)</span>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-zinc-700">Start time</span>
                  <input
                    className={inputClass}
                    type="datetime-local"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <label>
                <span className="text-sm font-semibold text-zinc-700">End time</span>
                <input
                  className={inputClass}
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <PenSquare size={16} />
              {isSaving ? "Creating test..." : "Create test and add questions"}
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-4xl border border-white/80 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Your Tests</h2>
            <p className="text-sm text-zinc-500">Open any test and continue adding MCQ questions.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
            Loading tests...
          </div>
        ) : items.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-sm text-zinc-500">
            No tests yet. Create your first MCQ test from the form above.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {items.map((test) => (
              <article
                key={test._id}
                className="rounded-[1.75rem] border border-zinc-200 bg-[linear-gradient(180deg,#fffdf8_0%,#ffffff_100%)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">{test.subject}</p>
                    <h3 className="mt-2 text-2xl font-black text-zinc-950">{test.title}</h3>
                  </div>
                  <div className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                    MCQ
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <TimerReset size={16} className="text-amber-600" />
                    {test.duration} minutes
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardList size={16} className="text-amber-600" />
                    {test.questionCount || 0} questions
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={16} className="text-amber-600" />
                    {test.totalMarks || 0} marks
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-amber-600" />
                    {new Date(test.startTime).toLocaleString()}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                  <p className="text-sm text-zinc-500">Ends {new Date(test.endTime).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(test)}
                      className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-200"
                      title="Edit test"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(test._id)}
                      className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-200"
                      title="Delete test"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link
                      to={`/teacher/tests/${test._id}/questions`}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
                    >
                      <PlusCircle size={16} />
                      Add questions
                    </Link>
                  </div>
                </div>

                {deleteConfirmId === test._id && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-semibold text-red-900">Delete this test?</p>
                    <p className="mt-1 text-xs text-red-700">All questions in this test will be permanently removed.</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleDeleteTest(test._id)}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
                      >
                        {isSaving ? "Deleting..." : "Delete"}
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        disabled={isSaving}
                        className="flex-1 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300 disabled:opacity-70"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {editingTestId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-zinc-950">Edit Test</h2>
                <button
                  onClick={closeEditModal}
                  className="rounded-full p-2 text-zinc-500 transition hover:bg-zinc-100"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateTest} className="mt-6 space-y-5">
                <label>
                  <span className="text-sm font-semibold text-zinc-700">Test title</span>
                  <input
                    className={inputClass}
                    name="title"
                    value={editForm.title}
                    onChange={handleEditFormChange}
                    placeholder="Mid Term Physics Practice"
                    required
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-zinc-700">Subject</span>
                  <input
                    className={inputClass}
                    name="subject"
                    value={editForm.subject}
                    onChange={handleEditFormChange}
                    placeholder="Physics"
                    required
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-3">
                  <label>
                    <span className="text-sm font-semibold text-zinc-700">Duration (mins)</span>
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      name="duration"
                      value={editForm.duration}
                      onChange={handleEditFormChange}
                      required
                    />
                  </label>

                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-zinc-700">Start time</span>
                    <input
                      className={inputClass}
                      type="datetime-local"
                      name="startTime"
                      value={editForm.startTime}
                      onChange={handleEditFormChange}
                      required
                    />
                  </label>
                </div>

                <label>
                  <span className="text-sm font-semibold text-zinc-700">End time</span>
                  <input
                    className={inputClass}
                    type="datetime-local"
                    name="endTime"
                    value={editForm.endTime}
                    onChange={handleEditFormChange}
                    required
                  />
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-200 px-5 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
