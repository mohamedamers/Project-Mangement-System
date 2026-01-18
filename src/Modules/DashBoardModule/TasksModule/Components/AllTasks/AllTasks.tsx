import React from 'react'
import AllTasksMAnager from './AllTasksMAnager'
import AllTasksEmployee from './AllTasksEmployee'
import { useAuth } from "../../../../../Context/AuthContext";

export default function AllTasks() {
    const auth = useAuth();
    if (!auth) return null; // أو Loading / Error UI

  const { loginData, isLoading } = auth;

  if (isLoading) return <div>Loading...</div>;
  if (!loginData) return <div>Not logged in</div>;
  const role = loginData?.userGroup;
  return (
   <>


 {role === "Manager" && <AllTasksMAnager/>}
      {role === "Employee" && <AllTasksEmployee/>}

      {!role && <div>Please login</div>}
   </>
  )
}
