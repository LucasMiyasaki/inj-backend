import { NextFunction, Request, Response } from "express";
import { ErrorItem } from "../../../types/error-type";
import { isEmpty } from "lodash";
import { validateDate } from "./validations/validate-date";
import { Meeting } from "@prisma/client";

export const meetingVerification = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | NextFunction | undefined => {
    const body: Meeting = req.body;
    const errors: ErrorItem[] = [];
    const {startDate, endDate} = body;
    
    if(!validateDate(startDate, endDate)){
        errors.push({
            error: "USR-001",
            message: "Invalid startTime and endTime",
        })
    }

    if(isEmpty(errors)) {
        next();
    }
    else
    {
        return res.status(400).json({
            errors,
        });
    }
};