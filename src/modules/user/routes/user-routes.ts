/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import UserController from "../controller/user-controller";
import { userVerification } from "../middlewares/user-verification";
import UserAuth from "../middlewares/user-auth";

const routes = Router();
const userAuth = new UserAuth();
const userController = new UserController();

routes.post("/login", userController.authentication);

routes.post("/", userVerification, userController.post);

routes.get("/", userAuth.auth, userController.getById);
routes.get("/all", userAuth.auth, userAuth.isAdmin, userController.getAll);

routes.delete("/", userAuth.auth, userController.delete);

routes.put("/", userAuth.auth, userController.update);
routes.put("/attempts", userController.incrementAttempts);
routes.put("clear-attempts", userAuth.auth, userController.clearAttempts);
routes.put("/status", userAuth.auth, userController.updateStatus);
routes.put("/password", userAuth.auth, userController.updatePassword);

export default routes;
