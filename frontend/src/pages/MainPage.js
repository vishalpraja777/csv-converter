import React from "react"
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import './main.css';
import bg from './images/bg.webp'
import start from './images/started.webp'

const MainPage = () => {
    return ( 
        <div>
            <Navbar/>

            <div class="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed" 
             style={{ backgroundImage: `url(${bg})` }}>
                <div class="h-full  w-full text-6xl  text-gray-900 font-serif pt-20 px-20"> 
        <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
        <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p>
         
           <p class="text-justify  bg-b bg-blend-color-burn text-lg bg-black text-white font-serif  ml-96 pt-4 px-4 py-8  border-spacing-2 border-x-white">Welcome to our CSV conversion tool,the perfect solution for those who need to convert CSV 
           files into XML or JSON formats quickly and efficiently. With our user-friendly interface, 
           you can convert your files in just a few clicks, saving you time and effort. We understand that converting
            files can be a tedious process, but with our automated tool, you can streamline your workflow and focus on what
             really matters. Whether you're a business owner or a data analyst, our tool will help you make the most out of your data.Our mapping feature ensures that your data is accurately transformed
             according to your specifications. You can choose between internal and external mapping to tailor the conversion to your 
             specific needs.With internal mapping, you can create a custom map that maps your CSV data to the desired XML or JSON structure. External Mapping is ideal
             for those who prefer to use a pre-defined mapping structure.
           </p>
           </div>
           <div class=" flex justify-end py-8">
           <button class="  bg-black text-white  font-semibold mr-10 text-3xl italic flex p-3 rounded-3xl hover:bg-gray-800 active:bg-slate-200">
           <Link to='/homepage'>Get Started</Link>
             <img src={start}  class="h-10 rounded-full" alt="" sizes=" " srcset=""/>
           </button> 
         </div>
           <div class="py-3"></div>
        
          

          </div>
 
        </div>
     );
}
 
export default MainPage;