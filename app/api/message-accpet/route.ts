import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);
    console.log(session);

    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 401
        })
    }

    const userID = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userID,
            { isMessageAccpet: acceptMessages },
            { new: true }
        );

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: 'Something went wrong'
            }, {
                status: 500
            })
        } else {
            return Response.json({
                success: true,
                message: 'Message acceptance status Updated successfully',
                updatedUser
            }, {
                status: 200
            })
        }
    } catch (err) {
        return Response.json({
            success: false,
            message: 'Something went wrong'
        }, {
            status: 500
        })
    }

}


export async function GET(request: Request) {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Unauthorized'
        }, {
            status: 401
        })
    }

    const user: User = session?.user;

    const userID = user._id;

    try {
        const findUser = await UserModel.findById(userID);

        if (!findUser) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            })
        }

        return Response.json({
            success: true,
            message: 'User found',
            isMessageAccpet: findUser.isMessageAccpet
        }, {
            status: 200
        })
    } catch (err) {
        return Response.json({
            success: false,
            message: 'Something went wrong'
        }, {
            status: 500
        })
    }


}