import generateToken from "../config/Token.js";
import bcrypt from "bcrypt";
import User from "../models/UserModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(404).json({
        success: false,
        message: "User already Exists !",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      pic,
    });

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
        token: generateToken(newUser._id), //! USING TO STORE TOKEN
      });
    } else {
      res.status(404).json({
        success: false,
        message: "failed to Create the User",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    const isPassMatched = await bcrypt.compare(password, user.password);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Invalid Email/Password !",
      });
    } else {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id), //! USING TO MAKE TOKEN
      });
    }

    if (!isPassMatched) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email/Password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export { registerUser, loginUser };
