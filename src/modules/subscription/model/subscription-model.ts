import { PoolClient } from "pg";
import SubscriptionDAO from "../DAO/subscription-dao";
import { Subscription, SubscriptionPayment } from "@prisma/client";

export class SubscriptionModel {
  private static instance: SubscriptionModel;

  private constructor() {}

  public static getInstance(): SubscriptionModel {
    if (!SubscriptionModel.instance) {
      SubscriptionModel.instance = new SubscriptionModel();
    }
    return SubscriptionModel.instance;
  }

  async create(
    client: PoolClient,
    subscription: {
      userId: number;
      eventId: number;
      payment: SubscriptionPayment;
      dependentId: number | null;
    },
  ): Promise<void> {
    const { userId, eventId, payment, dependentId } = subscription;
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.create(
      client,
      userId,
      eventId,
      payment,
      dependentId,
    );
  }

  async getByUserId(
    client: PoolClient,
    userId: number,
  ): Promise<Subscription[]> {
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.getByUserId(client, userId);
  }

  async updateStatus(
    client: PoolClient,
    id: number,
    status: string,
  ): Promise<void> {
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.updateStatus(client, id, status);
  }

  async requestCancellation(
    client: PoolClient,
    id: number,
  ): Promise<void> {
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.requestCancellation(client, id);
  }

  async approveCancellation(
    client: PoolClient,
    id: number,
    adminId: number,
  ): Promise<void> {
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.approveCancellation(client, id, adminId);
  }

  async rejectCancellation(
    client: PoolClient,
    id: number,
    adminId: number,
  ): Promise<void> {
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.rejectCancellation(client, id, adminId);
  }

  async getByEventId(
    client: PoolClient,
    eventId: number,
  ): Promise<Subscription[]> {
    const subscriptionDAO = new SubscriptionDAO();
    return await subscriptionDAO.getByEventId(client, eventId);
  }
}
