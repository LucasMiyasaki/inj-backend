import { Response } from "express";
import { UserRequest } from "../../../common/entities/user-request";
import DependentsModel from "../model/dependents-model";
import { isNil } from "lodash";

const dependentsModel = new DependentsModel();

export default class DependentsController {
  post = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.id;
      const name = req.body.name;

      const getDependent = await dependentsModel.getDependentByName(
        Number(id),
        String(name),
      );

      const request = {
        id: req.body.id,
        name,
        observation: req.body.observation,
        userId: Number(id),
      };

      if (isNil(getDependent)) {
        const dependents = await dependentsModel.post(request);

        res.status(200).json({
          data: {
            id: dependents.id,
            name: dependents.name,
          },
        });
      } else {
        res.status(400).json({
          error: "Dependent already exists",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getByUserId = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.id;

      const dependents = await dependentsModel.getByUserId(Number(id));

      res.status(200).json({
        data: dependents,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getDependentByName = async (
    req: UserRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const id = req.id;
      const name = req.body.name;

      const getDependent = await dependentsModel.getDependentByName(
        Number(id),
        String(name),
      );

      if (!isNil(getDependent)) {
        res.status(200).json({
          data: {
            id: getDependent.id,
            name: getDependent.name,
          },
        });
      } else {
        res.status(404).json({
          error: "Dependent not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };
}
