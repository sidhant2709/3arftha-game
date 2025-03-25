// import { gfs } from "../config/db.js";
// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";
// import dotenv from "dotenv";

// dotenv.config();
// const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/quizDB";

// // Configure GridFS storage
// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req, file) => {
//     return {
//       filename: `${Date.now()}-${file.originalname}`,
//       bucketName: "uploads"
//     };
//   }
// });

// const upload = multer({ storage });

// // Upload Media
// export const uploadMedia1 = upload.single("file");

// // Serve Media
// export const getMedia = async (req, res) => {
//   try {
//     const file = await gfs.files.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
//     if (!file) {
//       return res.status(404).json({ message: "No file found" });
//     }
//     const readStream = gfs.createReadStream(file._id);
//     readStream.pipe(res);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
