import React from "react"
import {useLocation, useNavigate} from "react-router-dom";  
import Navbar from "./Navbar";

const About = () => {
    return ( 
        <div className="about">
            <Navbar/>
            <div>
                <h1>About</h1>
            </div>
        </div>
     );
}
 
export default About;