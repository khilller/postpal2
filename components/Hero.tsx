'use client'

import Link from 'next/link'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Hero() {

    const { user, error, isLoading } = useUser();
  return (
      <section className="w-full flex flex-col px-4">
        {user ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="mt-10 text-3xl md:text-4xl font-bold text-center text-indigo-600">
              Hello, {user?.name || "dear user"}
            </h1>
            <h2 className="text-lg md:text-xl max-w-lg text-center mt-4">
              Welcome to PostPal, where you can easily create social media posts
              with just one click.
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="mt-4 text-4xl font-bold text-cetner text-indigo-600">
              Hello!
            </h1>
            <h2 className="text-xl max-w-lg text-center">
              Welcome to Postpal, where you can easily create social media posts
              with just one click!
            </h2>
            <a
              href="/api/auth/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500  cursor-pointer"
            >
              Login to get started!
            </a>
          </div>
        )}
      </section>
    );
}
