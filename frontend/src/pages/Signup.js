import React,{ useState } from "react"
// import axios form "axios"   
import {useNavigate, Link} from "react-router-dom";  


const Signup = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUsername] = useState('');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');

    const navigate = useNavigate();

    async function registerUser(e) {
        e.preventDefault()

        if(!email || !userName){
            alert('Enter details')
            return
        }

        if(email && userName && password.length < 8){
            alert('Password should be atleast 8 characters')
            return
        }

        const response = await fetch('http://localhost:1337/api/register', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                userName, firstName, lastName, email, password
            })
        })

        const data = await response.json();

        if(data.status === 'ok'){
            navigate('/login', { replace: true })
        } 
        if(data.status === 'error') {
            alert('User already exists')
        }
        console.log("Response:" + response)
    }
    

    return ( 
        <div class= "ml-96 mt-28 mb-28 mr-96 flex">
            <div className="content">
            <h1 className="form-title">Register</h1>
            <form onSubmit={registerUser}>
                <div className="innerContent">
                <div className="form-holder">
                    <input type="text" onChange={(e) =>{setUsername(e.target.value)}} placeholder="Username" className="input"/>
                    <input type="text" onChange={(e) =>{setFirstname(e.target.value)}} placeholder="Firstname" className="input"/>
                    <input type="text" onChange={(e) =>{setLastname(e.target.value)}} placeholder="Lastname" className="input"/>
                    <input type="email" onChange={(e) =>{setEmail(e.target.value)}} placeholder="Email" className="input"/>
                    <input type="password" onChange={(e) =>{setPassword(e.target.value)}} placeholder="Password" className="input"/>
                </div>
                    <input type="submit" value="Register" className="btn"/>
                </div>
                </form>
            <p className="user">Old User? <span><Link to="/login" className="user-link">Login</Link></span></p> 
            </div>
        </div>
     );
}
 
export default Signup;