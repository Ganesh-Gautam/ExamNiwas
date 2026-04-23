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
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import AddQuestions from './pages/AddQuestions.jsx';
import TeacherRoute from './layouts/TeacherRoute.jsx';

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
            <AddQuestions />
          </TeacherRoute>
        )
      },
      
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
