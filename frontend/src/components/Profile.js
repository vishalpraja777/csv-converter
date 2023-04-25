import React from "react"
import {useLocation, useNavigate} from "react-router-dom";  
import Navbar from "./Navbar";

const Profile = () => {
    return ( 
        <div className="profile">
            <Navbar/>
            <div>
                <h1>Profile</h1>
            </div>
        </div>
     );
}
 
export default Profile;