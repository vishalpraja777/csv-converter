import React,{ useState } from "react"
import {useNavigate, Link} from "react-router-dom";  

const Login = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    async function loginUser(event) {

    event.preventDefault()

    // Making a POST fetch request
    const response = await fetch('http://localhost:1337/api/login', {
        method: 'POST',
        headers: {
        'Content-type': 'application/json'
        },
        body: JSON.stringify({
        email, password
        }),
    })

    //getting the response from server
    const data = await response.json()
    if(data.user) {
        localStorage.setItem('token', data.user);
        localStorage.setItem('userid', data.id);
        console.log(localStorage.getItem('userid'))
        alert('Login Successful')
        // window.location.href = '/quote'
        navigate('/')
    } else {
        alert('Please check username and password')
    }
  }


    return ( 
        <div className="login">
            <div className="content">
            <h1 className="form-title">Login</h1>
            <form onSubmit={loginUser}>
                <div className="innerContent">
                <div className="form-holder">
                    <input type="email" onChange={(e) =>{setEmail(e.target.value)}} placeholder="Email" className="input"/>
                    <input type="password" onChange={(e) =>{setPassword(e.target.value)}} placeholder="Password" className="input"/>
                </div>
                    <input type="submit" value="Login" className="btn"/>
                </div>
                </form>
            <p className="user">New User? <span><Link to="/register" className="user-link">SignUp</Link></span></p>
            </div>
        </div>
     );
}
 
export default Login;