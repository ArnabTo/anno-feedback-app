import { Resend } from "resend";
import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function verificationEmailSend(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({ username, otp: verificationCode }),
        });
        return ({ success: true, message: 'Verification email send successfully' })
    } catch (error) {
        console.error('Error while sending verification email', error)
    }
    return ({ success: false, message: 'Failed to send varification email' })
}