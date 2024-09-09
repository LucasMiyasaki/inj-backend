import { Advertise } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class AdvertiseModel {
  post = async (advertise: Advertise): Promise<Advertise> => {
    console.log(advertise);
    return await prismaClient.advertise.create({
      data: {
        name: advertise.name,
        description: advertise.description,
        startDate: advertise.startDate,
        endDate: advertise.endDate,
        url: advertise.url,
        show: advertise.show
      },
    });
  };

  getById = async (id: number): Promise<Advertise | null> => {
    return await prismaClient.advertise.findUnique({
      where: {
        id,
      },
    });
  };

  getAll = async (): Promise<Advertise[]> => {
    return await prismaClient.advertise.findMany();
  };

  update = async (id: number, advertise: Advertise): Promise<Advertise> => {
    return await prismaClient.advertise.update({
      where: {
        id,
      },
      data: advertise,
    });
  };

  delete = async (id: number): Promise<Advertise> => {
    return await prismaClient.advertise.delete({
      where: {
        id,
      },
    });
  };
}
