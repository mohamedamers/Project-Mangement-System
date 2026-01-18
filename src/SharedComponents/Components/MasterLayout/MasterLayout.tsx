import NavBar from "../NavBar/NavBar";
import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar/Sidebar";
import { useMode } from "../../../Context/ModeContext";

export default function MasterLayout() {
    const { darkMode } = useMode();

  return (
    <>
      <div className="d-flex vh-100 overflow-hidden">
        <div className="flex-shrink-0">
          <Sidebar />
        </div>

        <div className="d-flex flex-column flex-grow-1 overflow-hidden bg-outlet"    style={{
            boxShadow: `0px 1px 4px 0px rgba(0, 0, 0, 0.15)`,
          }}>
          <NavBar />

          <div className="flex-grow-1 overflow-auto"  style={{
            background: darkMode ? "#222" : "#F5F5F5",
          }}>
            <Outlet />
          </div>
        </div>
      </div>


      



  
   </>
   
  )
}