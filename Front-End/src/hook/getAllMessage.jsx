import { backendurl } from "@/common";
import { setMessage } from "@/redux/chatSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllmessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchallpost = async () => {
      try {
        const res = await axios.get(
          `${backendurl}/msg/getMessage/${selectedUser._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setMessage(res.data.datatwo));
        } else {
          dispatch(setMessage(null));
        }
      } catch (error) {
        console.log(error);
        dispatch(setMessage(null));
      }
    };
    fetchallpost();
  }, [selectedUser]);
};

export default useGetAllmessage;
