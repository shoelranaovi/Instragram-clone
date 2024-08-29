import { backendurl } from "@/common";

import { setSuggestuser } from "@/redux/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useSetSuggestuser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchallpost = async () => {
      try {
        const res = await axios.get(
          `${backendurl}/user/suggestuser/${user._id}`,
          {
            withCredentials: true,
          }
        );

        dispatch(setSuggestuser(res.data?.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchallpost();
  }, []);
};

export default useSetSuggestuser;
