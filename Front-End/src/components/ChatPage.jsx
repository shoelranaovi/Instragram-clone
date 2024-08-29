import { setSelecteduser } from "@/redux/userSlice";
import { MessageCircleCode } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { backendurl } from "@/common";
import { setMessage } from "@/redux/chatSlice";
import Chat from "./Chat";
import useGetallpost from "@/hook/useGetallpost";

function ChatPage() {
  const { user, suggestUser, selectedUser } = useSelector(
    (state) => state.user
  );

  const [message, setChatText] = useState();

  useGetallpost();

  const { onlineUser, messages } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  async function sendmassage(id) {
    try {
      const res = await axios.post(
        `${backendurl}/msg/sendmassage/${id}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessage([...messages, res.data.data]));
        setChatText(" ");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    dispatch(setSelecteduser(null));
  }, []);
  return (
    <div className="flex w-full">
      <div className="w-2/6 border-r-2 mr-4 p-2 font-bold ">
        <h1 className="border-b-2 pb-2 border-gray-500">{user?.username} </h1>
        <div className="flex gap-4 flex-col  mt-10">
          {suggestUser?.map((item, index) => {
            const suggestuserisOnline = onlineUser.includes(item?._id);

            return (
              <div
                key={index}
                className="cursor-pointer hover:bg-slate-100"
                onClick={() => {
                  dispatch(setSelecteduser(item));
                  () => {};
                }}>
                <div className=" flex gap-3 justify-start items-center ">
                  <img
                    className="rounded-full w-10 h-10"
                    src={
                      item?.profilePicture || "https://github.com/shadcn.png"
                    }
                    alt=""
                  />

                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {item?.username || "Username"}
                    </span>
                    <span className="text-sm">
                      {" "}
                      {suggestuserisOnline ? (
                        <span className="text-green-500"> Online</span>
                      ) : (
                        <span className="text-red-500"> Offline</span>
                      )}{" "}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" w-full flex flex-col h-screen  ">
        <div className="maincontent gap-2">
          <div className="header">
            <div className=" w-full flex gap-2">
              <img
                className="rounded-full w-12 h-12"
                src={
                  selectedUser?.profilePicture ||
                  "https://github.com/shadcn.png"
                }
                alt=""
              />

              <div className="flex flex-col">
                <span className="font-semibold">
                  {selectedUser?.username || "Username"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bodr h-full overflow-y-scroll ">
          {selectedUser ? (
            <div>
              <Chat selectedUser={selectedUser} />
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col justify-center items-center">
                <MessageCircleCode size={100} />
                <p className="text-xl">You messages</p>
                <p className="text-xl">Send a message to start a chat</p>
              </div>
            </div>
          )}
        </div>
        <div className="input w-full flex gap-4 pb-4">
          <Input
            value={message}
            onChange={(e) => setChatText(e.target.value)}
          />
          <Button onClick={() => sendmassage(selectedUser._id)}> Send</Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
