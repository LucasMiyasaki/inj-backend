import { Event } from "@prisma/client";
import EventModel from "../model/event-model";
import { Request, Response } from "express";
import { isNil, toInteger } from "lodash";
import { UserRequest } from "../../../common/entities/user-request";
import prismaClient from "../../../client/client";

const eventModel = new EventModel();

export default class EventController {
  post = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const body: Event = req.body;

      const event = await eventModel.post(body);

      res.status(200).json({
        status: res.statusCode,
        data: {
          id: event.id,
          name: event.name,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          capacity: event.capacity,
        },
      });
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;

      const event = await eventModel.getById(toInteger(id));

      if (!isNil(event)) {
        res.status(200).json({
          data: {
            id: event.id,
            name: event.name,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            capacity: event.capacity,
          },
        });
      } else {
        res.status(404).json({
          error: "Event not found",
        });
      }
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };

  getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
      const events = await eventModel.getEvents();

      if (!isNil(events)) {
        res.status(200).json({
          data: events,
        });
      } else {
        res.status(404).json({
          error: "No events found",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getAvailableEventsForUser = async (
    req: UserRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.id;

      console.log(userId);

      const events = await eventModel.getAvailableEventsForUser(
        toInteger(userId),
      );

      if (!isNil(events)) {
        res.status(200).json({
          data: events,
        });
      } else {
        res.status(404).json({
          error: "No events found",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getAttendedEventsForUser = async (
    req: UserRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.id;

      const events = await eventModel.getAttendedEventsByUser(
        toInteger(userId),
      );

      if (!isNil(events)) {
        res.status(200).json({
          data: events,
        });
      } else {
        res.status(404).json({
          error: "No events found",
        });
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getEventCapacity = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventId = req.params.id;

      const capacity = await eventModel.getEventCapacity(toInteger(eventId));

      res.status(200).json({
        data: {
          capacity,
        },
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getEventSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const eventId = req.params.id;

      const subscriptions = await eventModel.getEventSubscription(
        toInteger(eventId),
      );

      res.status(200).json({
        data: {
          subscriptions,
        },
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;

    try {
      await prismaClient.$transaction(async (tx) => {
        await tx.subscription.deleteMany({
          where: {
            eventId: parseInt(id),
          },
        });

        const deletedMeeting = await tx.event.delete({
          where: {
            id: parseInt(id),
          },
        });

        res.status(200).json(deletedMeeting);
      });
    } catch (e) {
      res.status(500).json({
        error: e,
      });
    }
  };
}
