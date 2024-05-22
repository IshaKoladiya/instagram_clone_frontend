import { Route, Routes } from "react-router-dom";
import { LogIn } from "../../features/log-in/pages";
import { SignUp } from "../../features/sign-up/pages";
import { ForgotPassword } from "../../features/forgot-password/pages";
import { NewPassword } from "../../features/new-password/pages";

const LogInRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  );
};

export default LogInRoutes;
