import { Expenditure } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class ExpenditureModel {
  post = async (expenditure: Expenditure): Promise<Expenditure> => {
    console.log(expenditure);
    
    return await prismaClient.expenditure.create({
      data: {
        value: expenditure.value,
        description: expenditure.description,
        installments: expenditure.installments,
        parcels: expenditure.parcels,
        fee: expenditure.fee,
        dueDate: expenditure.dueDate,
        expenditureTypeId: expenditure.expenditureTypeId,
        payedDate: expenditure.payedDate
      }
    })
  }

  getById = async (id: number): Promise<Expenditure | null> => {
    return await prismaClient.expenditure.findUnique({
      where: {
        id,
      },
    });
  };

  getAll = async (): Promise<Expenditure[]> => {
    return await prismaClient.expenditure.findMany();
  }

  getByRange = async (startDate: Date, endDate: Date): Promise<Expenditure[]> => {
    return await prismaClient.expenditure.findMany({
      where: {
        dueDate: {
          gte: startDate,
          lte: endDate
        }
      },
    });
  };

  update = async (id: number, expenditure: Expenditure): Promise<Expenditure> => {
    return await prismaClient.expenditure.update({
      where: {
        id,
      },
      data: expenditure,
    })
  }

  delete = async (id: number): Promise<Expenditure> => {
    return await prismaClient.expenditure.delete({
      where: {
        id
      }
    })
  }
}