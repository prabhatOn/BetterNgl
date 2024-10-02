'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user;

    const handleLogout = () => {
        signOut({ callbackUrl: '/' }); // Redirect to the landing page after logout
    };

    return (
        <nav className="p-4 md:p-6 shadow-md bg-black  z-10">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl text-white font-bold mb-4 md:mb-0">
                    TBH
                </a>
                {session ? (
                    <div className="flex items-center space-x-4">
                        <span className="mr-4">
                            Welcome, {user.username || user.email}
                        </span>
                        <Link href="/dashboard">
                            <Button
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                                variant="outline"
                            >
                                Dashboard
                            </Button>
                        </Link>
                        <Button
                            onClick={handleLogout}
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300  "
                            variant={'outline'}
                        >
                            Login
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
