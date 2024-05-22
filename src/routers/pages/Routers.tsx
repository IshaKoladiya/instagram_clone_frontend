import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import LogInRoutes from "../component/LogInRoutes";
import UserRoutes from "../component/UserRoutes";


const Routers = () => {
  const { isUserLogged} = useContext(AuthContext);

  return isUserLogged ? <UserRoutes/> : <LogInRoutes/>;
};

export default Routers;
