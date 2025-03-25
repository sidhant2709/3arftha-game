import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("decoded: ", decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};


export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }
      next();
    };
  };
  
