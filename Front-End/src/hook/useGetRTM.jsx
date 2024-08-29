import { setMessage } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const { messages } = useSelector((state) => state.chat);
  console.log(messages);
  useEffect(() => {
    socket?.on("newMassage", (newMessage) => {
      dispatch(setMessage([...messages, newMessage]));
    });
    return () => {
      socket?.off("newMassage");
    };
  }, [messages, setMessage]);
};
export default useGetRTM;
