const jwt = require("jsonwebtoken");
const config = require("../config");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Authorization header

  if (!authHeader && authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Token is missing!" });
  }

  const token = authHeader.split(" ")[1]; //split: ['bearer', token]

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (decoded.username) {
      req.authData = decoded.username;
      next();
    } else {
      return res.status(403).json({ error: "Invalid token!" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  authMiddleware,
};
