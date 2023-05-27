import {useNavigate} from "react-router-dom";  
import Navbar from "./Navbar";
import jwtDecode from "jwt-decode";

const Profile = () => {

    // const [user, setUser] = useState();

    const userToken = localStorage.getItem('token')

        const userDecode = jwtDecode(userToken)
        // setUser(userDecode)
        console.log(userDecode)

    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault()
        window.localStorage.clear()
        alert("Logged Out")
        navigate('/')
    }

    return ( 
        <div className="profile">
            <Navbar/>
            <div className="profileContent">
                <h1>Profile</h1>
                <p>Name: {userDecode.name}</p>
                <p>Email: {userDecode.email}</p>
                <button onClick={logout} className="btn" style={{width:"25%"}}>Logout</button>
            </div>
        </div>
     );
}
 
export default Profile;