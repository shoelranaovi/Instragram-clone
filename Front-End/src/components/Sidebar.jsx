import {
  Heart,
  HomeIcon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { backendurl } from "@/common";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

function Sidebar() {
  const { user } = useSelector((state) => state.user);
  const [openCreate, setOpenCreate] = useState(false);
  const { likenotification } = useSelector((state) => state.rtn);
  console.log(likenotification);

  const sideItem = [
    { logo: <HomeIcon />, text: "Home" },
    { logo: <Search />, text: "Search" },
    { logo: <TrendingUp />, text: "Explore" },
    { logo: <MessageCircle />, text: "Message" },
    { logo: <Heart />, text: "Notification" },
    { logo: <PlusSquare />, text: "Create" },
    {
      logo: (
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { logo: <LogOut />, text: "Logout" },
  ];
  const navigate = useNavigate();
  const signout = async () => {
    try {
      const response = await fetch(`${backendurl}/user/signout`, {
        method: "post",
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  function handeler(textType) {
    if (textType === "Logout") signout();
    if (textType === "Home") navigate("/home");
    if (textType === "Message") navigate("/chat");
    if (textType === "Create") {
      setOpenCreate(true);
    }
  }
  return (
    <div className=" fixed z-10 top-0 bottom-0 h-screen flex flex-col border-r  gap-4 w-[250px] pl-3 ">
      <div className="header text-center mb-5 text-2xl pt-10"> LOGO</div>
      <div className="sidebar flex flex-col gap-3  ">
        {sideItem.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => handeler(item.text)}
              className=" relative flex gap-8 p-3 hover:bg-slate-100 rounded-lg pr-10 duration-75 cursor-pointer">
              <div>{item.logo} </div>
              <div>{item.text} </div>
              {item.text === "Notification" && likenotification.length > 0 && (
                <Popover>
                  <PopoverTrigger aschild>
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 absolute bottom-6 left-6">
                      {likenotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex flex-col gap-4">
                      {likenotification.length === 0 ? (
                        <p>no notification </p>
                      ) : (
                        likenotification.map((notification, index) => {
                          return (
                            <div
                              key={index}
                              className="flex gap-2 justify-center items-center">
                              <Avatar>
                                <AvatarImage
                                  src={notification.userDetails?.profilePicture}
                                />
                              </Avatar>
                              <p className="text-sm">
                                {" "}
                                {notification.userDetails?.username}{" "}
                                <span>Liked your post</span>
                              </p>
                            </div>
                          );
                        })
                      )}{" "}
                    </div>{" "}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
      <CreatePost open={openCreate} setopen={setOpenCreate} />
    </div>
  );
}

export default Sidebar;
