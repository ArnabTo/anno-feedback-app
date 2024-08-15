import connectDB from "@/lib/connectDB";
import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Unauthorized'
        }), {
            status: 401
        });
    }

    const user = session.user as User;
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
            { $sort: { 'messages.createdAt': -1 } },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ]);

        console.log(user); // Debugging output

        if (!user || user.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), {
                status: 404
            });
        }

        return new Response(JSON.stringify({
            success: true,
            messages: user[0].messages
        }), {
            status: 200
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error'
        }), {
            status: 500
        });
    }
}

////////////////////Wrong code//////////////////////

// import connectDB from "@/lib/connectDB";
// import { getServerSession } from "next-auth";
// import UserModel from "@/model/User";
// import { User } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import mongoose from "mongoose";


// export async function GET(request: Request) {
//     await connectDB();

//     const session = await getServerSession(authOptions);

//     const user: User = session?.user;

//     if(!session || !session.user){
//         return Response.json({ 
//             success: false,
//             message: 'Unauthorized'
//         }, {
//             status: 401
//         })
//     }
// console.log(user._id)
//     const userId = new mongoose.Types.ObjectId(user._id);
// console.log(userId)

//     try {
//         const user = await UserModel.aggregate([
//             {$match: {_id: userId} },
//             {$unwind: "$messages"},
//             {$sort: {'messages.createdAt' : -1}},
//             {$group:{
//                 _id: "$_id",
//                 messages: {$push: "$messages"}
//             }}
//         ])

//         console.log(user)

//         if(!user || user.length === 0){
//             return Response.json({ 
//                 success: false,
//                 message: 'User not found'
//             }, {
//                 status: 404
//             })  
//         }

//         return Response.json({
//             success: true,
//             messages: user[0].messages
//         }, {
//             status: 200
//         })
//     }catch(error){
//         console.log(error);
//         return Response.json({ 
//             success: false,
//             message: 'Internal server error'
//         }, {
//             status: 500
//         })
//     }

// }