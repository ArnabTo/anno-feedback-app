'use client';
import { useSession, signOut, signIn } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "../ui/button";


const Navbar = () => {

    const { data: session } = useSession();

    const user: User = session?.user;
    return (
        <nav className="shadow-md py-5">
            <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mx-10">
                <a className="text-zinc-900 text-3xl font-extrabold" href="#">AnnoFeed</a>
                {
                    session ? (
                        <div className="flex justify-center items-center gap-5">
                            <p className="text-black text-xl">Wellcome, <span className="font-extrabold text-green-500">{user?.username || user?.email}</span></p>
                            <Button onClick={() => signOut()}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                    <div>
                        <Button onClick={() => signIn()}>Sign In</Button>
                    </div>
                    )
                }
            </div>
            </div>
        </nav>
    );
};

export default Navbar;