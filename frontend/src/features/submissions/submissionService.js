import axios from "../../api/axios.js";

const getAvailableTests = async () => {
  const response = await axios.get("/students/tests");
  return response.data;
};

const getTestQuestions = async ({ testId }) => {
  const response = await axios.get(`/students/tests/${testId}/questions`);
  return response.data;
};

const submitAnswers = async ({ testId, answers, timeTaken }) => {
  const response = await axios.post(`/students/tests/${testId}/submit`, {
    answers,
    timeTaken,
  });
  return response.data;
};

const getStudentTestResult = async ({ testId}) => {
  const response = await axios.get(`/students/tests/${testId}/result`);
  return response.data;
};

const getStudentResults = async () => {
  const response = await axios.get("/students/tests/results");
  return response.data;
};

const getTeacherStudentResults = async () => {
  const response = await axios.get("/teachers/tests/results");
  return response.data;
};

const getSubmissionDetails = async ({ submissionId }) => {
  const response = await axios.get(`/students/submissions/${submissionId}`);
  return response.data;
};

export {
  getAvailableTests,
  getTestQuestions,
  submitAnswers,
  getStudentTestResult,
  getStudentResults,
  getTeacherStudentResults,
  getSubmissionDetails,
};
