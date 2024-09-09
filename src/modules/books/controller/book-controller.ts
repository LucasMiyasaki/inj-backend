/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-useless-catch */
import { Book, BookType } from "@prisma/client";
import { Request, Response } from "express";
import fs from "fs";
import { isNil, toInteger } from "lodash";
import path from "path";
import { UserRequest } from "../../../common/entities/user-request";
import BookModel from "../model/book-model";
import prismaClient from "../../../client/client";

const bookModel = new BookModel();

export default class BookController {
  post = async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionResult = await prismaClient.$transaction(async () => {
        try {
          const body: Book = {
            id: req.body.id,
            name: req.body.name,
            author: req.body.author,
            publisher: req.body.publisher,
            type: req.body.type,
            year: toInteger(req.body.year),
            url: req.file?.originalname ?? "",
          };

          const findBook = await bookModel.getBook(body);

          if (isNil(findBook)) {
            let book = await bookModel.post(body);

            const auxBody = {
              id: book.id,
              name: body.name,
              author: body.author,
              publisher: body.publisher,
              type: body.type,
              year: body.year,
              url: book.id + "-" + req.file?.originalname,
            };

            if (isNil(req.body.file)) {
              const oldpath = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "assets",
                "images",
                "book",
                String(req.file?.originalname),
              );
              const newpath = path.join(
                __dirname,
                "..",
                "..",
                "..",
                "assets",
                "images",
                "book",
                book.id + "-" + req.file?.originalname,
              );

              fs.rename(oldpath, newpath, (e) => {
                if (e != null) {
                  console.error("Erro ao renomear o arquivo:", e);
                  res.status(500).json({
                    error: "Erro ao renomear o arquivo",
                  });
                }
              });
            }

            book = await bookModel.update(toInteger(auxBody.id), auxBody);

            res.status(200).json({
              data: book,
            });
          } else {
            res.status(400).json({
              error: "Book already exists",
            });
          }
        } catch (error) {
          console.error("Erro na transação:", error);
          throw error;
        }
      });

      if (transactionResult === null) {
        res.status(500).json({
          error: "Transaction failed",
        });
      } else {
        res.status(200).json({
          message: "Transaction successful",
        });
      }
    } catch (error) {
      console.error("Erro ao processar requisição POST:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  };

  get = async (req: UserRequest, res: Response): Promise<void> => {
    try {
      const id = req.body.id;

      const book = await bookModel.get(Number(id));

      res.status(200).json({
        data: book,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { author, year, type, yearOperator } = req.query;

      const filter: any = {};

      if (author) {
        filter.author = author as string;
      }

      if (year) {
        const yearFilter: { gt?: number; lt?: number; eq?: number } = {};
        const parsedYear = parseInt(year as string);

        if (!isNaN(parsedYear)) {
          if (yearOperator === "greater") {
            yearFilter.gt = parsedYear;
          } else if (yearOperator === "less") {
            yearFilter.lt = parsedYear;
          } else {
            yearFilter.eq = parsedYear;
          }
        }

        filter.year = yearFilter;
      }

      if (type) {
        filter.type = type as BookType;
      }

      const books = await bookModel.getByFilter(filter);

      res.status(200).json({
        data: books,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    await prismaClient.$transaction(async (prisma) => {
      try {
        const body: Book = {
          id: req.body.id,
          name: req.body.name,
          author: req.body.author,
          publisher: req.body.publisher,
          type: req.body.type,
          url: req.body.id + "-" + req.file?.originalname,
          year: toInteger(req.body.year),
        };

        const book = await bookModel.update(toInteger(body.id), body);

        if (isNil(book)) {
          res.status(400).json({
            error: "Book not found",
          });
        } else {
          res.status(200).json({
            data: book,
          });
        }
      } catch (e) {
        throw e;
      }
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await prismaClient.$transaction(async (prisma) => {
      try {
        const id = req.body.id;

        const book = await bookModel.get(Number(id));

        if (isNil(book)) {
          res.status(400).json({
            error: "Book not found",
          });
        } else {
          await bookModel.delete(Number(id));

          const deletePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "assets",
            "images",
            "book",
            book.url,
          );

          fs.unlink(deletePath, (error) => {
            if (error) console.log(error);
          });

          res.status(200).json({
            message: "Book deleted successfully",
          });
        }
      } catch (e) {
        throw e;
      }
    });
  };
}
