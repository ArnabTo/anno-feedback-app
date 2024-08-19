import connectDB from "@/lib/connectDB";
import UserModel from "@/model/User";
 
export async function POST(request: Request) {
    await connectDB();

    try {
        const {username, code} = await request.json();

      const decodedUsername = decodeURIComponent(username); //optional
    
      const user = await UserModel.findOne({ username: decodedUsername, isVerified: false});
        
      if(!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            });
        }   

        const isCodeValid = user.verificationCode == code;  
        const isCodeNotExpired = new Date(user.verificationCodeExpiry) > new Date();

        if(isCodeValid || isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            
            return Response.json({
                success: true,
                message: 'Code verified successfully'
            }, {
                status: 200
            });

        }else if(!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'Code has expired. Please Signup again'
            }, {
                status: 400
            });
        }else{
            return Response.json({
                success: false,
                message: 'Invalid code'
            }, {
                status: 400
            });
        }


    } catch (error) {
        console.error('Error while verifying code',error);
        return Response.json({success: false, message: 'Failed to verify code'}
            ,{status: 500}
        );
    }
}