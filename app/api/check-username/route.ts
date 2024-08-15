import { z } from 'zod';
import connectDB from '@/lib/connectDB';
import UserModel from '@/model/User';
import { userNameValidation } from '@/schemas/signUpSchema';

const usernameQuerySchema = z.object({
  username: userNameValidation,
})

export async function GET(request: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username')
    }

    const result = usernameQuerySchema.safeParse(queryParam);
    console.log(result, 'result from check username')

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];
      console.log(userNameErrors, 'userNameErrors');
      return Response.json({
        success: false,
        message: 'Invalid username',
        errors: userNameErrors
      })
    } else {
      const { username } = result.data;
 
      const user = await UserModel.findOne({ username, isVerified: true });
      if (user) {
        return Response.json({
          success: false,
          message: 'Username is already taken'
        }, {
          status: 400
        })
      } else {
        return Response.json({
          success: true,
          message: 'Username is available',
        })
      }
    }
  } catch (error) {
    console.error('Error while checking username', error)
    return Response.json({
      success: false,
      message: 'Error while checking username',
    }, {
      status: 500
    })
  }
}