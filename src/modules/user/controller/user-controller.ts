import { User, UserStatus } from "@prisma/client";
import { Request, Response } from "express";
import { isNil, toInteger, toString } from "lodash";
import JWT from "../../../common/entities/jwt-token";
import UserPassword from "../../../common/entities/password";
import { UserRequest } from "../../../common/entities/user-request";
import UserModel from "../model/user-model";
import { UserLogin } from "../types";

const userModel = new UserModel();
export default class UserController {
  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: User = req.body;

      const existingDocument = await userModel.getByDocument(body.document);
      if (existingDocument) {
        res.status(403).json({
          error: "Documento já cadastrado",
        });
      }

      const existingPhone = await userModel.getByPhone(body.phone);
      if (existingPhone) {
        res.status(403).json({
          error: "Telefone já cadastrado",
        });
      }

      const existingEmail = await userModel.getByEmail(body.email);
      if (existingEmail) {
        res.status(403).json({
          error: "Email já cadastrado",
        });
      }

      const createUser: User = {
        ...body,
        password: new UserPassword(body.password).hash(),
        type: body?.type ?? "MEMBER",
        status: body?.type === "ADMIN" ? "ACTIVE" : "PENDING",
      };

      const user = await userModel.post(createUser);

      res.status(200).json({
        status: res.statusCode,
        data: {
          id: user.id,
          name: user.name,
          document: user.document,
          email: user.email,
          phone: user.phone,
          type: user.type,
        },
      });
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  getById = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.id;

      const user = await userModel.getById(toInteger(id));

      if (!isNil(user)) {
        res.status(200).json({
          data: {
            name: user.name,
            document: user.document,
            email: user.email,
            phone: user.phone,
            type: user.type,
            status: user.status,
          },
        });
      } else {
        res.status(404).json({
          error: "User not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  update = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const body: User = req.body;
      const id = req.id;

      const user = await userModel.update(toInteger(id), body);

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          document: user.document,
          email: user.email,
          phone: user.phone,
          password: user.password,
          type: user.type,
          status: user.status,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  authentication = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: UserLogin = req.body;
      await userModel
        .getByEmail(body.email)
        .then(async (user) => {
          console.log(user);

          if (!isNil(user)) {
            const validatePassword = new UserPassword(body.password).compare(
              String(user?.password),
            );

            if (validatePassword) {
              if (user.status === UserStatus.PENDING) {
                res.status(401).json({
                  status: res.statusCode,
                  data: {
                    message: "User pending",
                  },
                });
              } else if (user.status === UserStatus.BLOCKED) {
                res.status(401).json({
                  status: res.statusCode,
                  data: {
                    message: "User blocked",
                  },
                });
              } else {
                const token = new JWT().generate(
                  toInteger(user?.id),
                  toString(user?.type),
                );

                res.status(200).json({
                  status: res.statusCode,
                  data: {
                    token,
                  },
                });
              }
            } else {
              res.status(400).json({
                error: "Invalid password",
              });
            }
          } else {
            res.status(400).json({
              error: "Email not found",
            });
          }
        })
        .catch((e) => {
          res.status(400).json({
            error: "Email not found",
          });
        });
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  delete = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.id;

      await userModel.delete(toInteger(id));

      res.status(200).json({
        data: {
          user: "User deleted",
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  updateStatus = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.body.id;
      const status = req.body.status;

      const user = await userModel.updateStatus(
        toInteger(id),
        status as UserStatus,
      );

      res.status(200).json({
        data: {
          id: user.id,
          status: user.status,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  incrementAttempts = async (
    req: UserRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.id;

      const user = await userModel.incrementAttempts(toInteger(id));

      res.status(200).json({
        data: {
          id: user.id,
          attempts: user.attempts,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  clearAttempts = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.id;

      const user = await userModel.clearAttempts(toInteger(id));

      res.status(200).json({
        data: {
          id: user.id,
          attempts: user.attempts,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  updatePassword = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.id;
      const password = req.body.password;

      const user = await userModel.updatePassword(
        toInteger(id),
        new UserPassword(toString(password)).hash(),
      );

      res.status(200).json({
        data: {
          id: user.name,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const rawUsers = await userModel.getAll();

      const users = rawUsers.map((user) => {
        return {
          id: user.id,
          name: user.name,
          document: user.document,
          email: user.email,
          phone: user.phone,
          type: user.type,
          status: user.status,
        };
      });

      res.status(200).json({
        data: users,
      });
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };
}
