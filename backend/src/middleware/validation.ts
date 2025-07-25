import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// middleware to handle validation errors
export const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // send back all validation errors if any
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};

// validation rules for user update/create requests
export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name must be a string"),
  body("addressLine1")
    .isString()
    .notEmpty()
    .withMessage("AddressLine1 must be a string"),
  body("city").isString().notEmpty().withMessage("City must be a string"),
  body("country").isString().notEmpty().withMessage("Country must be a string"),
  handleValidationErrors,
];
