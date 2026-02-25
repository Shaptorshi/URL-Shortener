import mongoose from 'mongoose';
// import {redis} from './redis'

export const dbConnect = async():Promise<void>=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string);

        console.log(`Connected Successfully `);
    } catch (error) {
        console.log(`Error occurred:${error}`);
    }
}