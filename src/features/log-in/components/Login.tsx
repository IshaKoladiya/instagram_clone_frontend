import LoginStyle from "../style/login_style.module.css";
import Mocup from "../../../assets/image/mocup.gif";
import textInatagramLogo from "../../../assets/image/tex_instagram.png";
import Google from "../../../assets/image/google_logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { handleUserLogged } = useContext(AuthContext);

  const [userCorrectData, setUserCorrectData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserCorrectData({ ...userCorrectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = {
      email: userCorrectData.email,
      password: userCorrectData.password,
    };

    axios
      .post("http://localhost:4000/user/login", user)
      .then((res) => {
        // redirect home
        navigate("/");

        // context user logged
        handleUserLogged(true);

        // localstorage
        localStorage.setItem("token", JSON.stringify(res.data.token));
        localStorage.setItem("userName", JSON.stringify(res.data.username));
      })
      .catch((error) => {
        alert(error.response.data.error);
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
          {/* log in form */}
          <div className={`${LoginStyle.reflect_form}`}>
            <div className="border xxl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[60%] sm:w-[100%] xs:w-[100%] p-5">
              <img
                src={textInatagramLogo}
                alt="instagram_text"
                className="w-[70%] mx-auto mt-6"
              />
              <form className="mt-5" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={userCorrectData.email}
                    onChange={handleInputChange}
                    className="my-2 ps-2 text-sm p-2 border rounded w-full"
                    placeholder="username or email address"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name="password"
                    value={userCorrectData.password}
                    onChange={handleInputChange}
                    className="my-2 text-sm ps-2 p-2 border rounded w-full"
                    placeholder="password"
                  />
                </div>

                <input
                  type="submit"
                  className="my-3 p-1 border rounded w-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  value="Login"
                />

                {/* give me half hr or and half hr in one line */}
                <div className="flex justify-between my-6">
                  <div className="w-1/2">
                    <hr />
                  </div>
                  <div className="text-center -mt-6 bg-white p-3">OR</div>
                  <div className="w-1/2">
                    <hr />
                  </div>
                </div>
                <div className="text-center">
                  <Link
                    to="/forgot-password"
                    className="text-blue-500 hover:underline mb-2"
                  >
                    Forgotten your password ?
                  </Link>
                </div>
                <div className="mt-4 mb-3">
                  <button
                    type="button"
                    className="border p-2 rounded w-full flex items-center justify-center"
                  >
                    <img src={Google} alt="google_logo" className="w-5 mr-2" />
                    Continue with Google
                  </button>
                </div>
              </form>
            </div>
            <div className="border xxl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[60%] sm:w-[100%] xs:w-[100%] mt-2 p-5">
              <p>Don't have an account? <Link className="text-blue-500 hover:underline" to="/sign-up"> Sign up </Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
