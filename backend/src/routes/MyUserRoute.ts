import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router();

// create user, protect route with jwtCheck
router.post("/", jwtCheck, MyUserController.createCurrentUser);

// get all users, no auth needed
router.get("/", MyUserController.getCurrentUser);

// update user, requires jwt auth and validation
router.put(
  "/",
  jwtCheck,
  jwtParse,
  validateMyUserRequest,
  MyUserController.updateCurrentUser
);

export default router;
