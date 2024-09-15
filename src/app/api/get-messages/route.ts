import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const _user = session.user;
    const userId = new mongoose.Types.ObjectId(_user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } }, 
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!user || user.length === 0) {
            console.log('User not found or empty messages:', user);
            return new Response(
                JSON.stringify({ message: 'User not found', success: false }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('User messages:', user[0].messages);
        return new Response(
            JSON.stringify({ messages: user[0].messages }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return new Response(
            JSON.stringify({ message: 'Internal server error', success: false }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
