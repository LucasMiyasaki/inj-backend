/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import EventController from "../controller/event-controller";
import UserAuth from "../../user/middlewares/user-auth";

const routes = Router();
const userAuth = new UserAuth();
const eventController = new EventController();

routes.post("/", userAuth.auth, userAuth.isAdmin, eventController.post);

routes.get(
  "/available",
  userAuth.auth,
  eventController.getAvailableEventsForUser,
);
routes.get(
  "/attended",
  userAuth.auth,
  eventController.getAttendedEventsForUser,
);
routes.get("/:id", userAuth.auth, userAuth.isAdmin, eventController.getById);
routes.get("/", eventController.getEvents);
routes.get(
  "/capacity/:id",
  userAuth.auth,
  userAuth.isAdmin,
  eventController.getEventCapacity,
);
routes.get(
  "/subscription/:id",
  userAuth.auth,
  userAuth.isAdmin,
  eventController.getEventSubscription,
);

routes.delete("/:id", userAuth.auth, userAuth.isAdmin, eventController.delete);

export default routes;
