import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function Home() {
  return (
    <div>
      <div className="bg-green-500 w-52 lg:w-96 h-96 rounded-full blur-[150px] absolute left-0 xl:left-80 top-1/4 animate-movez -z-50"></div>
      {/* <div className="bg-orange-500 w-52 lg:w-96 h-96 rounded-full blur-[150px] absolute left-0 xl:left-96 top-1/4 animate-movez -z-50"></div> */}
      <div className="flex flex-col justify-center items- mx-auto w-full lg:w-2/3 h-screen space-y-5">
        <h1 className="text-zinc-950 font-extrabold text-6xl text-center flex justify-center items-center ">Wellcome to AnnoChat</h1>
        <p className="text-center ">Join the conversation! AnnoChat is a platform where you can anonymously share your thoughts, feelings, and experiences with others. Connect with like-minded individuals, get feedback, and gain new perspectives on life. Our community is a safe space for you to express yourself freely, without fear of judgment or repercussions.</p>
     <Button className="mx-auto py-6">Get Started</Button>
      </div>
    </div>
  );
}
