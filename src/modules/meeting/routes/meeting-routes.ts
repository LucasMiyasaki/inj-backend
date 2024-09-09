/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from "express";
import MeetingController from "../controller/meeting-controller";
import { meetingVerification } from "../middlewares/meeting-verification";

const routes = Router();
const meetingController = new MeetingController();

routes.post("/", meetingVerification, meetingController.post);

routes.get("/:id", meetingController.getById);

routes.get("/", meetingController.getAll);

routes.delete("/:id", meetingController.delete);

routes.patch("/:id", meetingVerification, meetingController.update);

export default routes;