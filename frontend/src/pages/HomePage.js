import React from "react"
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import jwtDecode from "jwt-decode";
import './main.css';
import bg from './images/bg.webp'

const HomePage = () => {

    const userToken = localStorage.getItem('token')
    console.log("Token: " + userToken)

    if (userToken) {
        const userDecode = jwtDecode(userToken)
        console.log(userDecode)
    }

    const navigate = useNavigate();

    const handleUseMap = (e) => {
        e.preventDefault()
        if (!userToken) {
            alert('Login To Use')
            return
        }
        navigate('/usemap')
    }

    const handleCreateJsonMap = (e) => {
        e.preventDefault()
        if (!userToken) {
            alert('Login To Use')
            return
        }
        navigate('/createjsonmap')
    }

    const handleCreateXmlMap = (e) => {
        e.preventDefault()
        if (!userToken) {
            alert('Login To Use')
            return
        }
        navigate('/createxmlmap')
    }

    return (
        <div className="homepage">
            <Navbar />

            <div className="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url(${bg})` }}>
                <div class="h-full  w-full text-6xl  text-gray-900 font-serif pt-20 px-20">
                    <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
                    <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p></div>

                <div class="  ml-96 pt-4 px-24 flex w-3/4 align-middle" >
                    <div className="homeChild">
                        <h2 class=" font-bold text-2xl italic">Use Existing Mapping</h2>
                        <button onClick={handleUseMap} className='btnU'>Upload Files</button>
                        {/* <Link to='/usemap' className='btnU'>Upload Files</Link> */}
                    </div>
                    <div className="homeChild">
                        <h2 class=" font-bold text-2xl italic">Create New Mapping</h2>
                        <div className="btnDiv">
                            <button onClick={handleCreateJsonMap} className='btnUD'>Create JSON Map</button>
                            <button onClick={handleCreateXmlMap} className='btnUD'>Create XML Map</button>
                            {/* <Link to='/createmap' className='btnU'>Upload Files</Link> */}
                        </div>
                    </div>
                </div>
                <div class="py-2"></div>
            </div>
        </div>
    );
}

export default HomePage;