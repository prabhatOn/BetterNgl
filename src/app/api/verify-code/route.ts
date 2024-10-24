import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';

const isVerificationCodeValid = (user: any, code: string) => {
    const isCodeCorrect = user.verifyCode === code;
    const isNotExpired = user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) > new Date();
    return isCodeCorrect && isNotExpired;
};

export async function POST(request: Request) {
    try {
        const { username, code } = await request.json();
        if (!username || !code) {
            return NextResponse.json(
                { success: false, message: 'Username and verification code are required.' },
                { status: 400 }
            );
        }
        const decodedUsername = decodeURIComponent(username.trim());
        await dbConnect();
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
        if (isVerificationCodeValid(user, code)) {
            user.isVerified = true;
            await user.save();

            return NextResponse.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
            );
        }
        const isExpired = user.verifyCodeExpiry && new Date(user.verifyCodeExpiry) <= new Date();
        const errorMessage = isExpired
            ? 'Verification code has expired. Please sign up again to get a new code.'
            : 'Incorrect verification code';

        return NextResponse.json(
            { success: false, message: errorMessage },
            { status: 400 }
        );

    } catch (error) {
        console.error('Error verifying user:', error);
        return NextResponse.json(
            { success: false, message: 'Error verifying user' },
            { status: 500 }
        );
    }
}
