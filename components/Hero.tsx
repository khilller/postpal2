'use client'

import Link from 'next/link'
import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Hero() {

    const { user, error, isLoading } = useUser();
  return (
    <div>
        <p>This is the Main Page</p>
        <Link href="/api/auth/login">Login</Link>
        <p>{user?.name} is signed in!</p>
    </div>
  )
}
