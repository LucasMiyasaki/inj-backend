/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import AdvertiseController from "../controller/advertise-controller";
import { advertiseVerification } from "../middlewares/advertise-verification";
import upload from "../middlewares/multer";

const routes = Router();
const advertiseController = new AdvertiseController();

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
routes.post(
  "/",
  upload.single("file"),
  advertiseVerification,
  (req, res, next) => {
    advertiseController.post(req, res).catch(next);
  },
);

routes.get("/:id", (req, res, next) => {
  advertiseController.getById(req, res).catch(next);
});

routes.get("/", (req, res, next) => {
  advertiseController.getAll(req, res).catch(next);
});

routes.delete("/:id", (req, res, next) => {
  advertiseController.delete(req, res).catch(next);
});

// routes.put("/details/:id", upload.single('file'), advertiseVerification, advertiseController.update)

routes.put(
  "/:id",
  upload.single("file"),
  advertiseVerification,
  (req, res, next) => {
    advertiseController.update(req, res).catch(next);
  },
);

export default routes;
