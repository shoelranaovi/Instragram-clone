import { useSelector } from "react-redux";
import SuggestUser from "./SuggestUser";
import { Link } from "react-router-dom";

function Rightsidebar() {
  const { user } = useSelector((state) => state.user);
 

  return (
    <div className=" w-1/5 h-screen fixed right-10 ">
      <Link to={`/profile/${user?.id}`}>
        <div className=" flex gap-3 justify-start items-center ">
          <img
            className="rounded-full w-10 h-10"
            src={user?.profilePicture || "https://github.com/shadcn.png"}
            alt=""
          />

          <div className="flex flex-col">
            <span className="font-semibold">
              {user?.username || "Username"}
            </span>
            <span className="text-sm">{user?.bio || "bio"}</span>
          </div>
        </div>
      </Link>
      <SuggestUser />
    </div>
  );
}

export default Rightsidebar;
