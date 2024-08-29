import { backendurl } from "@/common";
import { setallpost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetallpost = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchallpost = async () => {
      try {
        const res = await axios.get(`${backendurl}/post/getallpost`, {
          withCredentials: true,
        });

        dispatch(setallpost(res.data?.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchallpost();
  }, []);
};

export default useGetallpost;
