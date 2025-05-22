import { NextFunction, Request, Response } from "express";
import 'dotenv/config';
import  jwt, { JwtPayload }  from "jsonwebtoken";

// Extend Request interface to include `userId`
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string,process.env.JWT_SECRET!)
    if(decoded){
        if(typeof decoded ==="string"){
            res.status(401).json({
                message:"You are not logged in"
            })
            return;
        }
        req.userId = (decoded as JwtPayload).userId;
        next()
    }else{
        res.status(401).json({
                message:"You are not logged in"
        })
    }
}