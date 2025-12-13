import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";



const AdminNavbar = () => {

    const navigate = useNavigate()


    const handleLogOut = () => {
        localStorage.removeItem("adminToken")
        // localStorage.removeItem("token")
        localStorage.removeItem("user")


        navigate("/admin/auth")
    }

    return (
        <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
            <Link to='/' className='max-md:flex-1 flex items-center font-bold text-3xl'>
                <img src={assets.logo} alt="" className='w-10 h-auto' />
                MovieHunt
            </Link>

            <button onClick={handleLogOut} className="px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer">
                Log Out
            </button>
        </div>
    )
}


export default AdminNavbar