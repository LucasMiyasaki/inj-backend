import { Meeting } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class MeetingModel {
  post = async (meeting: Meeting): Promise<Meeting> => {
    return await prismaClient.meeting.create({
      data: {
        name: meeting.name,
        description: meeting.description,
        startDate: meeting.startDate,
        endDate: meeting.endDate,
      },
    });
  };

  getById = async (id: number): Promise<Meeting | null> => {
    return await prismaClient.meeting.findUnique({
      where: {
        id,
      },
    });
  };

  getAll = async (): Promise<Meeting[]> => {
    return await prismaClient.meeting.findMany();
  };

  update = async (id: number, meeting: Meeting): Promise<Meeting> => {
    return await prismaClient.meeting.update({
      where: {
        id,
      },
      data: meeting,
    });
  };

  delete = async (id: number): Promise<Meeting> => {
    return await prismaClient.meeting.delete({
      where: {
        id,
      },
    });
  };
}
