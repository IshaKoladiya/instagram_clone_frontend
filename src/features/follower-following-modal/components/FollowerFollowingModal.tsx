import { ReactNode } from "react";
import FollowerFollowingStyle from "../style/follower-following-style.module.css";

interface FollowerFollowingModalProps {
    children: ReactNode;
  }

const FollowerFollowingModal: React.FC<FollowerFollowingModalProps> = ({children}) => {
  return (
    <>
      <div className={FollowerFollowingStyle.modal}>
        <div>{children}</div>
      </div>
    </>
  );
};

export default FollowerFollowingModal;
