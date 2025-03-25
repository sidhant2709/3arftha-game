import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dhahyn7ip",
  api_key: "733598768344435",
  api_secret: "cnLha6c_yAS38Dpll8sd5jbt6dI",
});

// // Define Cloudinary Storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "profile_pictures", // Folder name in Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg"],
//     transformation: [{ width: 500, height: 500, crop: "limit" }], // Resize for optimization
//   },
// });


const questionMediaStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "questionMedia", // Stores media for questions
      allowed_formats: ["jpg", "png", "mp4", "mp3", "wav"],
    },
  });
  
  const answerMediaStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "answerMedia", // Stores media for answers
      allowed_formats: ["jpg", "png", "mp4", "mp3", "wav"],
    },
  });
  
  const categoryImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "categoryImage", // Stores category images
      allowed_formats: ["jpg", "png"],
    },
  });
  
  const userProfileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "userProfile", // Stores user profile pictures
      allowed_formats: ["jpg", "png"],
    },
  });
  
  // Define upload middleware for each type
  const uploadQuestionMedia = multer({ storage: questionMediaStorage });
  const uploadAnswerMedia = multer({ storage: answerMediaStorage });
  const uploadCategoryImage = multer({ storage: categoryImageStorage });
  const uploadUserProfile = multer({ storage: userProfileStorage });
  
  export { cloudinary, uploadQuestionMedia, uploadAnswerMedia, uploadCategoryImage, uploadUserProfile };
  

// const upload = multer({ storage });

// export { cloudinary, upload };
