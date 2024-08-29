import { Dialog, DialogContent } from "./ui/dialog";

import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { readFileAsDataUrl } from "@/lib/utils";
import axios from "axios";
import { backendurl } from "@/common";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setallpost } from "@/redux/postSlice";
import { toast } from "sonner";

// eslint-disable-next-line react/prop-types
function CreatePost({ open, setopen }) {
  const { user } = useSelector((state) => state.user);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imgprev, setImgprev] = useState("");
  const [loading, setLoading] = useState(false);

  const imgRef = useRef(null);
  async function onchange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataurl = await readFileAsDataUrl(file);
      setImgprev(dataurl);
    }
  }

  async function onsubmit(e) {
    e.preventDefault();
    const fromdata = new FormData();
    fromdata.append("caption", caption);
    fromdata.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(`${backendurl}/post/create-post`, fromdata, {
        headers: {
          "Content-Type": "multipart/from-data",
        },
        withCredentials: true,
      });

      console.log(res.data.data);
      dispatch(setallpost([res.data.data, ...posts]));
      setLoading(false);
      setopen(false);
      setCaption("");
      setFile("");
      setImgprev("");
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    setopen(false);
  }
  function onchangecaption(e) {
    setCaption(e.target.value);
  }

  return (
    <Dialog open={open} className=" ">
      <DialogContent
        onInteractOutside={() => setopen(false)}
        className="flex max-w-2xl ">
        <div className="w-full flex flex-col gap-4 ">
          <h1 className="font-bold ">Create New post</h1>
          <div className="user ">
            <div className="picture  h-10    gap-2 flex">
              <img
                src={user?.profilePicture}
                className=" w-14 bg-black h-14 rounded-full"
              />
              <div className="w-[300px] ">
                <h2 className="font-bold ">{user?.username} </h2>
                <p className="text-sm">{user?.bio || "bio here..."} </p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <Textarea
              value={caption}
              onChange={onchangecaption}
              className="bg-slate-50 border-none focus-visible:ring-transparent "
              placeholder="Type your message here."
            />
          </div>

          {imgprev && (
            <div className="w-full h-[20rem]  flex justify-center">
              <img
                src={imgprev}
                className="w-80 object-cover bg-center  "
                alt=""
              />
            </div>
          )}

          <div className="w-full flex justify-center">
            <input
              ref={imgRef}
              className="hidden"
              onChange={onchange}
              type="file"
            />
            <Button
              className="bg-blue-700 px-4"
              onClick={() => imgRef.current.click()}>
              {" "}
              Select From Computer
            </Button>
          </div>
          {loading ? (
            <Button type="submit" onClick={onsubmit}>
              <Loader2 className=" mr-3 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" onClick={onsubmit}>
              Post
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
