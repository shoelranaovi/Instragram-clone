import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function SuggestUser() {
  const { suggestUser } = useSelector((state) => state.user);
  console.log(suggestUser);

  return (
    <div>
      <div className="flex justify-between mt-4">
        <p className="font-semibold">Suggested User</p>
        <p>See All</p>
      </div>
      <div className="flex gap-3 flex-col mt-4">
        {suggestUser?.map((item, index) => (
          <Link
            className=" flex justify-between"
            key={index}
            to={`/profile/${item?._id}`}>
            <div className=" flex gap-3 justify-start items-center ">
              <img
                className="rounded-full w-10 h-10"
                src={item?.profilePicture || "https://github.com/shadcn.png"}
                alt=""
              />

              <div className="flex flex-col">
                <span className="font-semibold">
                  {item?.username || "Username"}
                </span>
                <span className="text-sm">{item?.bio || "bio"}</span>
              </div>
            </div>
            <span className="text-blue-800 font-semibold"> Follow </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SuggestUser;
