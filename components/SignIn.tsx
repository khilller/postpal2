"use client";

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Credits from './Credits';

export default function SignIn() {

    const { user } = useUser();
    const [toggleDropdown, setToggleDropdown] = React.useState(false);

  return (
    <div>
      {user ? (
        <div className="">
          <Image
            src={user.picture || ""}
            width={30}
            height={30}
            alt={user.name || "profile picture"}
            className="rounded-full cursor-pointer hover:brightness-10 "
            onClick={() => setToggleDropdown((prev) => !prev)}
          />
          {toggleDropdown && (
            <div className="dropdown">
              <Credits />
              <span className="h-0.5 w-full bg-gray-300"></span>
              <Link
                href="/new"
                onClick={() => setToggleDropdown((prev) => !prev)}
                className="hover:text-gray-500"
              >
                New
              </Link>
              <Link
                href="/posts"
                onClick={() => setToggleDropdown((prev) => !prev)}
                className="hover:text-gray-500"
              >
                Posts
              </Link>
              <Link
                href="/profile"
                onClick={() => setToggleDropdown((prev) => !prev)}
                className="hover:text-gray-500"
              >
                My Profile
              </Link>
              <Link
                href="/api/auth/logout"
                onClick={() => setToggleDropdown((prev) => !prev)}
                className="hover:text-gray-500 flex flex-row gap-2 items-center"
              >
                <LogOut size={20} />
                Logout
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link href="/api/auth/login">
          <button type="button" className="black_btn">
            Get Started
          </button>
        </Link>
      )}
    </div>
  )
}
