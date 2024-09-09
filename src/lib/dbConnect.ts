/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';

type ConnectionObject = {
    isConnected?: number
}
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Using existing connection');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',) //add option after studing mongoose
        connection.isConnected = db.connections[0].readyState
        console.log('New DB connection created');
        console.log('DB connection state:', connection.isConnected);
        console.log('DB connection state:', db.connections[0].readyState);
        console.log('DB:', db);
    } catch (error) {
        console.error('Error connecting to database', error);
        process.exit(1);
    }
    
}

export default dbConnect;