import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { registerSchema, loginSchema } from '../validations/auth.validations'
import { User } from '../models/user.model';
import { generateToken } from '../utils/generateToken'

export const Register = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({ message: parsed.error });
        }
        const { name, email, password } = parsed.data;
        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        

        const token = generateToken(user._id.toString());

        return res.status(200).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                // password: user.password
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"Error occurred while registering",
            error
        })
    }
}

export const Login = async (req:Request,res:Response) =>{
    try {
        const parsed = loginSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({message:parsed.error.issues[0].message});
        }

        const {email,password} = parsed.data;

        const existedUser = await User.findOne({email});

        if(!existedUser){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const passMatch = await bcrypt.compare(password, existedUser.password);

        if(!passMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token = generateToken(existedUser._id.toString());

        return res.status(200).json({
            message:"User Logged In Successfully",
            token,
            user:{
                email:existedUser.email,
                password:existedUser.password,
            }
        })

    } catch (error) {
        res.status(500).json({
            message:"Error occurred while logging",
            error
        })
    }
}
