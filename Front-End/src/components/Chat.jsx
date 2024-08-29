/* eslint-disable react/prop-types */
import useGetAllmessage from "@/hook/getAllMessage";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import useGetRTM from "@/hook/useGetRTM";

function Chat({ selectedUser }) {
  useGetRTM();
  const { messages } = useSelector((state) => state.chat);

  useGetAllmessage();

  return (
    <div className="box w-full flex h-full gap-2 mt-32 flex-col justify-center items-center mb-10">
      <div className="flex  flex-col gap-4">
        <img
          className="w-24 h-24  bg rounded-full"
          src={selectedUser?.profilePicture}
          alt=""
        />
        <Button variant="ghost" className="bg-slate-200">
          {" "}
          View Profile
        </Button>
      </div>
      <div className="flex gap-2 flex-col w-full">
        {messages?.map((item) => (
          <div
            className={
              selectedUser._id === item.senderId
                ? "flex w-full px-4  "
                : "flex w-full px-4  justify-end  "
            }
            key={item._id}>
            <span
              className={
                selectedUser._id === item.senderId
                  ? " bg-slate-200 rounded-xl p-3 px-4 "
                  : "  bg-blue-400 text-white rounded-xl p-3 px-4  "
              }>
              {" "}
              {item.message}{" "}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Chat;
