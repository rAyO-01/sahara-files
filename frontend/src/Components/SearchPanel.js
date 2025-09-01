import React, { useState } from "react";
import "../App.css"; // styling

function SearchPanel() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const files = [
    { name: "Sahara App User Manual.pdf", path: "/files/User_Manual_v1.pdf" },
    { name: "SaharaAdminPorta User Manuall.pdf", path: "/files/Installation_Guide.docx" },
    { name: "TATS User Manual.pdf", path: "/files/Release_Notes.txt" }
  ];

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    const filtered = files.filter((file) =>
      file.name.toLowerCase().includes(value)
    );
    setResults(filtered);
  };

  return (
    <div className="search-panel">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search files..."
      />

      {/* Only show results if searching */}
      {query && (
        <div className="search-dropdown">
          {results.length === 0 && <p className="no-results">No matches ❌</p>}
          {results.map((file, index) => (
            <div key={index} className="search-item">
              <a href={file.path} target="_blank" rel="noreferrer">
                {file.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPanel;
