import { Message } from "@/model/User"

export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptMessage?: boolean,
    messages?: Array<Message>
}

