import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import app from './app';
import {dbConnect} from './config/db';


const port = process.env.PORT;

const startServer = async()=>{
    await dbConnect();
    app.listen(port,()=>{
        console.log(`Server listening to Port ${port}`);
    })
}

startServer();