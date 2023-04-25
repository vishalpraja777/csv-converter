import React from "react"
import Navbar from "./Navbar";
import HomePage from "./HomePage";
// import {useLocation, useNavigate} from "react-router-dom";  
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Dashboard = () => {
    return ( 
        <div>
            <Navbar/>
            <div>
                <h1>Dashboard</h1>
            </div>
        </div>
     );
}
 
export default Dashboard;