import React from "react"
import {useLocation, useNavigate} from "react-router-dom";  
import Navbar from "./Navbar";
import './About.css';
import bg from './images/bg.webp'
import img2 from './images/chat.png'
import img3 from './images/phone.jpg'
import img4 from './images/email.jpg'
import img5 from './images/address.png'

const contact = () => {
    return ( 
        <div >
            <Navbar/>
            <div className="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed" 
             style={{ backgroundImage: `url(${bg})` }}>

            <div class="h-full  w-full text-6xl  text-gray-900 font-serif pt-10 px-20">

                <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
        <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p>
        <div class = "flex ml-96 px-80 space-x-4 ">
        <h1 class="text-justify   text-3xl  text-black font-bold py-4 "> Contact  Us</h1>
        <img src={img2}  class=" h-12 " alt="" sizes="" srcset=""/>
         </div>
         <p class="text-justify   text-lg  text-black font-serif  ml-96  px-16   border-x-white">"Reach out to us and let's connect for all your inquiries, feedback, or collaborations!"</p>
         <div class = "flex pt-28 space-x-24"> 
           <h1 class="text-justify  text-2xl font-semibold bg-black  text-white font-serif  ml-96  px-16 py-4  flex border-x-white">Phone
        
           <img src={img3}  class=" h-12 rounded-full px-2.5" alt="" sizes="" srcset=""/></h1>
           <h1 class="text-justify flex bg-black  text-2xl font-semibold  text-white font-serif  ml-96  px-16 py-4  border-spacing-2 border-x-white"> Email
           <img src={img4}  class=" h-12 rounded-full px-2" alt="" sizes="" srcset=""/>
        </h1>
        <h1 class="text-justify bg-black flex text-2xl font-semibold  text-white font-serif  ml-96  px-24 py-4  border-spacing-2 border-x-white"> Address
        <img src={img5}  class=" h-12 rounded-full px-1.5" alt="" sizes="" srcset=""/></h1>
        </div>
        <div class = "flex space-x-24"> 
           <h1 class="text-justify  text-lg bg-black  text-white font-serif  ml-96  px-14 py-4   border-x-white">Ph:-7754362435
        </h1>
           <h1 class="text-justify flex bg-black  text-lg  text-white font-serif  ml-96  px-14 py-4  border-spacing-2 border-x-white"> xyz@gmail.com
        </h1>
        <h1 class="text-justify bg-black text-lg  text-white font-serif  ml-96  px-6 py-4  border-spacing-2 border-x-white"> Cambridge institute of technology
        <p> Kr Puram </p>
        <p > Bangalore -560036 </p> 
        </h1>
        </div>
        <div class= "py-10">
            </div>
        </div>
        </div>
        </div>
     );
}
 
export default contact;