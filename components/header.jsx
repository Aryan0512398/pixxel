"use client";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import {BarLoader} from "react-spinners";
import { LayoutDashboardIcon } from "lucide-react";

function Header() {
  const path = usePathname();
  const {isLoading}=useStoreUserEffect();
  if(path.includes('/editor')){
    return null; // Don't render the header on editor pages
  }
  return (
    <div className="fixed z-1  top-6 left-1/2 -translate-x-1/2 text-nowrap">
      <div className="flex backdrop-blur-md bg-white/30  border border-gray-200  rounded-full px-4 py-2 shadow-lg items-center justify-between">
        <Link href="/" className="mr-10 md:mr-20">
          <Image
            src="/logo-text.png"
            alt="Logo"
            width={96}
            height={24}
            className="min-w-24 object-cover"
          />
        </Link>
        {path === "/" && (
          <div className="hidden md:flex space-x-6">
            <Link
              href="#features"
              className="text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Pricing
            </Link>
            <Link
              href="#contact"
              className="text-white font-medium transition-all duration-300 hover:text-cyan-400 cursor-pointer"
            >
              Contact
            </Link>
          </div>
        )}
         <div className="flex items-center gap-3 ml-10 md:ml-20">
             <SignedOut>
              <SignInButton>
                 <Button variant={'glass'} className={'hidden sm:flex'} >Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button variant={'primary'}>Get Started</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href={'/dashboard'} >
              <Button variant={'glass'} className={'hidden sm:flex'} >
                <LayoutDashboardIcon className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">
                  Dashboard
                </span>
               </Button>
              </Link>
              <UserButton appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonAvatar: "rounded-full",
                  userButtonAction: "hidden",
                  userButtonProfile: "hidden",
                },
              }} />
            </SignedIn>
         </div>
         {isLoading && 
         <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
          <BarLoader width={'90%'} color="#06b6d4"/>
         </div>}
      </div>
     
    </div>
  );
}

export default Header;
