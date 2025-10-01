"use client";
import { UserInterface } from "../types";
import React, { createContext, useState, useContext, ReactNode } from "react";

// Create a context for user authentication
const UserContext = createContext<{
  user: UserInterface;
  setUser: React.Dispatch<React.SetStateAction<UserInterface>>;
} | null>(null);

// UserProvider component to wrap the application
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInterface>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
