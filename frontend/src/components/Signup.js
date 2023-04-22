import React,{ useEffect, useState } from "react"
// import axios form "axios"   
import {useNavigate, Link} from "react-router-dom";  

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    async function submit(e){
        e.preventDefault();

        try{

        }
        catch{

        }
    }

    return ( 
        <div className="signup">
            <div className="content">
            <h1 className="form-title">Register</h1>
            <form action="POST">
                <div className="innerContent">
                <div className="form-holder">
                    <input type="text" onChange={(e) =>{setUsername(e.target.value)}} placeholder="Username" className="input"/>
                    <input type="email" onChange={(e) =>{setEmail(e.target.value)}} placeholder="Email" className="input"/>
                    <input type="password" onChange={(e) =>{setPassword(e.target.value)}} placeholder="Password" className="input"/>
                </div>
                    <input type="submit" onClick={submit} value="Register" className="submit-btn"/>
                </div>
                </form>
            <p className="user">Old User? <span><Link to="/" className="user-link">Login</Link></span></p> 
            </div>
        </div>
     );
}
 
export default Signup;