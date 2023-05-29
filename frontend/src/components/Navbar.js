import React from "react";
// import jwtDecode from "jwt-decode"
import { Link } from "react-router-dom";
import img1 from './images/lo.jpg'


const Navbar = () => {

    const userToken = localStorage.getItem('token')

    // if (userToken) {
    //     const user = jwtDecode(userToken)
    //     console.log(user)
    // }

    return (
        <nav className="navbar" class= "bg-black text-white py-2 pt-2 mix-blend-hard-light flex justify-between ">
           <img src={img1} class=" mix-blend-hard-light h-16 pt-0 px-2 py-1 " alt="" sizes="" srcset=""/>
            <div className="links " class="px-20 py-4 fl>ex space-x-7 justify-end">
                    <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/' className="link">Home</Link></button>
                    <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/about' className="link">About</Link></button>
                    <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/contact' className="link">Contact Us</Link></button>
                    <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/convertedfiles' className="link">Converted Files</Link></button>
                    <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/editmapping' className="link">Edit Mapping</Link></button>
                    {userToken && <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/profile' className="link">Profile</Link></button>}
                    {!userToken && <button class="cursor-pointer hover:underline  active:text-slate-600"><Link to='/login' className="link">Login</Link></button>}
            </div>
        </nav>
    );
}
export default Navbar;