import * as adminService from '../services/adminService.js';

// Create Admin
export const createAdmin = async (req, res) => {
  try {
    // if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Access denied' });
    const admin = await adminService.createAdmin(req.body);
    if(admin.message=="Admin already exists"){
      return res.status(400).json({ message: 'Admin already exists' });
    }
    res.status(201).json({ message: 'Admin created successfully', admin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Admins
export const getAllAdmins = async (req, res) => {
  try {
    res.json(await adminService.getAllAdmins());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Admin
export const updateAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Access denied' });
    const admin = await adminService.updateAdmin(req.params.id, req.body);
    res.json({ message: 'Admin updated', admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Admin
export const deleteAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Access denied' });
    await adminService.deleteAdmin(req.params.id);
    res.json({ message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    await adminService.resetPassword(req.body.email, req.body.newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    console.log("request: " + JSON.stringify(req.body));
    await adminService.changePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
