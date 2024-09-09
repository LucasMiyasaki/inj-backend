import { Request, Response } from "express";
import ExpenditureTypeModel from "../model/expenditureType-model";
import { isNil, toInteger } from "lodash";
import { ExpenditureType } from "@prisma/client";

const expenditureTypeModel = new ExpenditureTypeModel();

export default class ExpenditureTypeController {
  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: ExpenditureType = {
        id: req.body.id,
        name: req.body.name,
      };

      const expenditureType = await expenditureTypeModel.post(body);

      res.status(200).json({
        expenditureType: {
          id: expenditureType.id,
          name: expenditureType.name,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;

      const expenditureType = await expenditureTypeModel.getById(toInteger(id));

      if (!isNil(expenditureType)) {
        res.status(200).json(expenditureType);
      } else {
        res.status(404).json({
          error: "ExpenditureType not found",
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
      const expenditureType = await expenditureTypeModel.getAll();

      res.status(200).json(expenditureType);
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: ExpenditureType = req.body;
      const id: string = req.params.id;

      const expenditureType = await expenditureTypeModel.update(
        toInteger(id),
        body,
      );

      res.status(200).json({
        advertise: {
          id: expenditureType.id,
          name: expenditureType.name,
        },
      });
    } catch (e) {
      res.status(400).json({
        error: e,
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;

      const expenditureType = await expenditureTypeModel.delete(toInteger(id));

      if (!isNil(expenditureType)) {
        res.status(200).json(expenditureType);
      } else {
        res.status(404).json({
          error: "ExpenditureType not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };
}
