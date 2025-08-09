import React, { useState } from "react";
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState("manuals");

  return (
    <div className="container">
      <div className="sidebar">
        <div className="menu-header">MENU</div>

        <div className="menu-top">
          <div className={`menu-item ${activeSection === "manuals" ? "active" : ""}`}onClick={() => setActiveSection("manuals")}>
            Manuals
          </div>
          <div className={`menu-item ${activeSection === "versions" ? "active" : ""}`} onClick={() => setActiveSection("versions")}>
            App Versions
          </div>
          <div className={`menu-item ${activeSection === "section3" ? "active" : ""}`}onClick={() => setActiveSection ("section3")}>
            Section 3</div>
        </div>
        <div className="menu-bottom">
          <div className={`menu-item &{activeSection === "Settings" ? "active" : ""}`} onClick={() => setActiveSection("settings")}>
          Settings
        </div>
        </div>
      </div>
       
      <div className="main">
        <div className="header">
          <div className="header-title">Dashboard</div>
          <button className="profile-button">Profile</button>
        </div>
        <div className="content">
          {activeSection === "manuals" && <Manuals />}
          {activeSection === "versions" && <AppVersions />}
          {activeSection === "section3" && <Section3 />}
          {activeSection === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}

// Placeholder components
function Manuals() {
  return <div>This is the Manuals section.</div>;
}

function AppVersions() {
  return <div>This is the App Versions section.</div>;
}

function Section3(){
  return <div>Section 3</div>
}
function Settings(){
  return <div> Settings</div>
}
export default App;
