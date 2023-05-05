import React from "react"
import {useLocation, useNavigate, Link} from "react-router-dom";  
import Navbar from "../components/Navbar";

const HomePage = () => {

    const userToken = localStorage.getItem('token')
    console.log("Token: " + userToken)

    const navigate = useNavigate();

    const handleUseMap = (e) => {
        e.preventDefault()
        if(!userToken){
            alert('Login To Use')
            return
        }
        navigate('/usemap')
    }

    const handleCreateMap = (e) => {
        e.preventDefault()
        if(!userToken){
            alert('Login To Use')
            return
        }
        navigate('/createmap')
    }

    return ( 
        <div className="homepage">
            <Navbar/>
            <div>
                <h1>Homepage</h1>
                <div className="homeContent">
                    <div className="homeChild">
                        <h2>Use existing mapping</h2>
                        <button onClick={ handleUseMap } className='btnU'>Upload Files</button>
                        {/* <Link to='/usemap' className='btnU'>Upload Files</Link> */}
                    </div>
                    <div className="homeChild">
                        <h2>Create a mapping</h2>
                        <button onClick={ handleCreateMap } className='btnU'>Upload Files</button>
                        {/* <Link to='/createmap' className='btnU'>Upload Files</Link> */}
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default HomePage;