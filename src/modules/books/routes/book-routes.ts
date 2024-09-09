import { Router } from "express";
import BookController from "../controller/book-controller";
import upload from "../middlewares/multer";

const routes = Router();
const bookController = new BookController();

routes.post("/", upload.single("file"), (req, res, next) => {
  bookController.post(req, res).catch(next);
});

routes.get("/all", (req, res, next) => {
  bookController.getAll(req, res).catch(next);
});

routes.get("/:id", (req, res, next) => {
  bookController.get(req, res).catch(next);
});

routes.delete("/", (req, res, next) => {
  bookController.delete(req, res).catch(next);
});

export default routes;
