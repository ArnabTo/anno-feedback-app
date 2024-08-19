import { transporter } from '@/lib/nodemailer';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/components/ui/use-toast';

export async function sendVerificationCode(email: string, username: string, verificationCode: string): Promise<ApiResponse> {
    try {
        console.log(email, username, verificationCode);
        const mailOptions = {
            from: `"Annofeedback" <sLs9v@example.com>`,
            to: email,
            subject: 'Verification code',
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
                <h2 style="text-align: center; color: #333;">Verification Code</h2>
                <p>Hi <strong>${username}</strong>,</p>
                <p>Thank you for signing up. Your verification code is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 24px; font-weight: bold; color: #000;">${verificationCode}</span>
                </div>
                <p>Please use this code to verify your email. The code is valid for 10 minutes.</p>
                <p>Best regards,<br>Your App Team</p>
            </div>
        `,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: 'Verification email sent successfully' };
    } catch (error) {
        console.error('Error while sending verification email:', error); 
        return { success: false, message: 'Failed to send verification email' };
    }
}
