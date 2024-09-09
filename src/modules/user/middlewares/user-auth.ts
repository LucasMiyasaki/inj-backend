import { NextFunction, Response } from "express";
import { isNil } from "lodash";
import JWT from "../../../common/entities/jwt-token";
import { UserRequest } from "../../../common/entities/user-request";

export default class UserAuth {
  auth = (req: UserRequest, res: Response, next: NextFunction): void => {
    try {
      const { authorization } = req.headers;

      if (!isNil(authorization)) {
        const token = authorization.split(" ")[1];
        const decode = new JWT().verify(token);

        if (!isNil(decode)) {
          req.id = decode.id;
          req.type = decode.type;

          next();
        } else {
          res.status(401).json({
            error: "Invalid token",
          });
        }
      } else {
        res.status(401).json({
          error: "Token not inserted",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  isAdmin = (req: UserRequest, res: Response, next: NextFunction): void => {
    try {
      if (req.type === "ADMIN") {
        next();
      } else {
        res.status(403).json({
          error: "Unauthorized",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };
}
