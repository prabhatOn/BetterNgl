import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { messageid: string } }
) {
    const messageId = params.messageid;
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return new Response(
            JSON.stringify({ success: false, message: 'Not authenticated' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
    }

    const userId = session.user._id;

    try {
        const updateResult = await UserModel.updateOne(
            { _id: userId },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updateResult.modifiedCount === 0) {
            return new Response(
                JSON.stringify({ success: false, message: 'Message not found or already deleted' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Message deleted' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error deleting message' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
