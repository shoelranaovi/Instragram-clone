import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className=" ml-[250px] flex  w-[calc(100vw-260px)] items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
