'use client';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
const FeedbackPage = () => {

    const [loading, setLoading] = useState(false);
    const { username } = useParams<{ username: string }>()
    const { toast } = useToast();

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: '',
        },
    })
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {

        setLoading(true);
        try {
            const result = await axios.post('/api/send-message', {
                ...data,
                username
            })

            toast({
                title: 'Success',
                description: 'Message sent successfully',
                variant: 'default'
            })

            form.reset();

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: 'Error',
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })

        } finally {
            setLoading(false);

        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-zinc-950 font-extrabold text-4xl lg:text-6xl text-center flex flex-col lg:flex-row gap-5 justify-center items-center ">Wellcome to <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">AnnoChat</span></h1>
            <p className="text-center text-xl mt-4 mb-10">Provide your true feedback here. You will be kept anonymous.</p>
            <Card className="w-[350px] md:w-[500px]">
                <CardContent className="py-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Message</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Type your message here." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                Send
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeedbackPage;