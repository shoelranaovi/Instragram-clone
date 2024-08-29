import { createBrowserRouter } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Error from "./components/Error";
import Profile from "./components/profile";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/editprofile",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: <Error />,
  },
]);

export default route;
