import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";



const AdminNavbar = () => {

    return (
        <div className="flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30">
            <Link to='/' className='max-md:flex-1 flex items-center font-bold text-3xl'>
                <img src={assets.logo} alt="" className='w-10 h-auto' />
                MovieHunt
            </Link>
        </div>
    )
}


export default AdminNavbar