'use client'
import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
export default function Home() {

  const {data: session} = useSession();

  return (
    <div>
      {/* <div className="bg-green-500 w-52 lg:w-96 h-96 rounded-full blur-[150px] absolute left-0 xl:left-80 top-1/4 animate-movez -z-50"></div> */}
      <div className="bg-purple-600 w-16 lg:w-96 h-96 rounded-full blur-[150px] absolute left-0 xl:left-80 top-1/4 animate-movez -z-50"></div>
      <div className="flex flex-col justify-center items-center mx-auto w-full lg:w-2/3 h-screen space-y-5">
        <h1 className="text-zinc-950 font-extrabold text-4xl lg:text-6xl text-center flex flex-col lg:flex-row gap-5 justify-center items-center ">Wellcome to <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">AnnoChat</span></h1>
        <p className="text-center mx-5">Join the conversation! AnnoChat is a platform where you can anonymously share your thoughts, feelings, and experiences with others. Connect with like-minded individuals, get feedback, and gain new perspectives on life. Our community is a safe space for you to express yourself freely, without fear of judgment or repercussions.</p>
     {
      session ? <Link className="flex justify-center items-center gap-2" href='/dashboard'><Button className="flex text-lg gap-2">Get started <MoveRight/></Button></Link>  
      :
<Link className="flex justify-center items-center gap-2" href='/sign-in'><Button className="flex gap-2 text-lg">Get started<MoveRight/></Button> </Link>
     }
 
      </div>
    </div>
  );
}
