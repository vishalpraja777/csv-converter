import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./components/Profile";
import About from "./components/About";
import Contact from "./components/contact"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";
import Dashboard from "./components/Dashboard";
import CreateMap from "./components/CreateMap";
import UseMap from "./components/UseMap";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Signup/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/" element={<MainPage/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/createmap" element={<CreateMap/>}/>
          <Route path="/usemap" element={<UseMap/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
