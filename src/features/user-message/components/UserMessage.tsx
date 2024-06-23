import UserMessageStyle from "../style/user-message.module.css";
import smileIcon from "../../../assets/image/smile.png";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import msgImg from "../../../assets/svg/msges.svg";

const server = io("http://localhost:4000");

interface messageArrayType {
  message: string;
  senderId: string;
  receiverId: string;
}

interface userMessage {
  username: string;
  profile: string;
}

interface ShowUserChats {
  username: string;
  profile: string;
  fullname: string;
}
[];

const UserMessage = () => {
  const [message, setMessage] = useState("");
  const [messageArray, setMessageArray] = useState<messageArrayType[]>([]);
  const [selectedUser, setSelectedUser] = useState<userMessage>();
  const [chatAllUserShow, setChatAllUserShow] = useState<ShowUserChats[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);

  const tokenFromLocalStorage = localStorage.getItem("token");
  const token: string | null = tokenFromLocalStorage
    ? JSON.parse(tokenFromLocalStorage)
    : null;

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(message);
    if (message == "") {
      return;
    }
    server.emit("sent-message", {
      message: message,
      receiverId: id,
      senderId: token,
    });
    setMessage("");
  };

  useEffect(() => {
    server.on("chats", (data) => {
      setMessageArray(data);
    });

    // server.on("show-user", (user: any) => {
    //   setUserMessages(user);
    //   console.log("userList : ", user);
    // });
  }, []);

  useEffect(() => {
    server.on("connect", () => {
      console.log(server.id);
    });
  }, []);

  const handleShowUser = () => {
    const url = "http://localhost:4000/users/chat-show-user";
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios.get(url, config).then((response) => {
        setChatAllUserShow(response.data);
        console.log(response.data);
      }).catch((error) => {
        console.error("Error fetching user chats:", error);
      });
  };7

  const handleUserClick = (user: any) => {
    handleShowUser();
    setSelectedUser(user);
    navigate(`/message/${user._id}`);
  };


  useEffect(() => {
    handleShowUser();
  }, [handleUserClick]);

  return (
    <div className="grid grid-cols-12">
      <div
        className={`xxl:col-span-4 xl:col-span-4 lg:col-span-4 md:col-span-4 sm:col-span-4 xs:col-span-12 col-span-12 border p-2 ${UserMessageStyle.mainSearch}`}
      >
        <p className="text-2xl font-bold p-2">message</p>
        <div className={`h-[90vh] py-4 ${UserMessageStyle.scrollDiv}`}>
          {chatAllUserShow.map((user: any, i: number) => (
            <div
              className="flex p-3 justify-between m-2 shadow hover:bg-slate-50 cursor-pointer"
              key={i}
              onClick={() => handleUserClick(user)}
            >
              <div className="flex">
                <div className="mr-5">
                  <img
                    src={`/src/assets/image/${
                      user.profile ? user.profile : "insta_Blank_image.jpg"
                    }`}
                    alt="user-image"
                    className="w-12 h-12 rounded-full"
                  />
                </div>
                <div>
                  <p>{user.username}</p>
                  <p className="text-gray-400">{user.fullname}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedUser ? (
        <div
          className={`xxl:col-span-8 xl:col-span-8 lg:col-span-8 md:col-span-8 sm:col-span-8 xs:col-span-12 col-span-12 border ${UserMessageStyle.mainSearch}`}
        >
          <div className="h-16 border flex items-center p-5">
            <img
              src={`/src/assets/image/${
                selectedUser?.profile
                  ? selectedUser?.profile
                  : "insta_Blank_image.jpg"
              }`}
              alt=""
              className="h-10 w-10 rounded-full mr-3"
            />
            <div className="text-2xl font-bold">{selectedUser?.username}</div>
          </div>
          {/* scroll chat */}
          <div className={`p-3 ${UserMessageStyle.scrollDiv}`}>
            {messageArray.map((msg) => {
              return (
                <div
                  className={
                    msg.receiverId != id
                      ? UserMessageStyle.left
                      : UserMessageStyle.right
                  }
                >
                  <p className={UserMessageStyle.message}>{msg.message}</p>
                </div>
              );
            })}
          </div>

          {/* input filled */}
          <form
            className="p-3 relative ml-0 h-full"
            onSubmit={handleSendMessage}
          >
            <div className="border p-3 border-gray-300 pr-14 rounded-full h-11">
              <textarea
                placeholder="Massage..."
                className={`w-full pl-10 text-black h-full outline-none resize-none ${
                  message ? "overflow-y-auto" : "overflow-y-hidden"
                } overflow-hidden`}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              ></textarea>
            </div>
            <img
              src={smileIcon}
              alt="Smile"
              className="w-8 absolute left-5"
              style={{ top: "18px" }}
            />
            <button
              type="submit"
              className="absolute top-5 right-8 text-blue-400"
            >
              send
            </button>
          </form>
        </div>
      ) : (
        <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 md:col-span-8 sm:col-span-8 xs:col-span-8 col-span-8 m-auto">
          <div className="text-center">
            <div className="flex justify-center justify-items-center my-4">
              <img src={msgImg} alt="" className="w-24 h-24" />
            </div>
            <p className="text-xl font-bold">Your messages</p>
            <p className="my-4">Send a message to start a chat.</p>
            <button
              type="button"
              className="px-6 rounded-lg py-2 border bg-[#0095f6] text-white font-semibold"
            >
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMessage;
