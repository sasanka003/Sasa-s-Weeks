import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    next(errorHandler(400, "All fields are required"));
  } 

  const hashPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashPassword,
  });

    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);}
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "Invalid credentials"));
    }

    const isMatch = bcryptjs.compareSync(password, user.password);

    if (!isMatch) {
      return next(errorHandler(400, "Invalid credentials"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: userPassword, ...rest } = user._doc;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
