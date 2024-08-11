'use client';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const VerifyUser = () => {

    const router = useRouter();
    const param = useParams<{ username: string }>();
    const { toast } = useToast();


    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
            await axios.post(`/api/verify-code`, {
                username: param.username,
                code: data.code
            })
            toast({
                title: 'Success',
                description: 'Code verified successfully',
                variant: 'default'
            });

            router.replace('sign-in');
        } catch (error) {
            console.error(error, 'Verify failed');
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: 'Sign Up failed',
                description: axiosError.response?.data.message,
                variant: 'destructive'
            })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Sign Up</h1>
                    <p className="text-gray-500">Create your account</p>
                </div>
                <div>
                    
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full'>
                            Verify
                        </Button>
                    </form>
                </Form>
                </div>
            </div>
        </div>
    );
};

export default VerifyUser;