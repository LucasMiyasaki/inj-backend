/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import ExpenditureController from "../controller/expenditure-controller";

const routes = Router();
const expenditureController = new ExpenditureController();

routes.post("/", expenditureController.post);

routes.get("/range", expenditureController.getByRange);

routes.get("/:id", expenditureController.getById);

routes.get("/", expenditureController.getAll);

routes.delete("/:id", expenditureController.delete);

routes.put("/:id", expenditureController.update);

export default routes;