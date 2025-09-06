import React, { useState, useEffect, useRef } from "react"; // Import useRef
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
        name: item.name.replace(/%20/g, " "),
        url: `https://${REPO_OWNER}.github.io/${REPO_NAME}/${folder}/${encodeURIComponent(
          item.name
        )}`,
        folder,
      }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

function SearchPanel() {
  const [query, setQuery] = useState("");
  const [allFiles, setAllFiles] = useState([]); // Renamed from 'files' for clarity
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); // NEW: State to control dropdown visibility
  const searchPanelRef = useRef(null); // NEW: Ref to detect clicks outside

  // Effect to load all files once on component mount
  useEffect(() => {
    async function loadAllFiles() {
      const manuals = await fetchGitHubFiles(MANUALS_FOLDER);
      const apps = await fetchGitHubFiles(APP_VERSIONS_FOLDER);
      setAllFiles([...manuals, ...apps]);
      // IMPORTANT: Do NOT set 'results' here. 'results' should only be populated by search.
    }
    loadAllFiles();
  }, []);

  // Effect to perform search with a debounce for live typing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() === "") {
        setResults([]); // Clear results if query is empty
        setShowDropdown(false); // Hide dropdown
        return;
      }

      const filtered = allFiles.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(true); // Show dropdown when there's a query and results are updated
    }, 300); // Debounce time (e.g., 300ms)

    return () => clearTimeout(delayDebounceFn); // Cleanup on unmount or query change
  }, [query, allFiles]); // Re-run when query or allFiles change

  // Effect to handle clicks outside the search panel to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchPanelRef]); // Dependency on ref ensures it's set up correctly

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // The debounced useEffect above will handle updating results and dropdown visibility
  };

  const handleInputFocus = () => {
    // If there's already a query, show the dropdown when the input is focused
    if (query.trim() !== "") {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // When Enter is pressed, immediately perform search and show dropdown
      if (query.trim() !== "") {
        const filtered = allFiles.filter((file) =>
          file.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setShowDropdown(true);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }
  };

  const handleSearchClick = () => {
    // When search button is clicked, immediately perform search and show dropdown
    if (query.trim() !== "") {
      const filtered = allFiles.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".pdf")) return <FaFilePdf color="#E74C3C" size={24} />;
    if (fileName.endsWith(".zip")) return <FaFileArchive color="#F1C40F" size={24} />;
    if (fileName.endsWith(".docx")) return <FaFileAlt color="#3498DB" size={24} />;
    return <FaFileAlt size={24} />;
  };

  return (
    <div className="search-panel" ref={searchPanelRef}> {/* Attach ref here */}
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus} // NEW: Add onFocus handler
          placeholder="Search files..."
        />
        <button onClick={handleSearchClick} className="search-button">
          <FaSearch />
        </button>
      </div>

      {/* Conditional rendering of the search dropdown */}
      {/* The dropdown only shows if showDropdown is true */}
      {showDropdown && (
        <div className="search-dropdown">
          {results.length > 0 ? (
            <div className="items-grid">
              {results.map((file, index) => (
                <div key={index} className="item-card">
                  <div className="item-icon">{getFileIcon(file.name)}</div>
                  <h3>{file.name.replace(/_/g, " ").replace(/\.[^/.]+$/, "")}</h3>
                  <div className="item-actions">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="open-button"
                    >
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
            // Only show "No matches" if the query is not empty (i.e., user typed something)
            query.trim() !== "" && <p className="no-results">No matches ❌</p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPanel;
