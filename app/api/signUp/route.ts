import connectDB from "@/lib/connectDB";
import { User } from "@/model/User";
import bcrypt from 'bcryptjs'
import { verificationEmailSend } from "@/helper/verificationCodeSend";

export async function POST(request: Request) {
    await connectDB();

    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return Response.json({
                success: false,
                message: 'All fields are required'
            }, {
                status: 400
            })
        }
    } catch (error) {
        console.error('Error while registering user', error)
        return Response.json({
            success: false,
            message: 'Error while registering user'
        }, {
            status: 500
        })
    }
}