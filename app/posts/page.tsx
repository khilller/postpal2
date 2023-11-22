"use client";

import PostSkeleton from "@/components/PostSkeleton";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useState } from "react";

export default withPageAuthRequired(function Post() {
  const [loadingPost, setLoadingPost] = useState(true);
  return (
    <section className="w-full flex flex-col items-center">
      <section className="w-[95%] max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl font-bold mt-4 mb-4 text-indigo-600">
          Your Posts
        </h1>
        <div className="w-full flex flex-col gap-8 mt-4 items-center">
          {loadingPost && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}
        </div>
      </section>
    </section>
  );
});
