import { ExpenditureType } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class ExpenditureTypeModel {
  post = async (expenditureType: ExpenditureType): Promise<ExpenditureType> => {
    return await prismaClient.expenditureType.create({
      data: {
        name: expenditureType.name,
      },
    });
  };

  getById = async (id: number): Promise<ExpenditureType | null> => {
    return await prismaClient.expenditureType.findUnique({
      where: {
        id,
      },
    });
  };

  getAll = async (): Promise<ExpenditureType[]> => {
    return await prismaClient.expenditureType.findMany();
  };

  update = async (
    id: number,
    expenditureType: ExpenditureType,
  ): Promise<ExpenditureType> => {
    return await prismaClient.expenditureType.update({
      where: {
        id,
      },
      data: expenditureType,
    });
  };

  delete = async (id: number): Promise<ExpenditureType> => {
    return await prismaClient.expenditureType.delete({
      where: {
        id,
      },
    });
  };
}
