
//protection from unknown route entry
import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken';

//for type safety in the compile time
export interface authType extends Request{
    user?:{
        id:string,
    };
}

export const protect = (req:authType,res:Response,next:NextFunction) =>{
    const authHeader = req.headers.authorization;
    //authorizes the header format whether it is in the format - bearer xxxxx.yyyyy,zzzzz
    if(!authHeader||!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({message:"Not authorized"})
    }

    try {
        //splits the header into half and take the actual token
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY as string
        ) as {id:string};

        //taken the id from the decoded token 
        req.user = {id:decoded.id};
        next(); //it is made for prohibiting the user to wait forever for the request
    } catch (error) {
        res.status(400).json({message:"Token invalid"});
    }
}