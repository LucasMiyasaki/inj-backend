import { NextFunction, Request, Response } from "express";
import { ErrorItem } from "../../../types/error-type";
import { isEmpty } from "lodash";
import { validateDate } from "./validations/validate-date";
import { Advertise } from "@prisma/client";

export const advertiseVerification = (
  req: Request,
  res: Response,
  next: NextFunction,
): Response | NextFunction | undefined => {
  console.log(req.body);
  
  const body: Advertise = req.body;
  const errors: ErrorItem[] = [];

  const startDate = body.startDate;
  const endDate = body.endDate;

  if (!validateDate(startDate, endDate)) {
    errors.push({
      error: "USR-001",
      message: "endDate can't be less than startDate",
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
