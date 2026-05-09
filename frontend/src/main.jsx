import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import AuthLayout from './layouts/AuthLayout.jsx';
import { createBrowserRouter } from 'react-router-dom'
import './index.css'
import AppErrorBoundary from './components/common/AppErrorBoundary.jsx'; 
import AppBootstrap from './AppBootstrap.jsx';

import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import TeacherDashboard from './pages/Teacher/TeacherDashboard.jsx';
import AddQuestions from './pages/Teacher/AddQuestions.jsx';
import SubmissionReview from './pages/Teacher/SubmissionReview.jsx';
import TeacherRoute from './layouts/TeacherRoute.jsx';
import StudentDashboard from './pages/Student/StudentDashboard.jsx';
import StudentRoute from './layouts/StudentRoute.jsx';
import AttemptTest from './pages/Student/AttemptTest.jsx';
import TestResult from './pages/Student/TestResult.jsx';
import AllTestResult from './pages/Student/AllTestResult.jsx';
import AllStudentResult from './pages/Teacher/AllStudentResult.jsx';

const router = createBrowserRouter([
  {
    path : '/',
    element : <App/>,
    children : [
      {
        index : true,
        element : <Home/>
      },
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        )
      },
      {
        path: "teacher",
        element: (
          <TeacherRoute>
            <TeacherDashboard />
          </TeacherRoute>
        )
      },
      {
        path: "teacher/tests/:testId/questions",
        element: (
          <TeacherRoute>
            <AddQuestions/>
          </TeacherRoute>
        )
      },
      {
        path: "student",
        element: (
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        )
      },
      {
        path: "/student/tests/:testId/attempt",
        element: (
          <StudentRoute>
            <AttemptTest />
          </StudentRoute>
        )
      },
      {
        path: "/student/tests/:testId/result",
        element: (
          <StudentRoute>
            <TestResult />
          </StudentRoute>
        )
      },
      {
        path: "/student/tests/result",
        element: (
          <StudentRoute>
            <AllTestResult />
          </StudentRoute>
        )
      },
      {
        path: "/teacher/tests/results",
        element: (
          <TeacherRoute>
            <AllStudentResult />
          </TeacherRoute>
        )
      },
      {
        path: "/teacher/submissions/:submissionId",
        element: (
          <TeacherRoute>
            <SubmissionReview />
          </TeacherRoute>
        )
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <Provider store ={store}>
      <AppBootstrap router={router} />
    </Provider>
  </AppErrorBoundary>
)
