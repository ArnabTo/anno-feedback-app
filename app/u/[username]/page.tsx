'use client';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-zinc-950 font-extrabold text-6xl text-center">Wellcome to Annochat</h1>
            <p className="text-center">Provide your true feedback here. You will be kept anonymous.</p>
            <div className="w-1/2 my-20 border-2 border-zinc-400 p-2 rounded-md">
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
            </div>
        </div>
    );
};

export default FeedbackPage;