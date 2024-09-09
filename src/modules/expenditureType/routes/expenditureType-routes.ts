/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import ExpenditureTypeController from "../controller/expenditureType-controller";

const routes = Router();
const expenditureTypeController = new ExpenditureTypeController();

routes.post("/", expenditureTypeController.post);

routes.get("/:id", expenditureTypeController.getById);

routes.get("/", expenditureTypeController.getAll);

routes.delete("/:id", expenditureTypeController.delete);

routes.put("/:id", expenditureTypeController.update);

export default routes;