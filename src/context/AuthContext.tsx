
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  phone?: string;
  assignedCourses?: string[];
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored auth data on component mount
    const storedUser = localStorage.getItem("academyUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock users - in real app this would be verified against a backend
  const mockUsers = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin" as const
    },
    {
      id: "2",
      name: "Student User",
      email: "student@example.com",
      password: "password123",
      role: "student" as const,
      phone: "1234567890",
      assignedCourses: ["1", "2"]
    }
  ];

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("academyUser", JSON.stringify(userWithoutPassword));
      toast({
        title: "Login successful!",
        description: `Welcome back, ${userWithoutPassword.name}!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
    
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("academyUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
