'use client';
import { signIn, signOut, useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from 'lucide-react';
import Link from "next/link";



const SignUp = () => {

    const [username, setUsername] = useState('');
    const [usernameMsg, setUsernameMsg] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 200)

    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        },
    })

    useEffect(() => {
        const usernameCheck = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMsg('');

                try {
                    const result = await axios.get(`/api/check-username?username=${username}`)
                    setUsernameMsg(result.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMsg(
                        'Error checking username'
                    )
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        usernameCheck();

    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await axios.post<ApiResponse>('/api/sign-up', data);

            if (result.data.success) {
                toast({
                    title: 'Success',
                    description: result.data.message,
                    variant: 'default'
                })
            }
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error(error, 'Error on signup');
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMsg = axiosError.response?.data.message;

            toast({
                title: 'Sign Up failed',
                description: errorMsg,
                variant: 'destructive'
            })
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Sign Up</h1>
                    <p className="text-gray-500">Create your account</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setUsername(e.target.value);
                                            }} />

                                    </FormControl>
                                    {isCheckingUsername && <Loader className="animate-spin" />}
                                    <p className={`text-sm ${usernameMsg === 'Username is available' ? 'text-green-500' : 'text-red-500'} `}>{usernameMsg}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="example@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter passowrd" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {
                                isSubmitting ? <><Loader className="mr-4 h-4 w-4 animate-spin" /> loading... </> : 'Sign Up'
                            }
                        </Button>
                    </form>
                </Form>
                <div className="mt-4">
                    <p className="text-gray-500">Already have an account? <Link className="text-blue-500" href="/sign-in">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;