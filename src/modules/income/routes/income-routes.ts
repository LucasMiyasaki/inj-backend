/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import IncomeController from "../controller/income-controller";

const routes = Router();
const incomeController = new IncomeController();

routes.post("/", incomeController.post);

routes.get("/range", incomeController.getByRange);

routes.get("/:id", incomeController.getById);

routes.get("/", incomeController.getAll);

routes.delete("/:id", incomeController.delete);

routes.put("/:id", incomeController.update);

export default routes;