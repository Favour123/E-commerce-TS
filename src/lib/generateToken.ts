import jwt from 'jsonwebtoken';
import { JwtPayload } from "../types/user";


const SECRET_KEY = process.env.SECRET_KEY;


export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET_KEY!, { expiresIn: "7d" }); // shorter expiry
};
