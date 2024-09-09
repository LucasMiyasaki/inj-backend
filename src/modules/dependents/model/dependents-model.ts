import { Dependents } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class DependentsModel {
  post = async (dependent: Dependents): Promise<Dependents> => {
    return await prismaClient.dependents.create({
      data: {
        userId: dependent.userId,
        name: dependent.name,
        observation: dependent.observation,
      },
    });
  };

  getDependentByName = async (
    userId: number,
    name: string,
  ): Promise<Dependents | null> => {
    return await prismaClient.dependents.findFirst({
      where: {
        userId,
        name,
      },
    });
  };

  getByUserId = async (userId: number): Promise<Dependents[]> => {
    return await prismaClient.dependents.findMany({
      where: {
        userId,
      },
    });
  };

  getById = async (id: number): Promise<Dependents | null> => {
    return await prismaClient.dependents.findFirst({
      where: {
        id,
      },
    });
  };
}
