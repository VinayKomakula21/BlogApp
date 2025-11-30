import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Moon, User, LogOut, PenSquare } from "lucide-react";
import { useAuthStore } from "@/modules/auth/store";
import { useUIStore } from "@/modules/app/store/ui-store";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);

  const { isAuthenticated, user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  const storedUsername = localStorage.getItem("username");
  const validStoredUsername = storedUsername && storedUsername !== "undefined" ? storedUsername : null;
  const username = user?.userName || user?.username || validStoredUsername || "User";

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogout = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleSignIn = () => {
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <button
            onClick={() => navigate("/")}
            className="text-foreground text-xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            BlogSphere
          </button>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <Link to="/create">
                <Button variant="default" size="sm" className="gap-2">
                  <PenSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full text-foreground hover:text-foreground hover:bg-accent"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <div className="relative" ref={avatarRef}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </Button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-lg shadow-lg py-2 z-20 border border-border">
                  <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                    {isAuthenticated ? `Signed in as ${username}` : "Guest"}
                  </div>

                  {!isAuthenticated && (
                    <button
                      onClick={handleSignIn}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Sign In
                    </button>
                  )}

                  {isAuthenticated && (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
