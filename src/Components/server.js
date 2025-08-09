const express= require("express");
const multer = require("multer");   //enables uploads
const cors = require("cors");     // accepting frontend requests
const path = require("path");
const fs = ("fs");

const app = express();
app.use(cors()); //allows frontend requests
app.use(express.json());

const UPLOADS_FOLDER = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_FOLDER)){         //checks whether file exists
    fs.MKDIRSync(UPLOADS_FOLDER);
}
const storage = multer.diskStorage({
    destination:  (req, file, cb) =>{
        cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() +"-" + file.originalname);
    }
});

const upload = multer({});

app.post("/upload", upload.single("file"), (req,res) =>{
if (!req.file){
    return res.status(400).send("No file uploaded.");   //sends an error messsage if file doesn't exist
}
res.json({
    message: "File uploaded successfully!",
    filename: req.file.filename,
    path: `/files/${req.file.filename}`
});
});
app.use("/files", express.static(UPLOADS_FOLDER));

const PORT =5000; 
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));      //sends messsage when psge runs
