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
import { RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const Dashboard = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [profileUrl, setProfileUrl] = useState<string | null>(null);

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

    const refeshMessages = async() => {
        fetchMessages(true);
        setLoading(true);
        setIsSwitchLoading(false);

        try {
            const result = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(result.data.messages || []);

            toast({
                title: 'Refreshed',
                description: 'Messages are refreshed'
            })
           
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive'
            })
        } finally {
            setLoading(false);
        }
    }
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
            setValue('acceptMessages', !acceptMessages);

            if (acceptMessages) {
                toast({
                    title: 'Messages Disabled',
                    description: 'You’ve stopped accepting new messages. No further feedback will be collected.',
                    variant: 'destructive'
                })
            } else {
                toast({
                    title: 'Messages Enabled',
                    description: 'You’re now accepting new anonymous messages. Feedback will appear on your dashboard.',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive'
            })
        }
    }
    const username = session?.user?.name || 'User';
    useEffect(() => {
        // This code will only run on the client-side
        if (typeof window !== 'undefined') {
            const baseUrl = `${window.location.protocol}//${window.location.host}`;
            setProfileUrl(`${baseUrl}/u/${username}`);
        }
    }, [session, username]);


    const copyToClipBoard = () => {
        if (profileUrl) {
            navigator.clipboard.writeText(profileUrl);
            toast({
                title: 'Success',
                description: 'Copied to clipboard',
            });
        }
    }

    if (status !== 'authenticated') return <div className='text-center text-5xl font-extrabold flex justify-center items-center mt-60'>Please Login</div>

    if (!session || !session.user) return (<div className='text-center text-5xl font-extrabold flex justify-center items-center mt-60'>Please Login</div>)


    return (
        <div className='max-w-6xl mx-10 lg:mx-auto my-10'>
            <div>
                <h1 className="text-4xl text-purple-600 text-start md:text-center font-bold">Welcome to Your Anno Feedback Dashboard</h1>
                <p className='text-lg md:text-center'>Share your unique link to collect anonymous thoughts and feedback from others.</p>
            </div>
            <div className="flex flex-col gap-3 mt-5">
                <div>

                </div>
                <div>
                    <div className="flex flex-col gap-5 mt-5 mb-10">
                        <div>
                            <p className="text-lg font-bold">Copy Profile URL</p>
                            <p>Copy the the link and share it with others</p>
                            <div className='flex items-center gap-2 mt-3'>
                                <p className="w-full text-lg bg-purple-100 rounded-md px-2 py-1">{profileUrl}</p>
                                <Button onClick={copyToClipBoard} >Copy</Button>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg font-bold">Accept Messages</p>
                            <p>Toggle the switch to enable or disable new messages</p>
                            <div className="flex flex-row gap-3 mt-3">
                                <Switch {...register('acceptMessages')}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitch}
                                    disabled={isSwitchLoading}
                                />
                                <p>{acceptMessages ? 'On' : 'Off'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className='mb-10'>
                        <h2 className="text-2xl font-bold">Messages</h2>
                        <Button onClick={refeshMessages}><RefreshCcw className=' animate-spin repeat-1 ' /></Button>
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {
                                messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <MsgCard
                                            key={index}
                                            message={msg}
                                            onMessageDelete={handleDeleteMessage}
                                        />
                                    ))
                                ) : (<p className="text-lg">No messages is available</p>)
                            }

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Dashboard;