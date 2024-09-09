import { User, UserStatus, UserType } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class UserModel {
  post = async (user: User): Promise<User> => {
    return await prismaClient.user.create({
      data: {
        name: user.name,
        document: user.document,
        email: user.email,
        password: user.password,
        phone: user.phone,
        type: user?.type ?? UserType.MEMBER,
        status: user?.status ?? UserStatus.PENDING,
      },
    });
  };

  getAttempts = async (id: number): Promise<number> => {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    return user?.attempts ?? 0;
  };

  incrementAttempts = async (id: number): Promise<User> => {
    return await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });
  };

  clearAttempts = async (id: number): Promise<User> => {
    return await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        attempts: 0,
      },
    });
  };

  getById = async (id: number): Promise<User | null> => {
    return await prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  };

  getByDocument = async (document: string): Promise<User | null> => {
    return await prismaClient.user.findUnique({
      where: {
        document,
      },
    });
  };

  getByPhone = async (phone: string): Promise<User | null> => {
    return await prismaClient.user.findUnique({
      where: {
        phone,
      },
    });
  };

  getByEmail = async (email: string): Promise<User | null> => {
    return await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
  };

  update = async (id: number, user: User): Promise<User> => {
    return await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    });
  };

  delete = async (id: number): Promise<User> => {
    return await prismaClient.user.delete({
      where: {
        id,
      },
    });
  };

  updateStatus = async (id: number, status: UserStatus): Promise<User> => {
    return await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  };

  updatePassword = async (id: number, password: string): Promise<User> => {
    return await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  };

  getAll = async (): Promise<User[]> => {
    return await prismaClient.user.findMany({
      orderBy: {
        status: "desc",
      },
      where: {
        type: UserType.MEMBER,
      },
    });
  };
}
