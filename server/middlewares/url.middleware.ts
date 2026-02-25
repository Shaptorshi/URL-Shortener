import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export const authRequest=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next();
    }
    try {
            const token = authHeader.split(' ')[1];
            //decoding the token using the secret key
            //while logging in it the key must match with this secret key
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY||'your_secret_key');

            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(404).json({message:"Error occurred: ",error});
            next();
        }
}