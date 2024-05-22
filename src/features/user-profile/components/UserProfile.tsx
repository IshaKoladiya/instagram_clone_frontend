import { useContext, useEffect, useState } from "react";
import classes from "../style/User-profile.module.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import FollowerFollowingModal from "../../follower-following-modal/components/FollowerFollowingModal";
import crossIcon from "../../../assets/svg/close-square.svg";

interface UserData {
  username: string;
  fullname: string;
  bio: string;
  profile: string;
  followers: string;
  followings: string;
  posts: string;
  _id: string;
}

type UserFollowerData = {
  username: string;
  fullname: string;
  profile: string;
}[];

type UserFollowingData = {
  username: string;
  fullname: string;
  profile: string;
}[];

interface BodyType {
  id?: string;
  token?: string | null;
}

const UserProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    _id:"",
    username: "",
    fullname: "",
    bio: "",
    profile: "",
    followers: "",
    followings: "",
    posts: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const { handleUserLogged } = useContext(AuthContext);
  const [selectedStep, setSelectedStep] = useState("post");
  const [userIsLoggedOne, setUserIsLoggedOne] = useState(false);
  const [userPosts, setUserPosts] = useState([{ image: "", commentOff: true }]);
  const [addImage, setAddImage] = useState(false);
  const [followerList, setFollowerList] = useState<UserFollowerData>([
    {
      fullname: "",
      profile: "",
      username: "",
    },
  ]);
  const [followingList, setFollowingList] = useState<UserFollowingData>([
    {
      username: "",
      fullname: "",
      profile: "",
    },
  ]);
  const [modalType, setModalType] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  const tokenFromLocalStorage = localStorage.getItem("token");
  const token: string | null = tokenFromLocalStorage
    ? JSON.parse(tokenFromLocalStorage)
    : null;

  const fetchUserData = async () => {
    let url = "http://localhost:4000/user/";

    let body: BodyType = {};

    if (id == "profile") {
      url += "token";
      body.token = token;
    } else {
      url += "id";
      body.id = id;
    }

    const response = await axios.post(url, body);

    const userNameFromStorage: string | null = localStorage.getItem("userName");
    const parsedUserName: string | null = userNameFromStorage
      ? JSON.parse(userNameFromStorage)
      : null;

    if (parsedUserName == response.data.user.username) {
      setUserIsLoggedOne(true);
    } else {
      setUserIsLoggedOne(false);
    }

    setUserData(response.data.user);
    setUserName(response.data.user.username);
    setFullName(response.data.user.fullname);
    setBio(response.data.user.bio);
    setUserPosts(response.data.posts);
    localStorage.setItem(
      "userImage",
      JSON.stringify(response.data.user.profile)
    );
  };

  const handleEditUser = () => {
    const url = "http://localhost:4000/user";

    const body = {
      username: userName,
      fullname: fullName,
      bio: bio,
      token,
    };
    axios
      .put(url, body)
      .then((response) => {
        localStorage.setItem("userName", JSON.stringify(userName));
        console.log(response.data);
        fetchUserData();
        setModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logoutUser = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    handleUserLogged(false);
    navigate("/");
  };

  const handleChengeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);

    const image: File | null = e.target.files ? e.target.files[0] : null;

    if (!image) {
      return alert("Please Select Image");
    }

    const formData = new FormData();
    formData.append("image", image);

    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .post("http://localhost:4000/user/profile-image", formData, config)
      .then((response) => {
        console.log(response.data);
        fetchUserData();
      })
      .catch((error) => {
        return alert(error.response.data);
      });
  };

  const handleAddImage = () => {
    setAddImage(!addImage);
  };

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const handleFollowUser = () => {
    const url = "http://localhost:4000/user/follow";

    const body = {
      id: id,
      token: token,
    };

    axios
      .post(url, body)
      .then((res) => {
        alert(res.data);
        fetchUserData();
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  // searched user

  const handleShowFollowingList = async () => {
    try {
      let url = "http://localhost:4000/user/";

      const body: BodyType = {};

      if (id == "profile") {
        url += "following-alluser-token";
        body.token = token;
      } else {
        url += "following-alluser-id";
        body.id = id;
      }

      const responce = await axios.post(url, body);
      console.log(responce.data);
      setModalType("following");
      setFollowingList(responce.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowFollowerList = async () => {
    try {
      let url = "http://localhost:4000/user/";

      const body: BodyType = {};

      if (id == "profile") {
        url += "followers-alluser-token";
        body.token = token;
      } else {
        url += "followers-alluser-id";
        body.id = id;
      }

      const responce = await axios.post(url, body);
      console.log(responce.data);
      setModalType("followers");
      setFollowerList(responce.data);
    } catch (error) {
      console.log(error);
    }
  };

  //  user Unfollow

  const handleUserUnfollow = async () => {
    let url = "http://localhost:4000/user/";

    const body = {
      id: id == "profile" ? "" : id,
      token: token,
    };

    if (id === "profile") {
      url += "unfollow/token";
    } else {
      url += "unfollow/id";
    }

    axios
      .post(url, body)
      .then((res) => {
        alert(res.data.user);
        fetchUserData();
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
      });
  };

  return (
    <div style={{ width: "100%", height: "100vh", overflowY: "scroll" }}>
      <div className={classes.firstDiv}>
        <div>
          <label htmlFor="profile">
            <img
              className="mr-4"
              src={`/src/assets/image/${
                userData.profile ? userData.profile : "insta_Blank_image.jpg"
              }`}
              alt="profile"
            />
          </label>
          {userIsLoggedOne && (
            <input
              type="file"
              hidden
              id="profile"
              onChange={handleChengeImage}
            />
          )}
        </div>
        <div>
          <div>
            <span className="text-2xl">{userData.username}</span>
            {userIsLoggedOne ? (
              <>
                <button onClick={() => setModalOpen(true)}>Edit Profile</button>
                <button onClick={logoutUser}>Log Out</button>
              </>
            ) : (
              <>
                <button onClick={handleFollowUser}>Follow</button>
                <button onClick={() => navigate(`/message/${userData._id}`)}>massage</button>
              </>
            )}
          </div>
          <div>
            <span>{userData.posts ? userData.posts : 0} post</span>

            <span onClick={handleShowFollowerList}>
              {userData.followers} follower
            </span>
            <span onClick={handleShowFollowingList}>
              {userData.followings} following
            </span>
          </div>
          <div>
            <div>{userData.fullname}</div>
            <pre className={classes.bioTextBox}>{userData.bio}</pre>
          </div>
        </div>
      </div>
      <div className={classes.secondDiv}>
        <div>
          <div
            className={selectedStep == "post" ? classes.activeStep : ""}
            onClick={() => setSelectedStep("post")}
          >
            <i className="fa-solid fa-table-cells-large mr-3"></i>
            Posts
          </div>
          <div
            className={selectedStep == "reel" ? classes.activeStep : ""}
            onClick={() => setSelectedStep("reel")}
          >
            <i className="fa-solid fa-clapperboard mr-3"></i>
            Reels
          </div>
          <div
            className={selectedStep == "save" ? classes.activeStep : ""}
            onClick={() => setSelectedStep("save")}
          >
            <i className="fa-regular fa-bookmark mr-3"></i>
            Saved
          </div>
        </div>

        {userPosts.length > 0 ? (
          <div className={classes.showPost}>
            {userPosts.map((post, index) => {
              return (
                <div key={index}>
                  {post.commentOff && (
                    <div className={classes.hoverDiv}>
                      <i className="fa-solid fa-comment fa-2xl text-white"></i>
                    </div>
                  )}
                  <img
                    onClick={() => console.log(post)}
                    src={`/src/assets/image/${post.image}`}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <div className="text-center font-bold text-3xl text-gray-300">POST NOT YET</div>
          </div>
        )}
      </div>

      {/* model EditeProfile */}

      {modalOpen && (
        <div className={classes.modal}>
          <div>
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              id="username"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
            />
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
            <label htmlFor="bio">Bio</label>
            <textarea
              rows={5}
              id="bio"
              onChange={(e) => setBio(e.target.value)}
              value={bio}
            />
            <div className={classes.lastDiv}>
              <button onClick={() => setModalOpen(false)}>Close</button>
              <button onClick={handleEditUser}>Save</button>
            </div>
          </div>
        </div>
      )}

      {modalType && (
        <FollowerFollowingModal>
          <>
            <img
              src={crossIcon}
              alt="cross"
              className="absolute top-0 right-1 w-10 cursor-pointer"
              onClick={() => setModalType("")}
            />
            {modalType === "followers" ? (
              <>
                {followerList.map((follower: any, index) => (
                  <div className="flex p-3 justify-between" key={index + 1}>
                    <div className="flex">
                      <div className="mr-5">
                        <img
                          src={`/src/assets/image/${
                            follower.profile
                              ? follower.profile
                              : "insta_Blank_image.jpg"
                          }`}
                          alt="user-image"
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                      <div>
                        <p>{follower.username}</p>
                        <p className="text-gray-400">{follower.fullname}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#efefef] hover:bg-[rgb(220,220,220)] rounded"
                        onClick={handleUserUnfollow}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {followingList.map((following, index) => (
                  <div className="flex p-3 justify-between" key={index + 1}>
                    <div className="flex">
                      <div className="mr-5">
                        <img
                          src={`/src/assets/image/${
                            following.profile
                              ? following.profile
                              : "insta_Blank_image.jpg"
                          }`}
                          alt="user-image"
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                      <div>
                        <p>{following.username}</p>
                        <p>{following.fullname}</p>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-[#efefef] hover:bg-[rgb(220,220,220)] rounded"
                        onClick={handleUserUnfollow}
                      >
                        Following
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        </FollowerFollowingModal>
      )}
    </div>
  );
};

export default UserProfile;
