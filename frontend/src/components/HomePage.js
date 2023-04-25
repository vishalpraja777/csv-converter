import React from "react"
import {useLocation, useNavigate, Link} from "react-router-dom";  
import Navbar from "./Navbar";

const HomePage = () => {
    return ( 
        <div className="homepage">
            <Navbar/>
            <div>
                <h1>Homepage</h1>
                <div className="homeContent">
                    <div className="homeChild">
                        <h2>Use existing mapping</h2>
                        <Link to='/usemap' className='btnU'>Upload Files</Link>
                    </div>
                    <div className="homeChild">
                        <h2>Create a mapping</h2>
                        <Link to='/createmap' className='btnU'>Upload Files</Link>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default HomePage;