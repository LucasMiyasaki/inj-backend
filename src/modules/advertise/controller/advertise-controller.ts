import { Request, Response } from "express";
import AdvertiseModel from "../model/advertise-model";

import { isNil, toInteger } from "lodash";
import fs from "fs";
import path from "path";
import { Advertise } from "@prisma/client";

const advertiseModel = new AdvertiseModel();

export default class AdvertiseController {
  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: Advertise = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        url: req.file?.originalname.split(" ").join("_") ?? "",
        show: true,
      };

      console.log(body);

      if (req.body?.show === "false") {
        body.show = false;
      }

      let advertise = await advertiseModel.post(body);

      const aux: Advertise = {
        id: advertise.id,
        name: advertise.name,
        description: advertise.description,
        startDate: advertise.startDate,
        endDate: advertise.endDate,
        url: `${advertise.id}-${req.file?.originalname.split(" ").join("_")}`,
        show: advertise.show,
      };

      if (req.file != null) {
        const uploadPath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "assets",
          "images",
          "advertise",
          `${advertise.id}-${req.file.originalname.split(" ").join("_")}`,
        );

        fs.writeFile(uploadPath, req.file.buffer, (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to save file" });
          }
        });
      }

      advertise = await advertiseModel.update(toInteger(advertise.id), aux);

      res.status(200).json({
        advertise: {
          id: advertise.id,
          name: advertise.name,
          description: advertise.description,
          startDate: advertise.startDate,
          endDate: advertise.endDate,
          url: advertise.url,
          show: advertise.show,
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

      const advertise = await advertiseModel.getById(toInteger(id));

      if (!isNil(advertise)) {
        res.status(200).json(advertise);
      } else {
        res.status(404).json({
          error: "Advertise not found",
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
      const advertises = await advertiseModel.getAll();

      res.status(200).json(advertises);
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: Advertise = req.body;
      if (req.body.show === "false") {
        body.show = false;
      } else body.show = true;
      const id: string = req.params.id;

      const ad = await advertiseModel.getById(toInteger(id));

      if (req.file != null && ad != null) {
        body.url = `${id}-${req.file?.originalname.split(" ").join("_")}`;

        const deletePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "assets",
          "images",
          "advertise",
          ad.url,
        );

        fs.unlink(deletePath, (error) => {
          if (error) console.log(error);
        });

        const uploadPath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "assets",
          "images",
          "advertise",
          `${id}-${req.file.originalname.split(" ").join("_")}`,
        );

        fs.writeFile(uploadPath, req.file.buffer, (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to save file" });
          }
        });
      }

      const advertise = await advertiseModel.update(toInteger(id), body);

      res.status(200).json({
        advertise: {
          id: advertise.id,
          name: advertise.name,
          description: advertise.description,
          startDate: advertise.startDate,
          endDate: advertise.endDate,
          url: advertise.url,
          show: advertise.show,
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

      const advertise = await advertiseModel.delete(toInteger(id));

      if (!isNil(advertise)) {
        const deletePath = path.join(
          __dirname,
          "..",
          "..",
          "..",
          "assets",
          "images",
          "advertise",
          advertise.url,
        );

        fs.unlink(deletePath, (error) => {
          if (error) console.log(error);
        });

        res.status(200).json(advertise);
      } else {
        res.status(404).json({
          error: "Advertise not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };
}
