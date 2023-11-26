"use client";

import React from "react";
import { refetchCreditsAtom } from "@/atoms/flagAtom";
import { ProfileAtom } from "@/atoms/profileAtom";
import { addCredits } from "@/lib/functions";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRecoilState, useRecoilValue } from "recoil";
import { getProfile } from '@/lib/functions';


export default withPageAuthRequired(function Profile() {
  const [profile, setProfile] = useRecoilState(ProfileAtom);
  const [refetchCredits, setRefetchCredits] = useRecoilState(refetchCreditsAtom);
  const refetchExistingCredits = useRecoilValue(refetchCreditsAtom)
  const { user, error } = useUser();

  function addCredit() {
    async function handler() {
      await addCredits();
      setRefetchCredits((prev) => !prev);
    };
    handler();
  }
  //added this function twice her and and at the credits section to make sure the credits are updated for the user in both places

  React.useEffect(() => {
    async function fetchProfile() {
      const profile = await getProfile();
      //console.log(profile);
      setProfile(profile);
    }
    if (user) fetchProfile();
  }, [profile, user, refetchCredits])
  
  return (
    <section className="w-full flex flex-col items-center">
      <section className="w-[95%] max-w-4xl flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold text-center mt-4 text-indigo-600">
          Profile
        </h1>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          You have {profile.credits} Credits.
        </h2>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold text-xl"
          onClick={addCredit}
        >
          Buy More credits
        </button>
      </section>
    </section>
  );
});
