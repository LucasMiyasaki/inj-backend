import { PoolClient } from "pg";

export default class SubscriptionDAO {
  async create(
    client: PoolClient,
    userId: number,
    eventId: number,
    payment: string,
    dependentId: number | null,
  ): Promise<void> {
    try {
      await client.query(
        'INSERT INTO "Subscription" ("userId", "eventId", "payment", "dependentId") VALUES ($1, $2, $3, $4)',
        [userId, eventId, payment, dependentId],
      );

      await client.query("COMMIT");
      client.release();
      console.log("Subscription created successfully");
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw error;
    }
  }

  async updateStatus(
    client: PoolClient,
    id: number,
    status: string,
  ): Promise<void> {
    try {
      await client.query(
        'UPDATE "Subscription" SET "status" = $1 WHERE "id" = $2',
        [status, id],
      );
      await client.query("COMMIT");
      client.release();
      console.log("Subscription status updated successfully");
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw error;
    }
  }

  async requestCancellation(client: PoolClient, id: number): Promise<void> {
    try {
      await client.query(
        'UPDATE "Subscription" SET "cancelRequest" = TRUE, "cancelRequestStatus" = \'PENDING\' WHERE "id" = $1',
        [id],
      );
      await client.query("COMMIT");
      client.release();
      console.log("Cancellation request submitted successfully");
    } catch (error) {
      console.error("Error submitting cancellation request:", error);
      throw error;
    }
  }

  async approveCancellation(
    client: PoolClient,
    id: number,
    adminId: number,
  ): Promise<void> {
    try {
      await client.query(
        'UPDATE "Subscription" SET "status" = \'REJECTED\', "cancelRequestApprovedBy" = $1, "cancelRequestApprovalDate" = CURRENT_TIMESTAMP, "cancelRequestStatus" = \'APPROVED\' WHERE "id" = $2',
        [adminId, id],
      );
      await client.query("COMMIT");
      client.release();
      console.log("Cancellation request approved successfully");
    } catch (error) {
      console.error("Error approving cancellation request:", error);
      throw error;
    }
  }

  async rejectCancellation(
    client: PoolClient,
    id: number,
    adminId: number,
  ): Promise<void> {
    try {
      await client.query(
        'UPDATE "Subscription" SET "cancelRequestStatus" = \'REJECTED\', "cancelRequestApprovedBy" = $1, "cancelRequestApprovalDate" = CURRENT_TIMESTAMP WHERE "id" = $2',
        [adminId, id],
      );
      await client.query("COMMIT");
      client.release();
      console.log("Cancellation request rejected successfully");
    } catch (error) {
      console.error("Error rejecting cancellation request:", error);
      throw error;
    }
  }

  async getByUserId(client: PoolClient, userId: number): Promise<any[]> {
    try {
      const result = await client.query(
        'SELECT * FROM "Subscription" WHERE "userId" = $1',
        [userId],
      );

      client.release();
      return result.rows;
    } catch (error) {
      console.error("Error fetching subscriptions by user id:", error);
      throw error;
    }
  }

  async getByEventId(client: PoolClient, eventId: number): Promise<any[]> {
    try {
      const result = await client.query(
        'SELECT * FROM "Subscription" WHERE "eventId" = $1',
        [eventId],
      );

      client.release();
      return result.rows;
    } catch (error) {
      console.error("Error fetching subscriptions by event id:", error);
      throw error;
    }
  }
}
