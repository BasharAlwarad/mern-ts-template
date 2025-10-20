/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState } from 'react';

// Teaching material: using `any` for simplicity; replace with proper types later
const UserContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = (userData: any) => {
    setLoading(true);
    setUser(userData);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  const value: any = { user, setUser, users, setUsers, loading, login, logout };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Export context for consumption in a separate hook file
export { UserContext };
