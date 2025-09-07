import jwt from 'jsonwebtoken';
import { JwtPayload } from "../types/user";
import { Request, Response } from "express";

const SECRET_KEY = process.env.SECRET_KEY;


export const generateTokenAndSetCookie = (payload: JwtPayload, res: Response) => {
  const token = jwt.sign(payload, SECRET_KEY!, { expiresIn: "15d" });

  res.cookie("jwt", token, { 
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  });

  return token; // return if you want to use it
};
