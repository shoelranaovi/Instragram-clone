import { RouterProvider } from "react-router-dom";
import route from "./route";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setOnlineUser } from "./redux/chatSlice";
import { setSocket } from "./redux/socketSlice";
import { setLikeNotification } from "./redux/rtnSlice";

export default function App() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    let socketio;

    if (user) {
      socketio = io("http://localhost:3000", {
        query: {
          userId: user.id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUser", (getOnlineUser) => {
        dispatch(setOnlineUser(getOnlineUser));
      });
      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });
    } else {
      dispatch(setSocket(null));
    }

    return () => {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    };
  }, [user, dispatch]);

  return (
    <div>
      <RouterProvider router={route} />
    </div>
  );
}
