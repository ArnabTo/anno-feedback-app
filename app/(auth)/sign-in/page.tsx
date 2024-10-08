'use client';
import { signIn } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast, useToast } from "@/components/ui/use-toast";
import { redirect, useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";

const SignIn = () => {

    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
        identifier: '',
        password: ''
      }
    })
    const onSubmit = async (data:z.infer<typeof signInSchema>) =>{
        
        try {
            const result = await signIn('credentials',{
                redirect: false,
                identifier: data.identifier,
                password: data.password
            })
        
            if(result?.error){
                toast({
                    title: 'Login failed',
                    description: 'Invalid credentials',
                    variant: 'destructive'
                })
            }else{
                toast({
                    title: 'Success',
                    description: 'Login successful',
                    variant: 'default'
                })
            }
            if (result?.url) {
                setTimeout(() => {
                    router.replace("/dashboard");
                }, 2000); 
            }
            

        } catch (error) {
           console.log(error)
           toast({
               title: 'Login failed',
               description: 'Something went worng',
               variant: 'destructive'
           })
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md">
            <div className="mb-4">
                <h1 className="text-xl lg:text-4xl font-extrabold mb-2">Sign In</h1>
                <p className="text-gray-500 text-lg">Please sign in to continue.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="identifier"
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter passowrd" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                   Sign In
                    </Button>
                </form>
            </Form>
            <div className="mt-4">
                <p className="text-gray-500"><Link className="text-blue-500" href="/sign-up">Create an account</Link></p>
            </div>
        </div>
    </div>
    );
};

export default SignIn;