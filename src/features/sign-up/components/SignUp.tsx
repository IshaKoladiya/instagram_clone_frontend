import Mocup from "../../../assets/image/mocup.gif";
import textInatagramLogo from "../../../assets/image/tex_instagram.png";
import { Link, useNavigate } from "react-router-dom";
import facebook from "../../../assets/image/facebook.png";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
const SignUp = () => {

  const navigate = useNavigate();
  const {handleUserLogged } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      email: userData.email,
      fullname: userData.fullName,
      username: userData.username,
      password: userData.password
    };

    axios.post("http://localhost:4000/user/signup", data).then((res) => {
      console.log(res.data)
      navigate("/");

      handleUserLogged(true);

      // localstorage set id
      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("userName", JSON.stringify(res.data.username));
      })
     .catch((err) => {
      return alert(err.response.data)
      });
  };


  return (
    <>
      <div className="grid grid-cols-12 justify-items-end mt-10">
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 md:col-span-5 sm:col-span-5 xs:col-span-12 col-span-12">
          <img src={Mocup} alt="mocup" className="h-[100vh] w-[100%]" />
        </div>
        <div className="col-span-2"></div>
        <div className="xxl:col-span-5 xl:col-span-5 lg:col-span-5 md:col-span-5 sm:col-span-5 xs:col-span-12 col-span-12">
          {/* sign up in form */}
          <div>
            <div className="border xxl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[60%] sm:w-[100%] xs:w-[100%] p-5 my-2">
              <img
                src={textInatagramLogo}
                alt="instagram_text"
                className="w-[70%] mx-auto mt-6"
              />
              <p className="text-center my-3 text-[#737373]">
                Sign up to see photos and videos from your friends.
              </p>
              <div className="mt-4 mb-2">
                <button
                  type="button"
                  className="border p-2 rounded w-full flex items-center justify-center bg-[#0095f6] text-white text-sm"
                >
                  <img
                    src={facebook}
                    alt="google_logo"
                    className="w-5 mr-2 bg-white"
                  />
                  Continue with FaceBook
                </button>
              </div>
              <div className="flex justify-between mt-4">
                <div className="w-1/2">
                  <hr />
                </div>
                <div className="text-center text-sm -m-2 bg-white px-6">OR</div>
                <div className="w-1/2">
                  <hr />
                </div>
              </div>
              <form onSubmit={handleSubmit} className="mt-5">
                <div>
                  <input
                    type="email"
                    name="email"
                    className="mb-1 ps-2 text-sm p-1 border rounded w-full"
                    placeholder="Enter your Email"
                   value={userData.email}
                   onChange={handleChange}
                   required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="fullName"
                    className="my-1 text-sm ps-2 p-1 border rounded w-full"
                    placeholder="Enter Your FullName"
                    value={userData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="username"
                    className="my-1 text-sm ps-2 p-1 border rounded w-full"
                    placeholder="Username"
                    value={userData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    className="my-1 text-sm ps-2 p-1 border rounded w-full"
                    placeholder="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <p className="text-center my-3 text-[#737373] text-xs">
                  People who use our service may have uploaded your contact
                  information to Instagram. Learn More
                </p>
                <p className="text-center my-3 text-[#737373] text-xs">
                  By signing up, you agree to our Terms , Privacy Policy and
                  Cookies Policy .
                </p>

                <input
                  type="submit"
                  className="my-2 p-1 border rounded w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  value={"Sign Up"}
                />
                <div className="text-center">
                  Have an account?{" "}
                  <Link
                    to="/"
                    className="text-blue-500 hover:underline mb-2"
                  >
                    Log in
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
