import { Message } from "@/model/User";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProp = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}
const MsgCard = ({ message, onMessageDelete}: MessageCardProp) => {

    const {toast} = useToast();

    const handleDelete = async () =>{
       const result = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    
       toast({
        title: result.data.message
       })

       onMessageDelete(message._id);
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Anonymous user</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{message.content}</p>
            </CardContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>

    );
};

export default MsgCard;