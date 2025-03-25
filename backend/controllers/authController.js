import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';
import bcrypt from 'bcryptjs';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: user.generateJWT(), subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req.body: " + JSON.stringify(req.body));
   
    const admin = await Admin.findOne({ email });
    console.log("admin: " + JSON.stringify(admin));
    console.log("compare: " + await bcrypt.compare(password, admin.password));
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: admin.generateJWT(), role: admin.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};
