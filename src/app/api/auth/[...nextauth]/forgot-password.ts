import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await dbConnect();

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email } = req.body;

    // Validate input
    if (!email || typeof email !== 'string' || !/.+@.+\..+/.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 3600000); // Expires in 1 hour
        await user.save();

        await sendVerificationEmail(user.email, user.username, verifyCode);

        res.status(200).json({ message: 'Verification code sent' });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ message: 'Error sending verification code' });
    }
}
