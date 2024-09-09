import { Income } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class IncomeModel {
  post = async (income: Income): Promise<Income> => {
    return await prismaClient.income.create({
      data: {
        amount: income.amount,
        description: income.description,
        type: income.type,
        date: income.date
      }
    })
  }

  getById = async (id: number): Promise<Income | null> => {
    return await prismaClient.income.findUnique({
      where: {
        id,
      },
    });
  };

  getAll = async (): Promise<Income[]> => {
    return await prismaClient.income.findMany();
  }

  getByRange = async (startDate: Date, endDate: Date): Promise<Income[]> => {
    return await prismaClient.income.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
    });
  };

  update = async (id: number, income: Income): Promise<Income> => {
    return await prismaClient.income.update({
      where: {
        id,
      },
      data: income,
    })
  }

  delete = async (id: number): Promise<Income> => {
    return await prismaClient.income.delete({
      where: {
        id
      }
    })
  }
}