import axios from "../../api/axios.js";

const createTest = async (data) => { 
  const response = await axios.post("/tests", data); 
  return response.data;
};

const addQuestions = async ({ testId, questions }) => {
  const response = await axios.post(`/tests/${testId}/questions`, { questions });
  return response.data;
};

const deleteQuestion = async ({ testId, questionId }) => {
  const response = await axios.delete(`/tests/${testId}/questions/${questionId}`);
  return response.data;
};

const updateQuestion = async ({ testId, questionId, questionData }) => {
  const response = await axios.put(`/tests/${testId}/questions/${questionId}`, questionData);
  return response.data;
};

const updateTest = async ({ testId, testData }) => {
  const response = await axios.put(`/tests/${testId}`, testData);
  return response.data;
};

const deleteTest = async ({ testId }) => {
  const response = await axios.delete(`/tests/${testId}`);
  return response.data;
};

const getTeacherTests = async () => {
  const response = await axios.get("/tests");
  return response.data;
};

export { createTest, addQuestions, deleteQuestion, updateQuestion, updateTest, deleteTest, getTeacherTests };
