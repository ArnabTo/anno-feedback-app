import { Message } from "@/model/User"

export interface ApiResponse{
    success: boolean,
    message: string,
    isMessageAccpet?: boolean,
    messages?: Array<Message>
}

