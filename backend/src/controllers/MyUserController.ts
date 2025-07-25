import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;
    // check if user exists to avoid duplicates
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser) {
      // user already exists, no need to create
      return res.status(200).send();
    }

    // create and save new user
    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating user" });
  }
};

const getCurrentUser = async (_req: Request, res: Response) => {
  try {
    // get all users in DB
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    // find user by id attached to request
    const user = await User.findById(req.userId);

    if (!user) {
      // if no user found, respond accordingly
      return res.status(404).json({ message: "User not found" });
    }

    // update user fields with new info
    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;

    await user.save();

    return res.send(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error updating user" });
  }
};

export default {
  createCurrentUser,
  getCurrentUser,
  updateCurrentUser,
};
