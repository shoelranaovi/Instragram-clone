/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { BookMarked, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { backendurl } from "@/common";
import { setallpost, setselectedpost } from "@/redux/postSlice";
import { IoIosHeart } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";

function Post({ post }) {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);

  const [text, setText] = useState("");
  const [open, setopen] = useState(false);
  const [liked, setLiked] = useState(post.like?.includes(user?.id) || false);
  const [postLike, setPostLike] = useState(post.like?.length);
  const [comment, setComment] = useState(post?.comment);

  const dispatch = useDispatch();

  function onchange(e) {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
  const deletePostHandeler = async () => {
    try {
      const res = await axios.delete(
        `${backendurl}/post/deletepost/${post?._id} `,
        { withCredentials: true }
      );
      const updatepost = posts.filter(
        (postitem) => postitem?._id !== post?._id
      );
      console.log(res);

      dispatch(setallpost(updatepost));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const likeandunlike = async () => {
    try {
      const action = liked ? "unlike-post" : "like-post";
      const res = await axios.get(`${backendurl}/post/${action}/${post?._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setLiked(!liked);
        const likecount = liked ? postLike - 1 : postLike + 1;
        setPostLike(likecount);
        const updatepost = posts.map((item) =>
          item._id === post._id
            ? {
                ...item,
                like: liked
                  ? item.like?.filter((id) => id !== user.id)
                  : [...item.like, user.id],
              }
            : item
        );
        dispatch(setallpost(updatepost));
      }
      toast.success(res.data.message);
      console.log(res);
    } catch (error) {
      toast.error(error.message);
    }
  };
  const commenthandler = async () => {
    console.log(post._id);

    try {
      const res = await axios.post(
        `${backendurl}/post/addcomment/${post._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatecomment = [...comment, res.data?.data];
        setComment(updatecomment);
        const updatepostdata = posts.map((p) =>
          p._id === post._id ? { ...p, comment: updatecomment } : p
        );
        dispatch(setallpost(updatepostdata));
        console.log(comment);
        toast.success(res.data.message);
        setText("");
      }
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[30vw]  mx flex mx-auto flex-col">
      <div className="header flex w-full  justify-between ">
        <div className=" flex gap-3 justify-center items-center  ">
          <img
            className="rounded-full w-10 h-10"
            src={post.author?.profilePicture || "https://github.com/shadcn.png"}
            alt=""
          />

          <div className="flex flex-col">
            <span className="font-semibold flex gap-2 ">
              {post.author?.username || "Username"}
              {user?.id === post.author._id ? (
                <p className="bg-gray-400 px-2 rounded-lg text-white">
                  Author{" "}
                </p>
              ) : (
                <p className="bg-gray-400 px-2 rounded-lg text-white">
                  follow{" "}
                </p>
              )}
            </span>
            <span className="text-sm">{post.author?.bio || "bio"}</span>
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer mt-2" />
          </DialogTrigger>
          <DialogContent className="flex flex-col justify-center items-center">
            {user?.id === post.author?._id ? (
              <div className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  className=" border-1 bg-slate-200 text-black border-black ">
                  Unfollow
                </Button>
                <Button
                  onClick={deletePostHandeler}
                  variant="ghost"
                  className=" border-1 bg-slate-200 text-black border-black ">
                  Delete
                </Button>
              </div>
            ) : null}

            <Button
              variant="ghost"
              className=" border-1 bg-slate-200 text-black border-black ">
              Add To bookmark
            </Button>
            <Button
              variant="ghost"
              className=" border-1 bg-slate-200 text-black border-black ">
              Share
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className=" mt-4 flex items-center justify-center">
        <div className="  w-[350px]  ">
          <img
            className="w-full h-full rounded-md bg-cover"
            src={post?.image}
          />
        </div>
      </div>
      <div className=" flex justify-between w-full  mt-5">
        <div className="icon flex gap-4 ">
          {liked ? (
            <IoIosHeart
              onClick={likeandunlike}
              size={28}
              className="hover:text-gray-600 cursor-pointer text-red-500 "
            />
          ) : (
            <FaRegHeart
              onClick={likeandunlike}
              size={28}
              className="hover:text-gray-600 cursor-pointer text-none"
            />
          )}
          <MessageCircle
            onClick={() => {
              setopen(true);
              dispatch(setselectedpost(post));
            }}
            className="hover:text-gray-600 cursor-pointer"
          />
          <Send className="hover:text-gray-600 cursor-pointer" />
        </div>
        <div className="bookmark">
          <BookMarked className="hover:text-gray-600 cursor-pointer" />{" "}
        </div>
      </div>
      <div className="flex justify-start w-full  mt-2">
        <div className="flex flex-col">
          <span> {postLike} likes</span>
          <div className="flex gap-2">
            <span className="font-medium">username</span>
            <p>{post?.caption} </p>
          </div>
          <span
            className="curser-pointer text-gray-600"
            onClick={() => {
              setopen(true);
              dispatch(setselectedpost(post));
            }}>
            View all comments
          </span>
          <CommentDialog selectedposts={post} open={open} setopen={setopen} />
        </div>
      </div>
      <div className="flex py-4 gap-2 w-full  ">
        <input
          type="text"
          onChange={onchange}
          value={text}
          className="w-full focus:outline-none "
          placeholder="type your comments"
        />
        {text && (
          <span className="cursor-pointer" onClick={commenthandler}>
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
