import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer className='w-full bg-white shadow-md px-4 md:px-6 py-2 z-20 text-center justify-center'>
        <div>
            <Link href="https://twitter.com/aheman20" target='_blank'><h1 className='text-gray-600 cursor-pointer'>@ Akhil Hemanth</h1></Link>
        </div>
    </footer>
  )
}
