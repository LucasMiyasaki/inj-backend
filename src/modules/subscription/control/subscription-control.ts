import { Event, Subscription } from "@prisma/client";
import { Response } from "express";
import { toInteger } from "lodash";
import { connectionPool } from "../../../client/pg-client";
import { UserRequest } from "../../../common/entities/user-request";
import EventModel from "../../event/model/event-model";
import UserModel from "../../user/model/user-model";
import { SubscriptionModel } from "../model/subscription-model";
import DependentsModel from "../../dependents/model/dependents-model";

interface SubscriptionOut extends Subscription {
  event?: Event | null;
  user?: {
    name?: string;
    email?: string;
  };
  dependent?: {
    name?: string;
    observation?: string | null;
  };
}

export class SubscriptionController {
  private static instance: SubscriptionController;
  private readonly model: SubscriptionModel;

  private constructor() {
    this.model = SubscriptionModel.getInstance();
  }

  public static getInstance(): SubscriptionController {
    if (!this.instance) {
      this.instance = new SubscriptionController();
    }
    return this.instance;
  }

  create = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.id;
      const { eventId, payment, dependentId } = req.body;
      const client = await connectionPool.getInstance().connect();
      await client.query("BEGIN");
      await this.model.create(client, {
        userId: toInteger(userId),
        eventId,
        payment,
        dependentId,
      });

      return res
        .status(201)
        .send({ message: ["Inscrição criada com sucesso!"] });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };

  updateStatus = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const { status, id } = req.body;
      const client = await connectionPool.getInstance().connect();
      await client.query("BEGIN");
      await this.model.updateStatus(client, Number(id), status);

      return res
        .status(200)
        .send({ message: ["Status da inscrição atualizado com sucesso!"] });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };

  requestCancellation = async (
    req: UserRequest,
    res: Response,
  ): Promise<Response> => {
    try {
      const { id } = req.body;
      const client = await connectionPool.getInstance().connect();
      await client.query("BEGIN");
      await this.model.requestCancellation(client, Number(id));

      return res.status(200).send({
        message: ["Solicitação de cancelamento enviada com sucesso!"],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };

  approveCancellation = async (
    req: UserRequest,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = req.body.id;
      const adminId = req.id;
      const client = await connectionPool.getInstance().connect();
      await client.query("BEGIN");
      await this.model.approveCancellation(
        client,
        Number(id),
        toInteger(adminId),
      );

      return res.status(200).send({
        message: ["Solicitação de cancelamento aprovada com sucesso!"],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };

  rejectCancellation = async (
    req: UserRequest,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = req.body.id;
      const adminId = req.id;
      const client = await connectionPool.getInstance().connect();
      await client.query("BEGIN");
      await this.model.rejectCancellation(
        client,
        Number(id),
        toInteger(adminId),
      );

      return res.status(200).send({
        message: ["Solicitação de cancelamento rejeitada com sucesso!"],
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };

  getByUserId = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.id;
      const eventModel = new EventModel();
      const dependentModel = new DependentsModel();
      const client = await connectionPool.getInstance().connect();
      const subscriptions: SubscriptionOut[] = await this.model.getByUserId(
        client,
        toInteger(userId),
      );

      for (const subscription of subscriptions) {
        if (subscription.dependentId) {
          const dependent = await dependentModel.getById(
            subscription.dependentId,
          );
          subscription.dependent = {
            name: dependent?.name,
          };
        }
        const event = await eventModel.getById(subscription.eventId);
        subscription.event = event;
      }

      return res.status(200).json({ subscriptions });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };

  getByEventId = async (req: UserRequest, res: Response): Promise<Response> => {
    try {
      const eventId = req.params.id;
      const userModel = new UserModel();
      const dependentModel = new DependentsModel();
      const client = await connectionPool.getInstance().connect();
      const subscriptions: SubscriptionOut[] = await this.model.getByEventId(
        client,
        toInteger(eventId),
      );

      for (const subscription of subscriptions) {
        const user = await userModel.getById(subscription.userId);

        if (subscription.dependentId) {
          const dependent = await dependentModel.getById(
            subscription.dependentId,
          );
          subscription.dependent = {
            name: dependent?.name,
            observation: dependent?.observation,
          };
        }

        subscription.user = {
          name: user?.name,
          email: user?.email,
        };
      }

      return res.status(200).json({ subscriptions });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: ["Erro do servidor!", err] });
    }
  };
}
