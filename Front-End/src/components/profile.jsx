import { backendurl } from "@/common";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { FaComment } from "react-icons/fa";

function Profile() {
  const [founduser, setUser] = useState(null);
  const { user } = useSelector((state) => state.user);

  const params = useParams();
  const userId = params.id;

  const [tab, setTab] = useState("post");
  console.log("tab", tab);

  const userdata = async () => {
    try {
      const res = await axios.get(`${backendurl}/user/getprofile/${userId}`, {
        withCredentials: true,
      });
      setUser(res.data?.data);
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    userdata();
  }, [userId]);
  const handler = (tab) => {
    setTab(tab);
  };
  return (
    <div className=" w-full">
      <div className="header flex w-full">
        <div className="left w-1/3 flex justify-center items-center mt-20">
          <img
            className="rounded-full w-52 h-52"
            src={founduser?.profilePicture}
            alt=""
          />
        </div>
        <div className="details flex flex-col gap-8 mt-10">
          <div className="button flex items-center gap-4">
            <h1>{user?.username}</h1>
            {founduser?._id === user?.id ? (
              <div className="flex gap-4">
                <Link to={"/editprofile"}>
                  <Button className="bg-slate-100" variant="ghost">
                    {" "}
                    Edit Profile{" "}
                  </Button>
                </Link>
                <Button className="bg-slate-100" variant="ghost">
                  {" "}
                  View Achive{" "}
                </Button>
                <Button className="bg-slate-100" variant="ghost">
                  {" "}
                  Ad Tool{" "}
                </Button>
              </div>
            ) : (
              <Button className="bg-blue-600 ml-4"> Follow</Button>
            )}
          </div>
          <div className="detail flex gap-6">
            <span>{founduser?.post.length} Post </span>
            <span>{founduser?.follower.length} follower </span>
            <span>{founduser?.following.length} Following </span>
          </div>
          <div className="description flex flex-col gap-2">
            <h1 className="font-bold ">{founduser?.bio || "This is a bio"} </h1>
            <span>
              {" "}
              <span className="text-2xl font-bold">@</span>{" "}
              <span className="bg-slate-100 px-4 py-1 rounded-lg">
                {founduser?.username}
              </span>{" "}
            </span>
            <div className="flex flex-col">
              <span>@Learn code with me</span>
              <span>@Turing code into fun</span>
              <span>@DM For collabaration</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom w-full justify-center items-center border-t-2 mt-10">
        <div className="tab flex justify-center items-center gap-10 ">
          <div onClick={() => handler("post")} className="cursor-pointer">
            POST
          </div>
          <div onClick={() => handler("tags")} className="cursor-pointer">
            TAGS
          </div>
          <div onClick={() => handler("saved")} className="cursor-pointer">
            SAVED
          </div>
          <div onClick={() => handler("reels")} className="cursor-pointer">
            REELS
          </div>
        </div>
        <div className=" ml-10  justify-center items-center overflow-hidden">
          {tab === "post" && (
            <div className="   flex-wrap gap-4  justify-center flex items-center mt-5  ">
              {founduser?.post?.map((item, i) => (
                <div className="relative" key={i}>
                  {" "}
                  <div className=" ">
                    <img className="w-[300px] " src={item.image} />{" "}
                  </div>
                  <div className="absolute flex justify-center items-center gap-4  inset-0 opacity-0 duration-300 text-white bg-black hover:opacity-50">
                    {" "}
                    <div className="flex gap-2 ">
                      {" "}
                      <Heart /> {item?.like.length}{" "}
                    </div>
                    <div className="flex gap-1 ">
                      {" "}
                      <FaComment className="mt-1" /> {item?.comment.length}{" "}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
