import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { match } from "assert";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await connectDB();
                try {
                    // const user = await UserModel.findOne({
                    //     email: credentials?.email, isVarified: true;
                    // });
                    const findUser = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!findUser) {
                        throw new Error("Invalid credentials")
                    }
                    if (!findUser.isVarified) {
                        throw new Error("Please verify your email")
                    }

                    const matchPassword = await bcrypt.compare(credentials.password, findUser.password)
                    if (matchPassword) {
                        return findUser;
                    } else {
                        throw new Error("Invalid credentials")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ]
}