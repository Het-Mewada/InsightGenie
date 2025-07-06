import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null,`${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({storage});

router.post("/file" , upload.single("file"), (req,res)=>{
    const file = req.file;

    if(!file){
        return res.status(400).json({message:"No File Uploaded"});
    }
    
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName],{raw:true});

    fs.unlinkSync(file.path);
    res.json({ success: true, data });
});

export default router;