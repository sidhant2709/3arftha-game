import * as userService from '../services/userService.js';
import upload from '../utils/multerConfig.js';
import fs from 'fs'


// export const registerUser = async (req, res) => {
//   upload.single("profilePicture")(req, res, async function (err) {
//     try {
//       if (err) {
//         return res.status(400).json({ message: "File upload error", error: err.message });
//       }

//       // Parse dob correctly
//       if (req.body.dob) {
//         const [day, month, year] = req.body.dob.split("-");
//         req.body.dob = new Date(`${year}-${month}-${day}`); // Convert to valid date format
//       }

//       const user = await userService.registerUser(req.body, req.file);

//       if (user.message === "User already exists") {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       res.status(201).json({ subscription: user.subscription, user });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });
// };


// export const registerUser = async (req, res) => {
//   upload.single("profilePicture")(req, res, async function (err) {
//     try {
//       if (err) {
//         return res.status(400).json({ message: "File upload error", error: err.message });
//       }

//       // Convert dob from dd-mm-yyyy to valid Date format
//       if (req.body.dob) {
//         const [day, month, year] = req.body.dob.split("-");
//         req.body.dob = new Date(`${year}-${month}-${day}`);
//       }

//       let profilePicture = null;
//       if (req.file) {
//         const imageBuffer = fs.readFileSync(req.file.path);
//         profilePicture = imageBuffer.toString("base64"); // Convert to Base64
//       }

//       const user = await userService.registerUser({ ...req.body, profilePicture });

//       if (user.message === "User already exists") {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       res.status(201).json({ subscription: user.subscription, user });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   });
// };


export const registerUser = async (req, res) => {
  try {
    if (req.body.dob) {
      const [day, month, year] = req.body.dob.split("-");
      req.body.dob = new Date(`${year}-${month}-${day}`);
    }

    let profilePictureUrl = null;
    if (req.file) {
      profilePictureUrl = req.file.path; // Cloudinary stores the file & returns a URL
    }

    const user = await userService.registerUser({ ...req.body, profilePicture: profilePictureUrl });

    if (user.message === "User already exists") {
      return res.status(400).json({ message: "User already exists" });
    }

    res.status(201).json({ subscription: user.subscription, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.loginUser(email, password);
    res.json(userData);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Update User
// export const updateUser = async (req, res) => {
//   try {
//     const user = await userService.updateUser(req.params.id, req.body);
//     res.json({ message: 'User updated', user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const updateUser = async (req, res) => {
  try {
    let profilePictureUrl = null;
    if (req.file) {
      profilePictureUrl = req.file.path; // Cloudinary URL
    }

    const updatedUser = await userService.updateUser(req.params.id, req.body, profilePictureUrl);

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    await userService.resetPassword(req.body.email, req.body.newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Block User
export const blockUser = async (req, res) => {
  try {
    await userService.blockUser(req.params.id);
    res.json({ message: 'User blocked' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Unblock User
export const unblockUser = async (req, res) => {
  try {
    await userService.unblockUser(req.params.id);
    res.json({ message: 'User unblocked' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
