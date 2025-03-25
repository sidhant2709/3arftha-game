import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/emailUtility.js';
import jwt from 'jsonwebtoken';
// Register a new user
// export const registerUser = async (data) => {
//   const { firstName,lastName,mobileNumber,dob,email, password,profilePicture } = data;
//   let user=await User.findOne({email: email});
//   console.log("user", user);
//   if(user===null){
//     // const hashedPassword = await bcrypt.hash(password, 10);
//     return await User.create({ firstName,lastName,mobileNumber,dob,email, password,profilePicture});
//   }else{
//     return {message: "User already exists"};
//   }
  
// };


export const registerUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    return { message: "User already exists" };
  }

  const newUser = new User(userData);
  return await newUser.save();
};
// Login user
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  console.log("user for login", user);
  if (!user || !(await bcrypt.compare(password, user.password))) throw new Error('Invalid credentials');
  return { token: user.generateJWT(), subscription: user.subscription,userId:user._id };
};

// Get user by ID
export const getUserById = async (id) => await User.findById(id);

// Update user details
// export const updateUser = async (id, data) => await User.findByIdAndUpdate(id, data, { new: true });
export const updateUser = async (id, data, profilePictureUrl) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found.");
  }

  if (data.firstName) user.firstName = data.firstName;
  if (data.lastName) user.lastName = data.lastName;
  if (profilePictureUrl) user.profilePicture = profilePictureUrl;

  return await user.save();
};



// Delete user account
export const deleteUser = async (id) => await User.findByIdAndDelete(id);

// // Reset password
// export const resetPassword = async (email, newPassword) => {
//   const user = await User.findOne({ email });
//   if (!user) throw new Error('User not found');
//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   return user;
// };


export const resetPassword = async (email,newPssword) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    user.password =newPssword;
         await User.findByIdAndUpdate(user.id, user, { new: true });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // const resetLink = `Please use this token to reset your password via API: ${token}`;
    const resetLink = `Please use this password for the your account : ${newPssword}`;
    await sendEmail(email, 'Password Reset Request', resetLink);
  
    return { message: "Password reset email sent successfully." };
  };

// Block a user
export const blockUser = async (id) => await User.findByIdAndUpdate(id, { blocked: true }, { new: true });

// Unblock a user
export const unblockUser = async (id) => await User.findByIdAndUpdate(id, { blocked: false }, { new: true });
