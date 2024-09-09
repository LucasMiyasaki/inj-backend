import { Request, Response } from "express";
import IncomeModel from "../model/income-model";
import { isNil, toInteger } from "lodash";
import { Income } from "@prisma/client";

const incomeModel = new IncomeModel();

export default class IncomeController {
  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: Income = {
        id: req.body.id,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date,
        type: req.body.type,
      }

      const income = await incomeModel.post(body);

      res.status(200).json({
        income: {
          id: income.id,
          amount: income.amount,
          description: income.description,
          date: income.date,
          type: income.type,
        }
      })
    } catch (e) {
      res.status(400).json({
        error: e
      })
    }
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;

      const income = await incomeModel.getById(toInteger(id));

      if (!isNil(income)) {
        res.status(200).json(income);
      } else {
        res.status(404).json({
          error: "Income not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  getByRange = async (req: Request, res: Response): Promise<void> => {
    try {
      const startDate: Date = new Date(String(req.query.startDate));
      const endDate: Date = new Date(String(req.query.endDate));

      const income = await incomeModel.getByRange(startDate, endDate);

      if (!isNil(income)) {
        res.status(200).json(income);
      } else {
        res.status(404).json({
          error: "Incomes not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const income = await incomeModel.getAll();

      res.status(200).json(income);
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: Income = req.body;
      const id: string = req.params.id;

      const income = await incomeModel.update(toInteger(id), body);

      res.status(200).json({
        income: {
          id: income.id,
          amount: income.amount,
          description: income.description,
          date: income.date,
          type: income.type,
        }
      });
    } catch (e) {
      res.status(400).json({
        error: e
      });
    }
  }

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;

      const income = await incomeModel.delete(toInteger(id));

      if (!isNil(income)) {
        res.status(200).json(income);
      } else {
        res.status(404).json({
          error: "Income not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };
}