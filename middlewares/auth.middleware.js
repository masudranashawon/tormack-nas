const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleWare = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw Error("Invalid token format!");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw Error("Missing token in authorization header!");
    }

    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findOne({ _id });

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ error: "Invalid token!" });
    } else {
      res.status(401).json({ error: "Unauthorized access!" });
    }
  }
};

module.exports = authMiddleWare;
