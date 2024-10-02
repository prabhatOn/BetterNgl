import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, verifyCode, newPassword } = req.body;

    // Validate input
    if (!email || !verifyCode || !newPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const user = await UserModel.findOne({ email, verifyCode });

        // Check if user exists and if the verification code is still valid
        if (!user || !user.verifyCodeExpiry || user.verifyCodeExpiry.getTime() < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.verifyCode = null; // Clear the code after successful reset
        user.verifyCodeExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
}
