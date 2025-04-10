
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { isAuthenticated, logout, isAdmin, isTeacher } = useAuth();

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-academy-blue">
          Academy
        </Link>

        <nav>
          <ul className="flex items-center space-x-6">
            <li>
              <Link to="/" className="hover:text-academy-blue transition-colors">
                Home
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                {isAdmin() ? (
                  <>
                    <li>
                      <Link
                        to="/admin-dashboard"
                        className="hover:text-academy-blue transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  </>
                ) : isTeacher() ? (
                  <li>
                    <Link
                      to="/teacher-dashboard"
                      className="hover:text-academy-blue transition-colors"
                    >
                      Teacher Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/student-dashboard"
                      className="hover:text-academy-blue transition-colors"
                    >
                      Student Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="hover:text-academy-blue transition-colors"
                >
                  Login/Signup
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
