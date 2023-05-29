import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./components/Profile";
import About from "./components/About";
import Contact from "./components/contact"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";
import CreateJsonMap from "./components/CreateJsonMap";
import CreateXmlMap from "./components/CreateXmlMap.js";
import UseMap from "./components/UseMap";
import MainPage from "./pages/MainPage";
import ConvertedFiles from "./pages/ConvertedFiles";
import EditMapping from "./pages/EditMapping";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Signup/>}/>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/createjsonmap" element={<CreateJsonMap/>}/>
          <Route path="/createxmlmap" element={<CreateXmlMap/>}/>
          <Route path="/usemap" element={<UseMap/>}/>
          <Route path="/convertedfiles" element={<ConvertedFiles />}/>
          <Route path="/editmapping" element={<EditMapping />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
