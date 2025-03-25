import Admin from '../models/Admin.model.js';
import bcrypt from 'bcryptjs';

// Create Admin
export const createAdmin = async (data) => {
    const admin= await Admin.findOne({email: data.email});
    if(admin===null){
      const { fullName, email, password, role } = data;
      return await Admin.create({ fullName, email, password, role });
    }else{
      return {message: "Admin already exists"};
    }
  };

  // Get All Admins
  export const getAllAdmins = async () => await Admin.find();

  // Get Admin by ID
  export const getAdminById = async (id) => await Admin.findById(id);

  // Update Admin
  export const updateAdmin = async (id, data) => {
      //  const hashedPassword = await bcrypt.hash(data.password, 10);
    return await Admin.findByIdAndUpdate(id, { new: true });
  };

// Delete Admin
export const deleteAdmin = async (id) => await Admin.findByIdAndDelete(id);

// Reset Password
export const resetPassword = async (email, newPassword) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Admin not found for given email: ' + email);
  console.log("new password: " + newPassword);
  admin.password =newPassword
  await admin.save();
  return admin;
};

// Change Password
export const changePassword = async (adminId, oldPassword, newPassword) => {
  const admin = await Admin.findById(adminId);
  console.log("admin: " + admin)
  if (!admin) throw new Error('Admin not found');
  if (!(await bcrypt.compare(oldPassword, admin.password))) throw new Error('Old password is incorrect');

  admin.password = newPassword;
  await admin.save();
  return admin;
};
