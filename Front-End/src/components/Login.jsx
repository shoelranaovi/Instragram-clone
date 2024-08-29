import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { backendurl } from "@/common";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setuserdetail } from "@/redux/userSlice";

function Login() {
  const [fromdata, setFromdata] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoding] = useState(false);
  const { email, password } = fromdata;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log(email, password);
  const onchange = (e) => {
    setFromdata((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  async function onsubmit(e) {
    e.preventDefault();

    console.log(fromdata);
    try {
      setLoding(true);
      const data = await fetch(`${backendurl}/user/login`, {
        method: "post",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(fromdata),
      });
      const response = await data.json();
      console.log(response);

      if (response.success) {
        toast.success(response.message);
        setLoding(false);
        dispatch(setuserdetail(response.data));
        navigate("/home");
      } else {
        toast.error(response.message);
        setLoding(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoding(false);
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <form className=" shadow-lg p-8 flex flex-col">
        <div className="title mb-4 flex flex-col justify-center">
          <h1 className="text-xl font-bold mb-4 text-center">Log IN</h1>
          <p>LogIn to see photos & video From your Friends</p>
        </div>

        <div className="flex flex-col mb-4 gap-2">
          <Label>Email:</Label>
          <Input
            onChange={onchange}
            value={email}
            id="email"
            type="Email"
            placeholder="Type your email"
            className=" p-4 text-md"
          />
        </div>
        <div className="flex flex-col mb-4 gap-2">
          <Label>Password:</Label>
          <Input
            type="password"
            id="password"
            onChange={onchange}
            value={password}
            placeholder="Type your password"
            className=" p-4 text-md"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="animate-spin mr-2" />
            please wait
          </Button>
        ) : (
          <Button className="mb-4" onClick={onsubmit}>
            Login
          </Button>
        )}

        <span>
          {"Don't"} have an account ?{" "}
          <Link className="text-blue-400" to="/signup">
            {" "}
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
