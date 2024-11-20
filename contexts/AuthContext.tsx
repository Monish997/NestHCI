import { createContext, useContext, useState } from "react";
import { ReactNode } from "react";

interface AuthContextType {
  user: any;
  setAuthUser: (authUser: any) => void;
  setUserData: (userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);

  const setAuthUser = (authUser) => {
    setUser(authUser);
  };
  const setUserData = (userData) => {
    setUser({ ...userData });
  };

  return (
    <AuthContext.Provider value={{ user, setAuthUser, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
