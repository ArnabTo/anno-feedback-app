'use client';
import MsgCard from '@/components/navbar/MsgCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message, User } from '@/model/User';
import { MessageAcceptSchema } from '@/schemas/acceptMessageSchmea';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { CloudHail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { tree } from 'next/dist/build/templates/app-page';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Dashboard = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAcceptMessage, setIsAcceptMessage] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => msg._id !== messageId));
    }

    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(MessageAcceptSchema),
    });

    const { register, watch, setValue } = form;

    const acceptMessages = watch('acceptMessages');
    // console.log(acceptMessages)

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);

        try {
            const result = await axios.get<ApiResponse>('/api/message-accept');
            setValue('acceptMessages', result.data.isMessageAccpet);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true);
        setIsSwitchLoading(false);

        try {
            const result = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(result.data.messages || [])
            if (refresh) {
                toast({
                    title: 'Success',
                    description: 'Refreshed successfully',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setLoading(false);
        }
    }, [toast])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages();
        fetchAcceptMessage();
        console.log(status)
    }, [session, setValue, fetchAcceptMessage, fetchMessages, status])


    const handleSwitch = async () => {
        try {
            const result = axios.post('/api/message-accept', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive'
            })
        }
    }

    const username = session?.user?.name || 'User'
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'Success',
            description: 'Copied to clipboard',
        })
    }

    if(status !== 'authenticated') return <div>Please Login</div>

    if (!session || !session.user) return <div>Please Login</div>


    return (
  
            <div className='max-w-6xl lg:mx-auto'>
                <h1 className="text-4xl text-green-500 text-start font-bold py-4">Wellcome to your Dashboard</h1>
                <div className="flex flex-col gap-3 mt-5">
                    <div>
                        <h2 className="text-2xl font-bold bg-zinc-200 p-2 rounded-md">Profile</h2>
                        <div className="flex flex-col gap-3 mt-5">
                            <div className='flex items-center gap-4'>
                                <p className="text-lg font-bold bg-zinc-200 rounded-md p-2">Username:</p>
                                <p className="text-lg">{username || 'Username'}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className="text-lg font-bold bg-zinc-200 rounded-md p-2">Profile URL:</p>
                                <p className="text-lg bg-blue-200 rounded-md px-2 py-1">{profileUrl}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold bg-zinc-200 rounded-md p-2">Messages</h2>
                        <div className="flex flex-col gap-3 mt-5">
                            <div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-5">
                                    {
                                        messages.length > 0 ? (
                                            messages.map((msg, index) => (
                                                <MsgCard
                                                    key={index}
                                                    message={msg}
                                                    onMessageDelete={handleDeleteMessage}
                                                />
                                            ))
                                        ) : (<p className="text-lg font-bold">Messages</p>)
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                    <div>
                        <h2 className="text-2xl font-bold bg-zinc-200 rounded-md p-2">Settings</h2>
                        <div className="flex flex-col gap-3 mt-5">
                            <div>
                                <p className="text-lg font-bold">Accept Messages</p>
                                <div className="flex flex-row gap-3 mt-5">
                                    <Switch {...register('acceptMessages')}
                                        checked={acceptMessages}
                                        onCheckedChange={handleSwitch}
                                        disabled={isSwitchLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-5">
                    <div>
                        <h2 className="text-2xl font-bold bg-zinc-200 rounded-md p-2">Actions</h2>
                        <div className="flex flex-col gap-3 mt-5">
                            <div>
                                <p className="text-lg font-bold">Copy Profile URL</p>
                                <div className="flex flex-row gap-3 mt-5">
                                    <Button onClick={copyToClipBoard}>Copy</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    );
};

export default Dashboard;