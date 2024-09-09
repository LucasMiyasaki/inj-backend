import { Request, Response } from "express";
import ExpenditureModel from "../model/expenditure-model";
import { isNil, toInteger } from "lodash";
import { Expenditure } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

const expenditureModel = new ExpenditureModel();

export default class ExpenditureController {
  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: Expenditure = {
        id: req.body.id,
        value: req.body.value,
        description: req.body.description,
        installments: req.body.installments,
        parcels: req.body.parcels,
        fee: req.body.fee,
        dueDate: req.body.dueDate,
        expenditureTypeId: req.body.expenditureTypeId,
        payedDate: req.body.payedDate
      }
      
      const parcels: number = body.parcels ? toInteger(body.parcels) : 1;
      const fee: number = body.fee ? parseFloat(String(body.fee)) : 0;

      const expenditures = [];

      for(let i=0; i<parcels; i++) {
        const newValue = new Decimal((parseFloat(String(body.value)) * (1+fee/100))/parcels);
        const newDueDate = new Date(body.dueDate);
        newDueDate.setMonth(newDueDate.getMonth() + i);

        const newExpenditure: Expenditure = {
          ...body,
          value: newValue,
          dueDate: newDueDate,
          parcels: i+1 + "/" + parcels
        };
        
        const expenditure = await expenditureModel.post(newExpenditure);
        expenditures.push(expenditure);
      }

      res.status(200).json({
        expenditures: expenditures.map(expenditure => ({
          id: expenditure.id,
          value: expenditure.value,
          description: expenditure.description,
          installments: expenditure.installments,
          parcels: expenditure.parcels,
          fee: expenditure.fee,
          dueDate: expenditure.dueDate,
          expenditureTypeId: expenditure.expenditureTypeId,
          payedDate: expenditure.payedDate
        }))
      });
    } catch (e) {
      res.status(400).json({
        error: e
      })
    }
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id: string = req.params.id;

      const expenditure = await expenditureModel.getById(toInteger(id));

      if (!isNil(expenditure)) {
        res.status(200).json(expenditure);
      } else {
        res.status(404).json({
          error: "Expenditure not found",
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

      const expenditure = await expenditureModel.getByRange(startDate, endDate);

      if (!isNil(expenditure)) {
        res.status(200).json(expenditure);
      } else {
        res.status(404).json({
          error: "Expenditures not found",
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
      const expenditure = await expenditureModel.getAll();

      if (expenditure.length > 0) {
        res.status(200).json(expenditure);
      } else {
        res.status(404).json({
          error: "No expenditure found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: Expenditure = req.body;
      const id: string = req.params.id;

      const expenditure = await expenditureModel.update(toInteger(id), body);

      res.status(200).json({
        advertise: {
          id: expenditure.id,
          value: expenditure.value,
          description: expenditure.description,
          installments: expenditure.installments,
          parcels: expenditure.parcels,
          fee: expenditure.fee,
          dueDate: expenditure.dueDate,
          expenditureTypeId: expenditure.expenditureTypeId,
          payedDate: expenditure.payedDate
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

      const expenditure = await expenditureModel.delete(toInteger(id));

      if (!isNil(expenditure)) {
        res.status(200).json(expenditure);
      } else {
        res.status(404).json({
          error: "Expenditure not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };
}