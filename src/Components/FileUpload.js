import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setMessage("✅ " + data.message);
      setUploadedFile(`http://localhost:5000/files/${data.filename}`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>📂 Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <p>{message}</p>

      {/* Preview the uploaded file link */}
      {uploadedFile && (
        <p>
          🔗 File available at:{" "}
          <a href={uploadedFile} target="_blank" rel="noreferrer">
            {uploadedFile}
          </a>
        </p>
      )}
    </div>
  );
}

export default FileUpload;
