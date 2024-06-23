import React, { useState } from "react";
import lockLogo from "../../../assets/image/forgottenPass_logo.png";
import { Link } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [userNameOrEmail, setUserNameOrEmail] = useState("");

  const handleForggotPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userNameOrEmail);

    const body = {
      userNameOrEmail,
    };

    axios
      .post("http://localhost:4000/user/forgot-password", body)
      .then((res) => {
        window.open(res.data, "_blank");
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  return (
    <>
      <div className="grid grid-cols-12 justify-items-center bg-[#fafafa]">
        <div className="col-span-12 border xxl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 xm:w-1/2 bg-[#ffffff] p-10">
          <img src={lockLogo} alt="lock_Logo" className="my-5 mx-auto" />
          <h2 className="my-3 font-bold text-center">
            Trouble with logging in?
          </h2>
          <p className="text-[#9c9488] text-center">
            Enter your email address, phone number or username, and we'll send
            you a link to get back into your account.
          </p>
          <form onSubmit={handleForggotPassword}>
            <input
              type="text"
              name="username"
              className="my-3 ps-2 text-sm p-2 border rounded w-full bg-[#fafafa]"
              placeholder="username or email address"
              onChange={(e) => {
                setUserNameOrEmail(e.target.value);
              }}
            />
            <input
              type="submit"
              className="border my-2 p-1 font-bold bg-[#2196f3] text-white rounded-md w-full flex items-center justify-center cursor-pointer"
              value={"Send Login Link"}
            />
          </form>
          <div className="flex justify-between my-9">
            <div className="w-1/2">
              <hr />
            </div>
            <div className="text-center -mt-3 bg-white px-4">OR</div>
            <div className="w-1/2">
              <hr />
            </div>
          </div>
          <div className="text-center">
            <Link to="/sign-up" className="text-blue-500 hover:underline mb-2">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
