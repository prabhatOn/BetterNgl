import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';

/**
 * Sends a verification email to the user.
 * 
 * @param email - The recipient's email address.
 * @param username - The user's username.
 * @param verifyCode - The verification code to include in the email.
 * @returns A promise resolving to an ApiResponse indicating success or failure.
 */
export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    // Optional: Validate email format before sending
    if (!validateEmail(email)) {
        return { success: false, message: 'Invalid email format.' };
    }

    try {
        await resend.emails.send({
            from: process.env.EMAIL_FROM || 'default@yourdomain.com', // Use environment variable
            to: email,
            subject: 'TBH Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error('Error sending verification email:', emailError);
        return { success: false, message: 'Failed to send verification email.' };
    }
}

/**
 * Validates the email format.
 * 
 * @param email - The email address to validate.
 * @returns True if the email format is valid, otherwise false.
 */
function validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
