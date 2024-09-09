import { Book, BookType } from "@prisma/client";
import prismaClient from "../../../client/client";

export default class BookModel {
  post = async (book: Book): Promise<Book> => {
    return await prismaClient.book.create({
      data: book,
    });
  };

  getBook = async (book: Book): Promise<Book | null> => {
    return await prismaClient.book.findFirst({
      where: {
        name: book.name,
        author: book.author,
        publisher: book.publisher,
        year: book.year,
        type: book.type,
      },
    });
  };

  getAll = async (): Promise<Book[]> => {
    return await prismaClient.book.findMany();
  };

  get = async (id: number): Promise<Book | null> => {
    return await prismaClient.book.findFirst({
      where: {
        id,
      },
    });
  };

  getByAuthor = async (author: string): Promise<Book[]> => {
    return await prismaClient.book.findMany({
      where: {
        author,
      },
    });
  };

  getByYear = async (year: number): Promise<Book[]> => {
    return await prismaClient.book.findMany({
      where: {
        year,
      },
    });
  };

  getByType = async (type: BookType): Promise<Book[]> => {
    return await prismaClient.book.findMany({
      where: {
        type,
      },
    });
  };

  getByFilter = async (filter: {
    author?: string;
    year?: { gt?: number; lt?: number; eq?: number };
    type?: BookType;
  }): Promise<Book[]> => {
    const { author, year, type } = filter;

    return await prismaClient.book.findMany({
      where: {
        author,
        year: {
          gt: year?.gt,
          lt: year?.lt,
          equals: year?.eq,
        },
        type,
      },
    });
  };

  update = async (id: number, book: Book): Promise<Book> => {
    return await prismaClient.book.update({
      where: {
        id,
      },
      data: book,
    });
  };

  delete = async (id: number): Promise<Book> => {
    return await prismaClient.book.delete({
      where: {
        id,
      },
    });
  };
}
