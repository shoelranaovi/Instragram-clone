import { MoreHorizontal } from "lucide-react";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { backendurl } from "@/common";
import axios from "axios";

// eslint-disable-next-line react/prop-types
function CommentDialog({ open, setopen }) {
  const [text, setText] = useState("");
  const { selectedpost } = useSelector((state) => state.post);
  const [comments, setComment] = useState([]);

  async function getpostcomment() {
    const response = await fetch(
      `${backendurl}/post/getpostcomment/${selectedpost._id}`
    );
    const data = await response.json();

    setComment(data.data);
  }
  useEffect(() => {
    getpostcomment();
  }, [selectedpost]);

  function onchange(e) {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
  const commenthandler = async () => {
    console.log(selectedpost._id);

    try {
      const res = await axios.post(
        `${backendurl}/post/addcomment/${selectedpost._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        // const updatecomment = [...comments, res.data?.data];

        // setComment(updatecomment);
        // const updatepostdata = posts.map((p) =>
        //   p._id === selectedpost._id ? { ...p, comment: updatecomment } : p
        // );
        // console.log(updatecomment);

        // dispatch(setallpost(updatepostdata));
        getpostcomment();

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
    <Dialog open={open} className="">
      <DialogContent
        onInteractOutside={() => setopen(false)}
        className="flex max-w-5xl ">
        <div className="flex gap-2  ">
          <div className="w-1/2 bg-cover ">
            <img className="h-full" src={selectedpost.image} alt="" />
          </div>
          <div className="w-1/2  flex flex-col justify-between">
            <div className="header flex w-full border-b pb-2 border-gray-200 justify-between ">
              <div className=" flex gap-3 justify-center items-center  ">
                <img
                  className="rounded-full w-10 h-10"
                  src={selectedpost.author?.profilePicture}
                  alt=""
                />

                <span>{selectedpost.author?.username} </span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer mt-2" />
                </DialogTrigger>
                <DialogContent className="flex flex-col justify-center items-center">
                  <p className="border-b border-black w-full text-center pb-2">
                    Unfollow
                  </p>
                  <p className="border-b border-black w-full text-center pb-2">
                    Unfollow
                  </p>
                  <p className="border-b border-black w-full text-center pb-2">
                    Unfollow
                  </p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="h-[300px] overflow-y-scroll flex flex-col gap-2 mt-3 ">
              {comments?.map((item) => (
                <div key={item._id} className="flex gap-2">
                  <div className="">
                    <img
                      className="rounded-full w-12 h-12"
                      src={item.author.profilePicture}
                      alt=""
                    />
                  </div>
                  <span className="font-bold pl-2">
                    {item.author.username}{" "}
                  </span>
                  <span>{item.text} </span>
                </div>
              ))}
            </div>
            <div className="flex py-4 gap-2 w-full  ">
              <input
                type="text"
                onChange={onchange}
                value={text}
                className="w-full focus:outline-none "
                placeholder="type your comments"
              />

              <Button onClick={commenthandler} disabled={!text.trim()}>
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
