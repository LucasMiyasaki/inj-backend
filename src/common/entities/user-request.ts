import { Request } from "express";

export interface UserRequest extends Request {
  id?: number;
  type?: string;
}
