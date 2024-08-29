import { useSelector } from "react-redux";
import Post from "./Post";

function Feed() {
  const { posts } = useSelector((state) => state.post);

  return (
    <div className="w-full justify-center mx-auto">
      {posts?.map((item) => (
        <Post key={item?._id} post={item} />
      ))}
    </div>
  );
}

export default Feed;
