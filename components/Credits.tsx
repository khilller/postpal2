'use client';

import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import { CircleDollarSign } from 'lucide-react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { ProfileAtom } from '@/atoms/profileAtom';
import { getProfile } from '@/lib/functions';
import { refetchCreditsAtom } from '@/atoms/flagAtom';

export default function Credits() {
  const [profile, setProfile] = useRecoilState(ProfileAtom);
  const { user } = useUser();
  const refetchCredits = useRecoilValue(refetchCreditsAtom)

  React.useEffect(() => {
    async function fetchProfile() {
      const profile = await getProfile();
      //console.log(profile);
      setProfile(profile);
    }
    if (user) fetchProfile();
  }, [profile, user, refetchCredits])

  return (
    <div className="flex flex-row justify-center items-center gap-1">
      <div className="flex flex-row gap-1 mr-3 md:text-lg items-center">
        <CircleDollarSign size={18} />
        <span className="hidden md:block">Credits:</span> {profile.credits}
      </div>
      <Link
        href=""
        className="text-sm md:text-lg font-bold text-gray-600 hover:text-indigo-600"
      >
        Buy More
      </Link>
    </div>
  )
}
