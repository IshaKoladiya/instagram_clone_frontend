import { useState } from "react";
import instaText from "../../../assets/image/tex_instagram.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const NewPassword = () => {
  const [passOrConformPass, setPassOrConformPass] = useState({
    password: "",
    conformpassword: "",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassOrConformPass({
      ...passOrConformPass,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(passOrConformPass.password);
    console.log(passOrConformPass.conformpassword);

    if (passOrConformPass.password != passOrConformPass.conformpassword) {
        return alert("Password doesn't match");
      }
  
      // api call
      const url = "http://localhost:4000/user/reset-password";
  
      const token = searchParams.get("token");
  
      const body = {
        password : passOrConformPass.password,
        token,
      };
      axios
        .post(url, body)
        .then((res) => {
          alert(res.data);
          // redirect home
          navigate("/");
        })
        .catch((err) => {
          alert(err.response.data);
        });
  };

  return (
    <div>
      <div className="flex justify-around p-3 border-b-2">
        <div>
          <img src={instaText} alt="text_instagram" className="w-[15%]" />
        </div>
        <div>
          <button
            type="button"
            className="rounded bg-[#0095f6] hover:bg-[#0094f6c4] text-white p-3 mx-2"
            onClick={()=>navigate('/')}
          >
            Log In
          </button>
          <button
            type="button"
            className="rounded  text-[#0095f6] hover:text-black p-3 mx-2"
            onClick={()=>navigate('/sign-up')}
          >
            Sign Up
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 justify-items-center mt-16">
        <div className="col-span-12 border xxl:w-1/4 xl:w-1/4 lg:w-1/4 md:w-1/2 sm:w-1/2 xm:w-1/2 bg-[#ffffff] p-10">
          <h1 className="text-center my-3 font-bold">
            Create A Strong Password
          </h1>
          <p className="text-[#9c9488] my-3 text-center">
            Your password must be at least 6 characters and should include a
            combination of numbers, letters and special characters (!$@%).
          </p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="password"
              className="my-3 ps-2 text-sm p-3 border rounded w-full bg-[#fafafa]"
              placeholder="Enter your password"
              onChange={handlePassChange}
              value={passOrConformPass.password}
            />
            <input
              type="text"
              name="conformpassword"
              className="my-3 ps-2 text-sm p-3 border rounded w-full bg-[#fafafa]"
              placeholder="Enter your Confirm Password"
              onChange={handlePassChange}
              value={passOrConformPass.conformpassword}
            />
            <input
              type="submit"
              className="border my-2 p-3 font-bold bg-[#2196f3] text-white rounded-md w-full flex items-center justify-center cursor-pointer"
              value={"Reset Password"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
