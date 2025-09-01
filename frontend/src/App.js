import React, { useState, useEffect } from "react";
import "./App.css";
import SearchPanel from "./Components/SearchPanel";
import { Routes, Route, NavLink } from "react-router-dom";
import { FaCog, FaBook, FaFolderOpen, FaThLarge, FaDownload } from "react-icons/fa";

// GitHub repo details
const REPO_OWNER = "rAyO-01";
const REPO_NAME = "sahara-files";
const MANUALS_FOLDER = "manuals";
const APP_VERSIONS_FOLDER = "App-Versions";

// Fetch files dynamically from GitHub repo folder
async function fetchGitHubFiles(folder) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${folder}`);
    const data = await res.json();
    return data
      .filter(item => item.type === "file")
      .map(item => ({
        name: item.name.replace(/%20/g, " "),
        url: `https://${REPO_OWNER}.github.io/${REPO_NAME}/${folder}/${encodeURIComponent(item.name)}`
      }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {/* HEADER */}
      <header className="header">
        <div className="header-title">Sahara DocuHub</div>
        <div className="header-search">
          <SearchPanel />
        </div>
        <div className="header-actions">
          <button
            className="darkMode-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="menu-top">
          <NavLink
            to="/manuals"
            className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            aria-label="Manuals"
          >
            <FaBook className="menu-icon" aria-hidden="true" />
            <span className="menu-text">Manuals</span>
          </NavLink>

          <NavLink
            to="/versions"
            className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            aria-label="App Versions"
          >
            <FaFolderOpen className="menu-icon" aria-hidden="true" />
            <span className="menu-text">App Versions</span>
          </NavLink>
        </div>

        <div className="menu-bottom">
          <NavLink
            to="/settings"
            className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            aria-label="Settings"
          >
            <FaCog className="menu-icon" aria-hidden="true" />
            <span className="menu-text">Settings</span>
          </NavLink>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        <div className="content">
          <Routes>
            <Route path="/manuals" element={<Manuals />} />
            <Route path="/versions" element={<AppVersions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Manuals />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Manuals Section
function Manuals() {
  const [manuals, setManuals] = useState([]);

  useEffect(() => {
    fetchGitHubFiles(MANUALS_FOLDER).then(setManuals);
  }, []);

  return (<div>
      <h2>Manuals</h2>
      {manuals.length === 0 && <p>No manuals found yet.</p>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
        }}
      >
        {manuals.map((manual, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>
              {manual.name}
            </h3>

            <div
              style={{
                height: "250px",
                overflow: "auto",
                marginBottom: "10px",
              }}
            >
              <iframe
                src={manual.url}
                width="100%"
                height="100%"
                style={{ border: "none", borderRadius: "4px" }}
                title={manual.name}
              />
            </div>

            <a href={manual.url} download>
              <button
                className="download-btn"
                style={{ width: "100%", textAlign: "center" }}
              >
                <FaDownload style={{ marginRight: "5px" }} />
                Download
              </button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// App Versions Section
function AppVersions() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchGitHubFiles(APP_VERSIONS_FOLDER).then(setApps);
  }, []);

  return (
    <div>
      <h2>App Versions</h2>
      {apps.length === 0 && <p>No app versions available yet.</p>}
      {apps.map((app, index) => (
        <div key={index} style={{ marginBottom: "20px" }}>
          <a href={app.url} download>
            <button className="download-btn">
              <FaDownload className="download-icon" /> Download {app.name}
            </button>
          </a>
        </div>
      ))}
    </div>
  );
}

// Settings 
function Settings() {
  return <div>Settings</div>;
}

export default App;
