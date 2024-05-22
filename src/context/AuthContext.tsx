import { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextType {
  isUserLogged: boolean;
  handleUserLogged: (value: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isUserLogged: false,
  handleUserLogged: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isUserLogged, setIsUserLogged] = useState<boolean>(false);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
      setIsUserLogged(true);
    }
  },[])

  const handleUserLogged = (value: boolean) => {
    setIsUserLogged(value);
  };

  let value: AuthContextType = {
    isUserLogged,
    handleUserLogged,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
