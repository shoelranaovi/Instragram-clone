import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { readFileAsDataUrl } from "@/lib/utils";
import { toast } from "sonner";
import { setuserdetail } from "@/redux/userSlice";
import axios from "axios";
import { backendurl } from "@/common";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const { user } = useSelector((state) => state.user);
  const photoref = useRef(null);
  const [imgprev, setImgprev] = useState("");
  const [photo, setPhoto] = useState();
  const [bio, setbio] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setloading] = useState(false);
  console.log(gender, bio, loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onchangeimg(e) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const dataurl = await readFileAsDataUrl(file);
      setImgprev(dataurl);
    }
  }
  async function onsubmit(e) {
    e.preventDefault();
    const fromdata = new FormData();
    fromdata.append("bio", bio);
    fromdata.append("gender", gender);
    fromdata.append("profilePicture", photo);
    try {
      setloading(true);
      const res = await axios.post(
        `${backendurl}/user/update-profile`,
        fromdata,
        {
          headers: {
            "Content-Type": "multipart/from-data",
          },
          withCredentials: true,
        }
      );

      console.log(res);
      dispatch(setuserdetail(res.data.data));
      setloading(false);
      setPhoto("");
      setImgprev("");
      toast.success(res.data.message);
      navigate(`/`);
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  }

  return (
    <div className=" w-1/2 mx-auto p-8">
      <div className=" flex justify-between px-8 items-center">
        {" "}
        <img
          className="w-20 h-20 rounded-full"
          src={imgprev || user?.profilePicture}
          alt=""
        />
        <div>
          <input
            type="file"
            onChange={onchangeimg}
            ref={photoref}
            className="hidden"
          />
          <Button
            onClick={() => photoref.current.click()}
            className="bg-blue-600">
            Upload Photo
          </Button>
        </div>
      </div>
      <div className=" flex w-full justify-centerr mt-10  ">
        {" "}
        <div className=" flex w-full gap-4  items-center ">
          <h1>Bio:</h1>
          <textarea
            className="w-full focus:outline-none p-2"
            value={bio}
            onChange={(e) => setbio(e.target.value)}
            cols={10}
            placeholder="type your bio"></textarea>{" "}
        </div>
      </div>
      <div className="w-full mt-10 flex justify-center items-center gap-4 ">
        <h1>Gender:</h1>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-4">
          <option value="">select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      {loading ? (
        <Button onClick={onsubmit} className=" mt-5 w-full">
          <Loader2 className="animate-spin" /> please Wait
        </Button>
      ) : (
        <Button onClick={onsubmit} className=" mt-5 w-full">
          Update
        </Button>
      )}
    </div>
  );
}

export default EditProfile;
