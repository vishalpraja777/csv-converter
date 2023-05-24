import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainPage = () => {
    return ( 
        <div>
            <Navbar/>

            <div>
                {/* Write ur contents in this div */}
            </div>

            <Link to='/homepage'>Get Started</Link>
        </div>
     );
}
 
export default MainPage;