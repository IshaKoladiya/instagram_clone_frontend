import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchModuleStyle from "../style/user-search-style.module.css";

const UserSearch = () => {
  const navigate = useNavigate();
  const [userSearched, setUserSearched] = useState<
    {
      profile: string;
      fullname: string;
      username: string;
      _id: string;
    }[]
  >([]);

  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = `http://localhost:4000/users?search=${e.target.value}`;

    axios
      .get(url)
      .then((res) => {
        console.log(res.data);
        setUserSearched(res.data);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  console.log(userSearched, "userSearched");

  return (
    <>
      <div
        className={`w-[40%] h-[100vh] border p-5 font-bold ${searchModuleStyle.mainSearch}`}
      >
       <div>
         <h1 className="text-3xl pb-10 mt-2">Search</h1>
        <input
          type="search"
          placeholder="Search"
          className="w-[100%] outline-none bg-[#efefef] p-3 ps-4 rounded-md"
          onChange={handleUserSearch}
        />

       </div>
        {/* find user */}

        <div className={`my-5  ${searchModuleStyle.searchedData}`}>
          <hr />
          {userSearched.length > 0 ? (
            userSearched.map((user, i) => (
              <div
                key={i}
                className="flex gap-4 my-2 cursor-pointer p-2 hover:bg-[rgb(239,239,239)]"
                onClick={() => navigate(`/${user._id}`)}
              >
                <img
                  src={`/src/assets/image/${
                    user.profile ? user.profile : "user_image.jpg"
                  }`}
                  className="w-12 h-12 rounded-full"
                  alt="user"
                />
                <div>
                  <p>{user.username}</p>
                  <p>{user.fullname}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              <p className="py-5">Recent</p>
              <div className="flex justify-center items-center h-[50vh]">
                <p className="text-gray-400">No user found</p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSearch;
