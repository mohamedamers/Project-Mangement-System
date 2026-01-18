
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import type {
  AuthContextType,
  CurrentUserType,
  DecodedTokenPayload,
} from "../Services/AuthContextType";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [loginData, setLoginData] = useState<DecodedTokenPayload | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUserType | null>(null);

  // fetch current user
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "https://upskilling-egypt.com:3003/api/v1/Users/currentUser",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      setCurrentUser(null);
    }
  };

  // decode token
  const saveLoginData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoginData(null);
      setIsLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode<DecodedTokenPayload>(token);
      setLoginData(decoded);
    } catch {
      setLoginData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // logout
  const logOutUser = () => {
    localStorage.removeItem("token");
    setLoginData(null);
    setCurrentUser(null);
  };

  // effect on mount
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    saveLoginData();
    // ابعت الطلب فقط لو البيانات مش موجودة فعلاً
    if (!currentUser) {
      getCurrentUser();
    }
  } else {
    setIsLoading(false);
  }
}, []);


  // value to provide
  const value: AuthContextType = {
    loginData,
    setLoginData,
    saveLoginData,
    isLoading,
    currentUser,
    setCurrentUser,
    getCurrentUser,
    logOutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
