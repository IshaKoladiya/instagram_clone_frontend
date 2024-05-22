import { useEffect, useState } from "react";
import classes from "../style/user-dashbord.module.css";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  profile: string;
}

interface Post {
  _id: string;
  image : string;
  userId: string;
  postImage: string;
  caption: string;
  likeViewCount: number;
  commentOff: boolean;
}
 
interface UserPost {
  user: User;
  post: Post;
}

const UserDashbord = () => {

  const [usersPosts, setUsersPosts] = useState<UserPost[]>([]);

  const tokenFromLocalStorage = localStorage.getItem("token");
  const token: string | null = tokenFromLocalStorage
    ? JSON.parse(tokenFromLocalStorage)
    : null;

  const fetchUsersPosts = () => {
    const url = "http://localhost:4000/users/posts";

    const body = {
      token:token
    };

    axios
      .post(url, body)
      .then((res) => {
        console.log(res.data)
        setUsersPosts(res.data);
      })
      .catch((err) => {
        alert(err.response.data);
      });
  };

  useEffect(() => {
    fetchUsersPosts();
  }, []);

  return (
    <div className={classes.dashboard}>
    <div>Stories</div>
    <div className={classes.posts}>
      {usersPosts.map((item) => {
        return (
          <div key={item.post._id}>
            <div className={classes.singlePost}>
              <div>
                <div className={classes.leftSide}>
                  <div className={classes.userImage}>
                    <img
                      src={`/src/assets/image/${item.user.profile ? item.user.profile : "user_image.jpg"}`}
                      alt=""
                    />
                  </div>
                  <div>
                    {item.user.username} <span>.</span> 2d
                  </div>
                </div>
                <div className={classes.rightSide}>
                  <i className="fa-solid fa-ellipsis fa-lg"></i>
                </div>
              </div>
              <div className={classes.postImage}>
                <img src={`/src/assets/image/${item.post.image}`} alt="" />
              </div>
              <div className={classes.allIcons}>
                <div>
                  <i className="fa-regular fa-heart fa-xl"></i>
                  <i
                    className="fa-regular fa-comment fa-xl"
                    style={{ transform: "rotateY(180deg)" }}
                  ></i>
                  <i className="fa-regular fa-paper-plane fa-xl"></i>
                </div>
                <div>
                  <i className="fa-regular fa-bookmark fa-xl"></i>
                </div>
              </div>
              <div className={classes.postsDetails}>
                {item.post.likeViewCount && (
                  <div className={classes.likeCount}>123,244,556 likes</div>
               )} 
                {item.post.caption && (
                  <div className={classes.caption}>
                   {item.user.username} <span>{item.post.caption}</span>
                  </div>
               )}
                {item.post.commentOff && (
                  <div className={classes.commentCount}>
                    View all 17 comment
                  </div>
                )}
              </div>
            </div>
          </div>
       );
       })}
    </div>
  </div>
  )
}

export default UserDashbord
