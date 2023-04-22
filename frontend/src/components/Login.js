import React,{ useEffect, useState } from "react"
import axios from 'axios'
import {useNavigate, Link} from "react-router-dom";  

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submit(e){
        e.preventDefault();

        try{

        }
        catch{

        }
    }

    return ( 
        <div className="login">
            <div className="content">
            <h1 className="form-title">Login</h1>
            <form action="POST">
                <div className="innerContent">
                <div className="form-holder">
                    <input type="email" onChange={(e) =>{setEmail(e.target.value)}} placeholder="Email" className="input"/>
                    <input type="password" onChange={(e) =>{setPassword(e.target.value)}} placeholder="Password" className="input"/>
                </div>
                    <input type="submit" onClick={submit} value="Login" className="submit-btn"/>
                </div>
                </form>
            <p className="user">New User? <span><Link to="/signup" className="user-link">SignUp</Link></span></p>   
            <p>Hello</p>
            </div>
        </div>
     );
}
 
export default Login;