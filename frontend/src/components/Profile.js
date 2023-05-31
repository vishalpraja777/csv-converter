import {useNavigate} from "react-router-dom";  
import Navbar from "./Navbar";
import jwtDecode from "jwt-decode";
import './About.css';
import bg from './images/bg.webp'
import profile from './images/profile.jpg'
import { useEffect } from "react";
import { useState } from "react";

const Profile = () => {

    const [userData, setUserData] = useState();

    const userToken = localStorage.getItem('token')

    useEffect(() => {
        console.log(localStorage.getItem('userid'))
        fetch(`http://localhost:1337/api/getuserdata/${localStorage.getItem('userid')}`)
            .then((response) => {
                const reader = response.body.getReader();
                console.log(reader)
                reader.read().then(({ done, value }) => {
                    if (done) {
                        console.log('end...')
                        return;
                    }
                    const decoder = new TextDecoder();
                    const strData = decoder.decode(value)
                    console.log(strData)

                    const jsonData = JSON.parse(strData)
                    console.log(jsonData)
                    setUserData(jsonData)
                });
            })
    }, [])

        const userDecode = jwtDecode(userToken)
        // setUser(userDecode)
        // console.log(userDecode)

    const navigate = useNavigate();

    const logout = (e) => {
        e.preventDefault()
        window.localStorage.clear()
        alert("Logged Out")
        navigate('/')
    }

    return ( 
        <div >
            <Navbar/>
            <div class="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed" 
             style={{ backgroundImage: `url(${bg})` }}>
                <div class="h-full  w-full  pt-10 px-20">

                <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
                <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p>
            <div class=" flex justify-center py-8 mt-36 ml-72 space-x-6">
                <img src={profile} class="h-60 rounded-full px-1 py-1" alt="" sizes=" " srcset="" />
                 <div class="">
                <h1 class = "font-bold font-sans text-3xl">Profile</h1>
                <p class = "bg-black text-white text-lg px-2 py-2 mt-3">User Name: {userData?.username}</p>
                <p class = "bg-black text-white text-lg px-2 py-2">First Name: {userData?.firstname}</p>
                <p class = "bg-black text-white text-lg px-2 py-2">Last Name: {userData?.lastname}</p>
                <p class = "bg-black text-white text-lg px-2 py-2">Email: {userData?.email}</p>
                <button class=" text-white bg-black mt-10 mb-2 ml-20 font-semibold  text-3xl italic flex p-3 rounded-3xl hover:bg-gray-400 active:bg-slate-200" onClick={logout}  > Logout</button>
                </div>
            </div>
            </div>
            </div>
        </div>
     );
}
 
export default Profile;