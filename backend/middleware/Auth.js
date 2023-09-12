import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const Authorization = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        //remove Bearer and take the token
        token = req.headers.authorization.split(" ")[1];

        //Decodes token id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password"); //Without Password

        next();
      } catch (error) {
        res.status(401).json({
          success: false,
          message: "Not Authorized for the Task",
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Server Side Error",
    });
  }
};

export default Authorization;
