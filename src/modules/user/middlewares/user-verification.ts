import { NextFunction, Request, Response } from "express";
import { ErrorItem } from "../../../types/error-type";
import { validateDocument } from "./validations/validate-document";
import { validateEmail } from "./validations/validate-email";
import {
  errorPassword,
  validatePassword,
} from "./validations/validate-password";
import { validatePhone } from "./validations/validate-phone";
import { isEmpty } from "lodash";
import { User } from "@prisma/client";

export const userVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | NextFunction | undefined => {
  const body: User = req.body;
  const errors: ErrorItem[] = [];

  const { document, email, password, phone } = body;

  if (!validateDocument(document)) {
    errors.push({
      error: "USR-001",
      message: "Invalid document",
    });
  }

  if (!validateEmail(email)) {
    errors.push({
      error: "USR-002",
      message: "Invalid email",
    });
  }

  if (!validatePassword(password)) {
    errors.push({
      error: "USR-003",
      errors: errorPassword(password),
      message: "Invalid password",
    });
  }

  if (!validatePhone(phone)) {
    errors.push({
      error: "USR-009",
      message: "Invalid phone",
    });
  }

  if (isEmpty(errors)) {
    next();
  } else {
    return res.status(400).json({
      errors,
    });
  }
};
