import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import About from "./components/About";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from "react";
import Dashboard from "./components/Dashboard";
import CreateMap from "./components/CreateMap";
import UseMap from "./components/UseMap";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Signup/>}/>
          {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/createmap" element={<CreateMap/>}/>
          <Route path="/usemap" element={<UseMap/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
