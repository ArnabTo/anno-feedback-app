import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await connectDB();

    const {username, content} = await request.json();

    try{
          const user = await UserModel.findOne({username});

          if(!user){
            return Response.json({ 
                success: false,
                message: 'User not found'
            }, {
                status: 404
            })
          }

          if(!user.isMessageAccpet){
            return Response.json({ 
                success: false,
                message: 'User is not accepting messages'
            }, {
                status: 404
            })
          }

          const newMessage = {content, createdAt: new Date()};

          user.messages.push(newMessage as Message);
          await user.save();

          return Response.json({
              success: true,
              message: 'Message sent successfully'
          }, {
              status: 200
          })
    }catch(error){
        return Response.json({
            success: false,
            message: 'Internal server error'
        }, {
            status: 500
        })
    }
}