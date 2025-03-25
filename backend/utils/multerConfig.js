// // utils/multerConfig.js
// import multer from 'multer';
// import path from 'path';

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/'); // Ensure this directory exists
//     },
//     filename: function(req, file, cb) {
//         cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'video/mp4') {
//         cb(null, true);
//     } else {
//         cb(new Error('Unsupported file format'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // 5MB file size limit
//     },
//     fileFilter: fileFilter
// });

// export default upload;



// import multer from "multer";
// import fs from "fs";
// import path from "path";

// // Ensure uploads directory exists
// const uploadDir = "uploads/";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Define supported MIME types
// const ALLOWED_MIME_TYPES = {
//   "image/jpeg": ".jpg",
//   "image/png": ".png",
//   "video/mp4": ".mp4",
//   "audio/mpeg": ".mp3",
//   "audio/wav": ".wav",
// };

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     // Replace ':' to avoid issues in Windows filenames
//     const uniqueName = Date.now() + "-" + file.originalname.replace(/:/g, "-");
//     cb(null, uniqueName);
//   },
// });

// // File filter function
// const fileFilter = (req, file, cb) => {
//   if (ALLOWED_MIME_TYPES[file.mimetype]) {
//     cb(null, true);
//   } else {
//     cb(new Error(`Unsupported file format: ${file.mimetype}`), false);
//   }
// };

// // Multer upload configuration
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 10, // 10MB file size limit
//   },
//   fileFilter: fileFilter,
// });

// export default upload;



import multer from "multer";

// Store uploaded files in memory as Buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10MB max file size
  },
});

export default upload;
