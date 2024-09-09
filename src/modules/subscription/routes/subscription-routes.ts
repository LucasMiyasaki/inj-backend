/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { SubscriptionController } from "../control/subscription-control";
import UserAuth from "../../user/middlewares/user-auth";

const routes = Router();
const userAuth = new UserAuth();
const subscriptionController = SubscriptionController.getInstance();

routes.post("/", userAuth.auth, subscriptionController.create);

routes.put(
  "/cancel",
  userAuth.auth,
  subscriptionController.requestCancellation,
);
routes.put(
  "/cancel/approve",
  userAuth.auth,
  userAuth.isAdmin,
  subscriptionController.approveCancellation,
);
routes.put(
  "/cancel/reject",
  userAuth.auth,
  userAuth.isAdmin,
  subscriptionController.rejectCancellation,
);
routes.put("/status", userAuth.auth, subscriptionController.updateStatus);

routes.get("/", userAuth.auth, subscriptionController.getByUserId);
routes.get(
  "/event/:id",
  userAuth.auth,
  userAuth.isAdmin,
  subscriptionController.getByEventId,
);

export default routes;
