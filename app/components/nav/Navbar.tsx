import React from 'react'
import { PenTool } from 'lucide-react'
import Link from 'next/link'
import SignIn from '../SignIn'

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-4 md:px-6 py-2 z-20 flex flex-row justify-between">
    <Link
      href="/"
      className="flex flex-row justify-center font-bold text-xl text-indigo-600 items-center gap-2 cursor-pointer"
    >
      <PenTool size={20} /> Post Pal
    </Link>
    <div className="flex flex-row justify-end items-center">
      <SignIn />
    </div>
  </nav>
  )
}
