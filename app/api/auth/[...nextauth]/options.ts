import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {

                await connectDB();
                try {
        
                    const findUser = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!findUser) {
                        throw new Error("Invalid credentials")
                    }
                    if (!findUser.isVerified) {
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
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isMessageAccpet = user.isMessageAccpet
            }
            return token
        },
        async session({ session, user, token }) {
            if(token){
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.name = token.username,
                session.user.isMessageAccpet = token.isMessageAccpet
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}