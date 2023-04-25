import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h1>CSV Converter</h1>
            <div className="links">
                <ul>
                    <li><Link to='/homepage' className="link">Home</Link></li>
                    <li><Link to='/about' className="link">About</Link></li>
                    <li><Link to='/profile' className="link">Profile</Link></li>
                </ul>
            </div>
        </nav>
     );
}
 
export default Navbar;