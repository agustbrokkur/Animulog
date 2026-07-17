import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar/Sidebar";
import { Toolbar } from "./Toolbar/Toolbar";

export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#141416]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Toolbar />
        <main className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}