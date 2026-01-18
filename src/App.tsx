import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthLayout from "./SharedComponents/Components/AuthLayout/AuthLayout";
import MasterLayout from "./SharedComponents/Components/MasterLayout/MasterLayout";
import NotFound from "./SharedComponents/Components/NotFound/NotFound";

import Welcome from "./Modules/AuthModule/Components/Welcome/Welcome";
import Login from "./Modules/AuthModule/Components/Login/Login";

import VerifyAccount from "./Modules/AuthModule/Components/VerifyAccount/VerifyAccount";

import DashBoard from "./Modules/DashBoardModule/Components/DashBoard/DashBoard";
import ForgetPassword from "./Modules/AuthModule/Components/ForgetPassword/ForgetPassword";
import ChangePassword from "./Modules/AuthModule/Components/ChangePassword/ChangePassword";
import ResetPassord from "./Modules/AuthModule/Components/ResetPassword/ResetPassord";
import CreateNewAccount from "./Modules/AuthModule/Components/CreateNewAccount/CreateNewAccount";
import ProtectedRoute from "./Context/ProtectedRoute";
import ProjectsSystem from "./Modules/DashBoardModule/ProjectsModule/Components/ProjectsSystem/ProjectsSystem";
import AllProjects from "./Modules/DashBoardModule/ProjectsModule/Components/AllProjects/AllProjects";
import ProjectForm from "./Modules/DashBoardModule/ProjectsModule/Components/ProjectForm/ProjectForm";
import Users from "./Modules/DashBoardModule/UsersModule/Components/Users/Users";
import Profile from "./Modules/DashBoardModule/Components/Profile/Profile";
import AllTasks from "./Modules/DashBoardModule/TasksModule/Components/AllTasks/AllTasks";
import TaskForm from "./Modules/DashBoardModule/TasksModule/Components/TaskForm/TaskForm";
import TaskDetails from "./Modules/DashBoardModule/TasksModule/Components/TaskDetails/TaskDetails";
import MyTasks from "./Modules/DashBoardModule/TasksModule/Components/MyTasks/MyTasks";
import ThemeProvider from "./ThemeProvider";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Welcome />,
      errorElement: <NotFound />,
    },

    {
      path: "/auth",
      element: <AuthLayout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "createaccount", element: <CreateNewAccount /> },
        { path: "forget-password", element: <ForgetPassword /> },

        { path: "reset-password", element: <ResetPassord /> },
        { path: "verify-account", element: <VerifyAccount /> },
      ],
    },

    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <MasterLayout />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <DashBoard /> },
        { path: "dashboard", element: <DashBoard /> },

        // Manager routes
       { 
  path: "projects-system",
  element: (
    <ProtectedRoute allowedRoles={["Manager"]}>
      <ProjectsSystem />
    </ProtectedRoute>
  )
},
        { path: "projects-manage", element: <AllProjects /> },
        { path: "projects/add", element:
          (
    <ProtectedRoute allowedRoles={["Manager"]}>
           <ProjectForm />
   </ProtectedRoute>) },
        { path: "projects/edit/:id", element: 
         (
    <ProtectedRoute allowedRoles={["Manager"]}>
        <ProjectForm /> 
        </ProtectedRoute>)
      
      },
        { path: "tasks", element: <AllTasks /> },
        { path: "tasks/add", 

          
          element: 
              (
    <ProtectedRoute allowedRoles={["Manager"]}>
          <TaskForm /> 
          </ProtectedRoute>)

        
        },
        { path: "tasks/edit/:id", element: 
                (
    <ProtectedRoute allowedRoles={["Manager"]}>
          <TaskForm /> 
          </ProtectedRoute>)
      },
        { path: "tasks/:id", element: <TaskDetails /> },
        { path: "users", element:           (
    <ProtectedRoute allowedRoles={["Manager"]}>
          <Users /> 
          </ProtectedRoute>) },
        { path: "change-password", element: <ChangePassword /> },

        { path: "profile", element: <Profile /> },

        // Employee routes

        { path: "my-tasks", element: <MyTasks /> },
      ],
    },
  ]);

return (
    
      <RouterProvider router={routes} />
  
  );
}

export default App;
