import { useNavigate } from "react-router-dom";
import instagram_text from "../../../assets/image/tex_instagram.png";
import Home from "../../../assets/image/home.png";
import FilledHome from "../../../assets/svg/filled_home.svg";
import search from "../../../assets/image/search.png";
import FilledSearch from "../../../assets/image/filled_search.png";
import explore from "../../../assets/image/explore.png";
import FilledExplore from "../../../assets/svg/filled_explore.svg";
import Reel from "../../../assets/image/reel.png";
import FilledReel from "../../../assets/image/filled_reel.png";
import massage from "../../../assets/image/messenger.png";
import FilledMassage from "../../../assets/image/filled_massage.png";
import like from "../../../assets/image/heart.png";
import FilledLike from "../../../assets/svg/filled_like.svg";
import Create from "../../../assets/image/post.png";
import FilledCreate from "../../../assets/image/filledPost.png";
import { useState } from "react";
import { UserPost } from "../../user-post/pages";

interface UserImage {
  [key: string]: any;
}

const userImageJSON = localStorage.getItem("userImage");

// Parse the JSON string into a JavaScript object of type UserImage
const userImage: UserImage = userImageJSON ? JSON.parse(userImageJSON) : {};

const sideMenuOptions = [
  {
    text: "Home",
    path: "/",
    icon: Home,
    Fill_icon: FilledHome,
  },
  {
    text: "Search",
    path: "/search",
    icon: search,
    Fill_icon: FilledSearch,
  },
  {
    text: "Explore",
    path: "/explore",
    icon: explore,
    Fill_icon: FilledExplore,
  },
  {
    text: "Reels",
    path: "/reels",
    icon: Reel,
    Fill_icon: FilledReel,
  },
  {
    text: "Message",
    path: "/message",
    icon: massage,
    Fill_icon: FilledMassage,
  },
  {
    text: "Notification",
    path: "/notification",
    icon: like,
    Fill_icon: FilledLike,
  },
  {
    text: "Create",
    path: "/create",
    icon: Create,
    Fill_icon: FilledCreate,
  },
  {
    text: "Profile",
    path: "/profile",
    icon: `/src/assets/image/${userImage}`,
    Fill_icon: FilledLike,
  },
];

const SideMenu = () => {
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);

  const handleModal = (value : boolean)=>{
    setOpenModel(value);
  }

  return (
    <>
      <div className="border border-r-2 border-[#808080] max-w-[100%] min-w-[200px] h-[100vh] z-50 bg-white">
        <div
          className="p-[16px] cursor-pointer font-semibold text-xl pt-8"
          onClick={() => navigate("/")}
        >
          <img src={instagram_text} alt="instagram" className="w-[8rem]" />
        </div>
        {sideMenuOptions.map((link, index) => {
          return (
            <div
              className="p-[15px] cursor-pointer flex font-semibold text-md hover:bg-[#efefef]"
              onClick={() => {
                link.path == "/create"
                  ? setOpenModel(true)
                  : navigate(link.path);
              }}
              key={index}
            >
              <img
                src={link.icon}
                alt={link.text}
                className="w-6 h-6 mr-5"
                style={
                  link.icon == `/src/assets/image/${userImage}`
                    ? { borderRadius: "50%" }
                    : { borderRadius: "0%" }
                }
              />
             <div className="">{link.text}</div>
            </div>
          );
        })}
      </div>

      {/* modal */}
      {openModel && <UserPost handleModal={handleModal} />}
    </>
  );
};

export default SideMenu;
