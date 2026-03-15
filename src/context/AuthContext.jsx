import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userLogin, setuserLogin] = useState(null);
  const [userId, setuserId] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setuserLogin(localStorage.getItem("userToken"));
    }
  }, []);

  useEffect(() => {
    if (userLogin) {
      const decoded = jwtDecode(userLogin);
      setuserId(decoded.user);
    } else {
      setuserId(null);
    }
  }, [userLogin]);

  return (
    <AuthContext.Provider value={{ userLogin, setuserLogin, userId }}>
      {children}
    </AuthContext.Provider>
  );
}