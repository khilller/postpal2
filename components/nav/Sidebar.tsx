import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plus, AlignLeft, UserCircle2 } from "lucide-react"
import { Menu } from '@/data/menu'

export default function Sidebar() {
    const { user } = useUser();
    const currentRoute = usePathname();

    function getIcon(icon: string) {
        switch(icon) {
            case 'plus':
                return <Plus size={20}/>
            case 'list':
                return <AlignLeft size={20}/>
            case 'user':
                return <UserCircle2 size={20}/>
        }
    }
  return user ? (
    <div className="bg-white border border-gray-100 py-2 hidden flex-shrink-0 flex-row justify-around md:block md:justify-start md:flex-col md:h-full md:w-32 z-10">
      {Menu.map((item, index) => (
        <Link
          key={index}
          href={item.route}
          className="flex flex-row gap-2 justify-start items-center relative hover:bg-indigo-50 px-4 py-2 cursor-pointer group rounded-lg"
        >
          <div className="flex flex-row items-center gap-2">
            {currentRoute === item.route && (
              <div className="absolute h-full hidden md:block w-2 bg-indigo-600 rounded-full -left-1"></div>
            )}
            {currentRoute === item.route && (
              <div className="absolute h-2 md:hidden w-full bg-indigo-600 rounded-full -top-3 left-0"></div>
            )}
            <span className="text-gray-500 group-hover:text-indigo-600">
              {getIcon(item.icon)}
            </span>
            <span className="ml-2 text-gray-500 group-hover:text-indigo-600">
              {item.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  ) : (
    <div></div>
  )
}
