import connectDB from "@/lib/connectDB";
import bcrypt from 'bcryptjs'
import { verificationEmailSend } from "@/helper/verificationCodeSend";
import UserModel from "@/model/User";

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

        const userExistWithUsername = await UserModel.findOne({ username, isVarified: true });

        if (userExistWithUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            })
        }

        const isUserExist = await UserModel.findOne({ email, isVarified: true });
        const varificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (isUserExist) {
            if (isUserExist.isVarified) {
                return Response.json({
                    success: false,
                    message: 'User already exist'
                }, { status: 400 })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                isUserExist.password = hashedPassword;
                isUserExist.verificationCode = varificationCode;
                isUserExist.verificationCodeExpiry = new Date(Date.now() + 3600000);
                await isUserExist.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1);

            const createUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verificationCode: varificationCode,
                verificationCodeExpiry: expiryDate,
                isVarified: false,
                isMessageAccpet: true,
                messages: []
            })
            await createUser.save();

            const emailResponse = await verificationEmailSend(email, username, varificationCode);
            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: 'Error while sending verification email'
                }, { status: 500 })
            } else {
                return Response.json({
                    success: true,
                    message: 'User registered successfully'
                }, { status: 200 })
            }
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