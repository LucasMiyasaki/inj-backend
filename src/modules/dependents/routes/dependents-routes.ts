/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import UserAuth from "../../user/middlewares/user-auth";
import DependentsController from "../controller/dependents-controller";

const routes = Router();
const userAuth = new UserAuth();
const dependentsController = new DependentsController();

routes.post("/", userAuth.auth, dependentsController.post);

routes.get("/", userAuth.auth, dependentsController.getByUserId);
routes.get("/name", userAuth.auth, dependentsController.getDependentByName);

export default routes;
