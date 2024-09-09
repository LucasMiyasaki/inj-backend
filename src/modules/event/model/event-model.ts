import { Event } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class EventModel {
  post = async (event: Event): Promise<Event> => {
    return await prismaClient.event.create({
      data: {
        name: event.name,
        description: event.description,
        capacity: event.capacity,
        startDate: event.startDate,
        endDate: event.endDate,
      },
    });
  };

  getById = async (id: number): Promise<Event | null> => {
    return await prismaClient.event.findUnique({
      where: {
        id,
      },
    });
  };

  getByName = async (name: string): Promise<Event | null> => {
    return await prismaClient.event.findFirst({
      where: {
        name,
      },
    });
  };

  getEvents = async (): Promise<Event[]> => {
    return await prismaClient.event.findMany({});
  };

  getAvailableEventsForUser = async (userId: number): Promise<Event[]> => {
    return await prismaClient.event.findMany({
      where: {
        NOT: {
          subscription: {
            some: {
              userId,
            },
          },
        },
      },
    });
  };

  getAttendedEventsByUser = async (userId: number): Promise<Event[]> => {
    return await prismaClient.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
        subscription: {
          some: {
            userId,
          },
        },
      },
    });
  };

  getEventCapacity = async (id: number): Promise<number> => {
    const res = await prismaClient.event.findUnique({
      where: {
        id,
      },
    });

    return res?.capacity ?? 0;
  };

  getEventSubscription = async (eventId: number): Promise<number> => {
    return await prismaClient.subscription.count({
      where: {
        eventId,
      },
    });
  };
}
