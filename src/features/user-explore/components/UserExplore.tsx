import { useEffect, useState } from "react";
import classes from "../style/user-explore.module.css";
import axios from "axios";


interface Post {
  post: {
    image: string;
  };
}

const UserExplore = () => {
  const [usersPosts, setUsersPosts] = useState<Post[]>([]);


  const fetchUsersPosts = () => {
    const url = "http://localhost:4000/users/explore";

    axios
      .get(url)
      .then((res) => {
        setUsersPosts(res.data);
        console.log(res.data)
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    fetchUsersPosts();
  }, []);



  return (
    <>
      <div className={classes.explore}>
      <div className={classes.gridContainer}>
        {usersPosts.map((value, index) => (
          <div
            key={index}
            className={index % 6 == 0 ? classes.spanning : classes.gridItem}
          >
            <div className={classes.hoverDiv}>
              <div>
                <i className="fa-solid fa-heart fa-md"></i>
                10
              </div>
              <div>
                <i
                  className="fa-solid fa-comment fa-md"
                  style={{ transform: "rotateY(180deg)" }}
                ></i>
                10
              </div>
            </div>
            <img src={`/src/assets/image/${value.post.image}`} alt="" />
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default UserExplore;
