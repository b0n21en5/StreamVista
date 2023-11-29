import { clientError, serverError } from "../helpers/handleErrors.js";
import fs from "fs";
import userModel from "../models/userModel.js";
import { hashPassword, verifyPassword } from "../helpers/authHelpers.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, answer } = req.fields;
    const { pic } = req.files;

    switch (true) {
      case !name:
        return clientError(res, "User Name required!");
      case !email:
        return clientError(res, "Email required!");
      case !password:
        return clientError(res, "Password required!");
      case !answer:
        return clientError(res, "Favorite sport required!");
      case pic && pic.size > 1000000:
        return clientError(res, "Profile pic size must be less than 1mb!");
    }

    const existingUser = await userModel.findOne({ email: email });
    if (existingUser)
      return clientError(res, `${email} is registered! try another`);

    const hashedPassword = await hashPassword(password);

    const newUser = await userModel({
      ...req.fields,
      password: hashedPassword,
    });

    if (pic) {
      newUser.pic.data = fs.readFileSync(pic.path);
      newUser.pic.contentType = pic.type;
    }

    await newUser.save();

    newUser.password = "****";
    newUser.pic = "****";

    return res.send(newUser);
  } catch (error) {
    return serverError(res, error, "Error registering new user!");
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return clientError(res, "Invalid Email!");
    if (!password) return clientError(res, "Invalid Password!");

    const user = await userModel.findOne({ email: email }).select("-pic");
    if (!user) return clientError(res, `No user with ${email}`);

    const isPassMatch = await verifyPassword(password, user.password);
    if (!isPassMatch) return clientError(res, "Wrong Password!");

    return res.send(user);
  } catch (error) {
    return serverError(res, error, "Error While log in!");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) return clientError(res, "Invalid Email!");
    if (!answer) return clientError(res, "Favorite Sport required!");
    if (!newPassword) return clientError(res, "New Password required!");

    const user = await userModel.findOne({ email: email }).select("-pic");
    if (!user) return clientError(res, `No user with ${email}`);

    if (user.answer !== answer) return clientError(res, "Wrong answer!");

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;

    await user.save();

    user.password = "***";

    return res.send(user);
  } catch (error) {
    return serverError(res, error, "Error password reset!");
  }
};

export const updatedUserController = async (req, res) => {
  try {
    const { email, password, channel } = req.fields;
    const { pic } = req.files;

    if (!email) return clientError(res, "Email required!");
    if (pic && pic.size > 1000000)
      return clientError(res, "Picture size must be less than 1mb");

    const userExist = await userModel.findOne({ email: email });
    if (!userExist) return clientError(res, `No user with ${email}`);

    let isChannel = false;
    if (channel) isChannel = true;

    let hashedPassword;
    if (password) hashedPassword = await hashPassword(password);

    const updatedUser = await userModel.findOneAndUpdate(
      { email: email },
      { ...req.fields, password: hashedPassword, isChannel: isChannel },
      { new: true }
    );

    if (pic) {
      updatedUser.pic.data = fs.readFileSync(pic.path);
      updatedUser.pic.contentType = pic.type;
    }

    await updatedUser.save();

    updatedUser.pic.data = "****";
    updatedUser.password = "****";

    return res.send(updatedUser);
  } catch (error) {
    return serverError(res, error, "Error updating user!");
  }
};

export const getProfilePic = async (req, res) => {
  try {
    const { pic } = await userModel.findById(req.params.uid);

    res.set("Content-type", pic.contentType);

    return res.send(pic.data);
  } catch (error) {
    return serverError(res, error, "Error fetching profile pic!");
  }
};