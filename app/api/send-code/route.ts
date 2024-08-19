import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";


export async function POST(request: Request) {
    await connectDB();

    const session = await getServerSession();

    if (!session) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Unauthorized'
        }), {   
            status: 401
        })
    }
}