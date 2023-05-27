import React from "react"
import {useLocation, useNavigate} from "react-router-dom";  
import Navbar from "./Navbar";
import './About.css';
import bg from './images/bg.webp'


const About = () => {
    return ( 
        <div >
            <Navbar/>
            <div className="w-full h-1/4 bg-no-repeat bg-cover bg-center bg-fixed" 
             style={{ backgroundImage: `url(${bg})` }}>

            <div class="h-full  w-full text-6xl  text-gray-900 font-serif pt-10 px-20">

                <p class="text-6xl text-gray-900 font-serif pt-10 px-20"> CSV Conversion</p>
        <p class="px-36 text-6xl text-gray-900 font-serif "> Tool</p>
        <h1 class="text-justify   text-3xl  text-black px-96 font-bold ml-96 py-8"> About US </h1>
         
           <p class="text-justify bg-black  text-lg  text-white font-serif  ml-96  px-4 py-2   border-x-white">Welcome to our CSV conversion tool,the perfect solution for those who need to convert CSV 
           files into XML or JSON formats quickly and efficiently. With our user-friendly interface, 
           you can convert your files in just a few clicks, saving you time and effort. We understand that converting
            files can be a tedious process, but with our automated tool, you can streamline your workflow and focus on what
             really matters. Whether you're a business owner or a data analyst, our tool will help you make the most out of your data.
           </p>
           <p class="text-justify bg-black  text-lg  text-white font-serif  ml-96  px-4 py-2  border-spacing-2 border-x-white"> Our mapping feature ensures that your data is accurately transformed according to your specifications. You can choose between internal and external mapping to tailor the conversion to your specific needs. With internal mapping, you can create a custom map that maps your CSV data to the desired XML or JSON structure. This feature allows you to easily define the structure of the output file and ensure that your data is organized in a way that makes sense to you. With external mapping, you can use an existing mapping file to perform the conversion. This option is ideal for those who already have a mapping file that they want to use or those who prefer to use a pre-defined mapping structure.
        </p>
        <p class="text-justify bg-black  text-lg  text-white font-serif  ml-96  px-4 py-2  border-spacing-2 border-x-white">
            We understand that data security is a top priority for our users, and that's why we take it seriously. Our tool uses state-of-the-art encryption to ensure that your data is protected during the conversion structure of the database and the relationships between the tables and their attributes. It is a visual tool that helps developers and database administrators to better understand the database structure and to design new databases or modify existing ones.

        </p>


            </div>
        </div>
        </div>
     );
}
 
export default About;