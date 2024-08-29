import useSetSuggestuser from "@/hook/suggestUser";
import Feed from "./Feed";
import Rightsidebar from "./Rightsidebar";
import useGetallpost from "@/hook/useGetallpost";

function Home() {
  useGetallpost();
  useSetSuggestuser();
  return (
    <div className="flex mx-auto gap-4 mt-2 w-full justify-between    p-4 ">
      <div className="w-3/5 flex justify-center ">
        <Feed />
      </div>
      <Rightsidebar />
    </div>
  );
}

export default Home;
