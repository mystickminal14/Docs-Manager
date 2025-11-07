import { useContext, useEffect, useState } from "react";
import SideBar from "./SideBar";
import { AppContext } from "../../context/ContextApp";
import { Outlet } from "react-router-dom";
import OfflinePage from "../OfflineOverlay";

const AppLayout: React.FC = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppContext not found");
  const { isOnline } = appContext;
  useEffect(() => {
    const handleResize = () => {
      setSideBarCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50transition-all duration-300`}
    >
      <div className="flex h-screen overflow-hidden">
        <SideBar
          collapsed={sideBarCollapsed}
        />
        <div className="flex-1 flex flex-col overflow-hidden">

          <main className="flex-1 overflow-y-auto bg-transparent p-4">
            {/* {isOnline ? <Outlet /> : <OfflinePage />}
             */}
             <Outlet/>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;