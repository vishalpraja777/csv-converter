import React from "react";
// import jwtDecode from "jwt-decode"
import { Link } from "react-router-dom";

const Navbar = () => {

    const userToken = localStorage.getItem('token')

    // if (userToken) {
    //     const user = jwtDecode(userToken)
    //     console.log(user)
    // }

    return (
        <nav className="navbar">
            <h1 className="heading">CSV Converter</h1>
            <div className="links">
                <ul>
                    <li><Link to='/' className="link">Home</Link></li>
                    <li><Link to='/convertedfiles' className="link">Converted Files</Link></li>
                    <li><Link to='/about' className="link">About</Link></li>
                    {userToken && <li><Link to='/profile' className="link">Profile</Link></li>}
                    {!userToken && <li><Link to='/login' className="link">Login</Link></li>}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;