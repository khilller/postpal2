"use client";

import PostSkeleton from "@/components/PostSkeleton";
import { deletPost, getPosts } from "@/lib/functions";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import Card from "../../components/posts/Card";
import { ChevronDown, ChevronUp } from "lucide-react";

export default withPageAuthRequired(function Post() {
  const [loadingPost, setLoadingPost] = useState(true);
  const [fetchedPosts, setFetchedPosts] = useState<PostWithId[]>([]);
  const [toggleDropdown, setToggleDropdown] = useState<string | null>(null);
  const [toggleDropdown2, setToggleDropdown2] = useState(false);
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
  /*
  {!loadingPost && fetchedPosts.length > 0 && fetchedPosts.map((post) => (
            <Card post={post} key={post._id} handleDeletePost={handleDeletePost}/>
          ))}
  */
  

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
            {/* this adds dropdown and collects information as per the date */}
          {
            !loadingPost && fetchedPosts.length > 0 && 

            // Sort the posts by date created in descending order before grouping
            Object.entries(fetchedPosts.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime())
            .reduce((groupedPosts: {[key: string]: any[]}, post) => {
            // Convert the createdAt timestamp to a date string
            let date = new Date(post.createAt).toDateString();

            // If the date is invalid, set it to "Last Few Dates"
            if (date === "Invalid Date") {
            date = "Last Few Days";
            }

            // If there are no posts for this date yet, initialize an empty array
            if (!groupedPosts[date]) {
                groupedPosts[date] = [];
            }

            // Add the post to the array of posts for this date
            groupedPosts[date].push(post);

            // Return the grouped posts object to be used in the next iteration
            return groupedPosts;
            }, {}))
            // Sort the groups by date in descending order, handling "Last Few Days" separately
            .sort(([dateA], [dateB]) => {
              if (dateA === "Last Few Days") return 1;
              if (dateB === "Last Few Days") return -1;
              return new Date(dateB).getTime() - new Date(dateA).getTime();
            })
            .map(([date, posts]) => (
              <div key={date} className="w-full">
                <div className="flex flex-row w-full justify-between bg-white items-center rounded-md cursor-pointer"
                  onClick={() => setToggleDropdown(prev => date !== prev ? date : null)}
                >
                  <div>
                      <h1 className="text-2xl font-bold text-start text-gray-800  hover:text-indigo-600 px-4 py-2" >
                          {date}
                      </h1>
                  </div>
                  <div className="px-4">
                      <ChevronUp size={20} className={`transition-transform duration-300 ease-in-out ${toggleDropdown === date ? 'transform -rotate-180' : ''}`}/>
                  </div>
                </div>
                {toggleDropdown === date && (
                  <div className="w-full right-0 mt-3 p-5 rounded-lg bg-white min-w-[210px] flex flex-col gap-2 justify-end items-end shadow-md">
                      {posts.map((post) => (
                          <Card post={post} key={post._id} handleDeletePost={handleDeletePost}/>
                      ))}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      </section>
    </section>
  );
});
