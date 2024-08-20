import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {

    const messageid = params.messageid;
    console.log(messageid)
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

    try {
        const user = await UserModel.findOne({ "messages._id": messageid });
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, { status: 404 })
        }

        const deleteMessage = await UserModel.updateOne({ _id: user._id }, {
            $pull: {
                messages: {
                    _id: messageid
                }
            }
        });

        if (deleteMessage.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: 'Failed to delete message'
            }, { status: 500 })
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        })

    } catch (error) {
        console.log(error);
        return Response.json({
            success: false,
            message: 'Internal server error'
        }, {
            status: 500
        })
    }
}
