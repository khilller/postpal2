"use client";

import PostSkeleton from "@/components/PostSkeleton";
import { deletPost, getPosts } from "@/lib/functions";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import Card from "../../components/posts/Card";

export default withPageAuthRequired(function Post() {
  const [loadingPost, setLoadingPost] = useState(true);
  const [fetchedPosts, setFetchedPosts] = useState<PostWithId[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      await getPosts().then((posts) => {
        setFetchedPosts(posts);
        setLoadingPost(false);
        //console.log(posts);
      })
    }
    fetchPosts();
  }, []); 

  function handleDeletePost(_id: string) {
    async function handler() {
      await deletPost(_id);
    }
    setFetchedPosts((prev) => prev.filter((post) => post._id !== _id));
    handler();
  }
  
  

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
          {!loadingPost && fetchedPosts.length === 0 && (
            <div>
              <h1 className="text-2xl font-bold text-center text-gray-800">
                You have no posts. 
              </h1>
              <Link className="bg-indigo-600 text-white px-4 py-2 rounded-md font-bold text-xl" href="/posts/new">Create one
              </Link>
          </div>
          )}
          {!loadingPost && fetchedPosts.length > 0 && fetchedPosts.map((post) => (
            <Card post={post} key={post._id} handleDeletePost={handleDeletePost}/>
          ))}
         
        </div>
      </section>
    </section>
  );
});
