import { useState, useRef, useEffect } from "react";
import { Settings, Ticket, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserMenu = ({ user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();


  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    };

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);



  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-semibold"
      >
        {user?.name?.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border overflow-hidden">

        
          <div className="p-4 border-b">
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>

          
          <div className="flex flex-col text-sm">

            <button
              onClick={() => navigate("/account")}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <Settings size={18} /> Manage Account
            </button>

            <button
              onClick={() => navigate("/my-bookings")}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <Ticket size={18} /> My Bookings
            </button>

            <button
              onClick={logoutUser}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-500"
            >
              <LogOut size={18} /> Sign Out
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default UserMenu;
