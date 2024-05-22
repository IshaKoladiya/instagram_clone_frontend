import { Navigate, Route, Routes } from "react-router-dom";
import { SideMenu, UserDashbord } from "../../features/user-dashbord/pages";
import { UserProfile } from "../../features/user-profile/pages";
import { UserSearch } from "../../features/user-search/pages";
import { UserNotification } from "../../features/user-notification/pages";
import { UserMassage } from "../../features/user-message/pages";
import { UserExplore } from "../../features/user-explore/pages";
import { UserReels } from "../../features/user-reels/pages";

const UserRoutes = () => {
  return (
    <>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 4fr",
        alignItems: "start",
      }}
    >
    <SideMenu/>
      <Routes>
        <Route path="/" element={<UserDashbord/>} />
        <Route path="/search" element={<UserSearch/>} />
        <Route path="/explore" element={<UserExplore/>} />
        <Route path="/reels" element={<UserReels/>} />
        <Route path="/message/:id" element={<UserMassage/>} />
        <Route path="/message" element={<UserMassage/>} />
        <Route path="/notification" element={<UserNotification/>} />
        <Route path="/:id" element={<UserProfile/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </div>
    </>
  );
};

export default UserRoutes;
