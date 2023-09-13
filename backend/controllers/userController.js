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
    return res.status(404).json({
      success: false,
      message: "Something Occured",
    });
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please enter all the fields",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPassMatched = await bcrypt.compare(password, user.password);

    if (!isPassMatched) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // If everything is successful, generate and send the token
    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), //! USING TO MAKE TOKEN
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Invalid email or password",
    });
  }
};

//api/users/getusers?search=query
const getUsers = async (req, res) => {
  try {
    //!If req.query.search exists (i.e., the user wants to perform a search), it constructs a search filter object called keyword.It uses the MongoDB $or operator to say that a user can match either their name or their email.

    //*This filter specifies that you want to find users whose name or email matches the search term provided (req.query.search), and the matching should be case-insensitive (the $options: "i" part).

    const keyword = req.query.search
      ? {
          // ! option 'i' means Case in-Sensitive
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : //! else nothing to do
        {};

    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id }, //! req.user obtained from auth Middleware
    });
    res.send(users);
  } catch (error) {
    console.log(error);
  }
};
export { registerUser, loginUser, getUsers };
