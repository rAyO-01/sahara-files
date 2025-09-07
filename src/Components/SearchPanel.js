import React, { useState, useEffect, useRef } from "react";
import { FaFilePdf, FaFileArchive, FaFileAlt, FaDownload, FaSearch } from "react-icons/fa";
import "../App.css";

const REPO_OWNER = "rAyO-01";
const REPO_NAME = "sahara-files";
const MANUALS_FOLDER = "manuals";
const APP_VERSIONS_FOLDER = "App-Versions";

async function fetchGitHubFiles(folder) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${folder}`
    );
    const data = await res.json();
    return data
      .filter((item) => item.type === "file")
      .map((item) => ({
        name: decodeURIComponent(item.name),
        url: item.download_url, // ✅ raw GitHub link
        folder,
      }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function SearchPanel() {
  const [query, setQuery] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchPanelRef = useRef(null);

  // Load all files on mount
  useEffect(() => {
    async function loadAllFiles() {
      const manuals = await fetchGitHubFiles(MANUALS_FOLDER);
      const apps = await fetchGitHubFiles(APP_VERSIONS_FOLDER);
      setAllFiles([...manuals, ...apps]);
    }
    loadAllFiles();
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]);
        setShowDropdown(false);
        return;
      }
      const filtered = allFiles.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, allFiles]);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".pdf")) return <FaFilePdf color="#E74C3C" size={24} />;
    if (fileName.endsWith(".zip")) return <FaFileArchive color="#F1C40F" size={24} />;
    if (fileName.endsWith(".docx")) return <FaFileAlt color="#3498DB" size={24} />;
    return <FaFileAlt size={24} />;
  };

  return (
    <div className="search-panel" ref={searchPanelRef}>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() !== "" && setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && setShowDropdown(true)}
          placeholder="Search files..."
        />
        <button onClick={() => setShowDropdown(true)} className="search-button">
          <FaSearch />
        </button>
      </div>

      {showDropdown && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            <div className="items-grid">
              {results.map((file, index) => (
                <div key={index} className="item-card">
                  <div className="item-icon">{getFileIcon(file.name)}</div>
                  <h3>{file.name.replace(/_/g, " ").replace(/\.[^/.]+$/, "")}</h3>
                  <div className="item-actions">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="open-button">
                      Open
                    </a>
                    <a href={file.url} download className="download-button">
                      <FaDownload style={{ marginRight: "5px" }} /> Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            query.trim() !== "" && <p className="no-results">No matches ❌</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPanel;
