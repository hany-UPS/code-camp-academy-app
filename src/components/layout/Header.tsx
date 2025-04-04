
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu } from "lucide-react";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <span className="text-academy-orange font-bold text-2xl">UPS</span>
            <span className="text-academy-blue font-bold text-2xl">Junior</span>
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="block md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-academy-orange transition-colors">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={isAdmin() ? "/admin-dashboard" : "/student-dashboard"} 
                className="text-gray-700 hover:text-academy-orange transition-colors"
              >
                Dashboard
              </Link>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">
                  {user?.name} ({user?.role})
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500"
                >
                  <LogOut size={18} className="mr-1" /> Logout
                </Button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline">Log In</Button>
            </Link>
          )}
        </nav>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-md slide-in">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-academy-orange transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to={isAdmin() ? "/admin-dashboard" : "/student-dashboard"} 
                  className="text-gray-700 hover:text-academy-orange transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <div className="pt-2 border-t border-gray-100">
                  <div className="text-gray-600 mb-2">
                    {user?.name} ({user?.role})
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <LogOut size={18} className="mr-1" /> Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setMenuOpen(false)}
                className="inline-block"
              >
                <Button variant="outline">Log In</Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
