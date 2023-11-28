"use client";

import { Length } from "@/data/length";
import { Social } from "@/data/social";
import { Tones } from "@/data/tone";
import { withPageAuthRequired,useUser } from "@auth0/nextjs-auth0/client";
import { Loader2, ShieldAlert, ClipboardCheck,Clipboard } from "lucide-react";
import { useChat } from "ai/react"
import React from "react";
import { useRecoilState } from "recoil";
import { PostAtom } from "@/atoms/postAtom";
import { refetchCreditsAtom } from "@/atoms/flagAtom";

export default withPageAuthRequired( function New() {
  const [post, setPost] = React.useState("");
  const [posts, setPosts]  = React.useState("");
  const [isWaitingForResponse, setIsWaitingForResponse] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const characterCount = posts?.length || 0;
  const [userProfile, setUserProfile] = React.useState("");
  const [copied, setCopied] = React.useState(false); //this is for the clipboard icon
  const [clicked, setClicked] = React.useState(false); //this is for the clipboard icon animation
  const [refetchCredits, setRefetchCredits] = useRecoilState(refetchCreditsAtom);
 

  const { user } = useUser();

  const [postPrompt, setPostPrompt] = React.useState<PostPrompt>({
    title: "",
    description: "",
    keywords: "",
    length: "",
    social: "",
    tone: "",
  });

  const copyText = () => {
    setClicked(true);
    window.focus();
    navigator.clipboard.writeText(posts).then(
        () => {
            setTimeout(() => {setCopied(true)}, 1000);
            setTimeout(() => {setCopied(false),setClicked(false)}, 3000);
        }
    )
  }

  const prompt = `You are an amazing, ${postPrompt.social} media manager who writes amazing and thought provoking posts. Write me an interesting and eyecatching ${postPrompt.social} post of length ${postPrompt.length} from a first person narrative about ${postPrompt.description}. The title is: ${postPrompt.title} and the keywords are ${postPrompt.keywords}. The post should be SEO friendly and use the ${postPrompt.tone}.`

  const title : string = postPrompt.title; //this is the title that we will save to mongodb

   /* async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        setIsWaitingForResponse(true);
        setHasSubmitted(true);
        setError(false);
        setSuccess(false);
        try {
            const response = await fetch("/api/openai",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postPrompt),
            });
            const data = await response.json();
            setPost(data.post);
            console.log(post);
            setIsWaitingForResponse(false);
            setSuccess(true);
        } catch (error) {
            console.log(error);
            setIsWaitingForResponse(false);
            setError(true);
        }
    }*/

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
      setUserProfile(user?.sub || "") //need to make this a global state just so that we can use it for mongodb!
      e.preventDefault();
      setPosts("");
      setIsWaitingForResponse(true);
      setHasSubmitted(true);
      setError(false);
      setSuccess(false);
      try {
        const res = await fetch("/api/chat",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(postPrompt),
        });

        if (!res.ok) throw new Error(res.statusText);
        

        const data = res.body;
      

        if(!data) return new Response("No data provided", {status: 400});
        setRefetchCredits((prev) => !prev); //this is to update the credits in the profile page

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        let post = "";

        while(!done){
          const {value, done: readerDone} = await reader.read();
          done = readerDone;
          const chunkValue = decoder.decode(value);
          setPosts((prev) => prev + chunkValue);
          post += chunkValue; //this is the post that we will save to mongodb
          setPost((prev) => prev + chunkValue);
        }
        const response = await fetch("/api/savepost",{
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title, 
            content: post, 
            uid: user?.sub, 
            email: user?.email, 
            name: user?.name, 
            keywords: postPrompt.keywords,
            platform: postPrompt.social, 
            createAt: new Date()}),
        });
  
        const data2 = await response.json();
        //console.log(data2); //this is the response from mongodb
        setIsWaitingForResponse(false);
        setSuccess(true);
        //console.log(success);
            
        } catch (error) {
          console.log(error);
          setIsWaitingForResponse(false);
          setError(true);
        }
    }
    

  return (
    <section className="w-full flex flex-col items-center z-5">
      <section className="w-[95%] max-w-4xl">
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 mt-4 items-center"
        >
          <h1 className="text-4xl font-bold text-center text-indigo-600">
            Generate a new post!
          </h1>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-gray-600 text-sm font-semibold"
            >
              Title (optional)
            </label>
            <input
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="text"
              name="title"
              id="title"
              placeholder="Enter a title! (e.g. 'How to make a social Media Post')"
              value={postPrompt.title}
              onChange={(e) => setPostPrompt({ ...postPrompt, title: e.target.value })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-gray-600 text-sm font-semibold"
            >
              Description
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows={5}
              name="description"
              id="description"
              placeholder="Enter a Description"
              value={postPrompt.description}
              onChange={(e) => setPostPrompt({ ...postPrompt, description: e.target.value })}
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label
              htmlFor="keywords"
              className="text-gray-600 text-sm font-semibold"
            >
              Keywords
            </label>
            <input
              className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              type="text"
              name="keywords"
              id="keywords"
              placeholder="Enter a keyword (e.g. 'blog, post, writing')"
              value={postPrompt.keywords}
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, keywords: e.target.value })
              }
            />
          </div>
          <div className="w-full flex flex-col md:flex-row gap-4">
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="social"
                className="text-gray-600 text-sm font-semibold"
              >
                Choose Platform
              </label>
              <select
                name="social"
                id="social"
                value={postPrompt.social}
                onChange={(e) =>
                  setPostPrompt({ ...postPrompt, social: e.target.value })
                }
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {Social.map((social, index) => (
                  <option key={index} value={social.value}>
                    {social.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="length"
                className="text-gray-600 text-sm font-semibold"
              >
                Length
              </label>
              <select
                name="length"
                id="length"
                value={postPrompt.length}
                onChange={(e) =>
                  setPostPrompt({ ...postPrompt, length: e.target.value })
                }
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {Length.map((length, index) => (
                  <option key={index} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full flex flex-col gap-2">
              <label
                htmlFor="tone"
                className="text-gray-600 text-sm font-semibold"
              >
                Tone
              </label>
              <select
                name="tone"
                id="tone"
                value={postPrompt.tone}
                onChange={(e) =>
                  setPostPrompt({ ...postPrompt, tone: e.target.value })
                }
                className="w-full border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {Tones.map((tone, index) => (
                  <option key={index} value={tone.value}>
                    {tone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {isWaitingForResponse && hasSubmitted ? (
            <button
            className="bg-indigo-600 w-fit text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-500 transition-all cursor-pointer"
            >
            <Loader2 className="animate-spin w-16 h-6"  size={13}/>
            </button>) :
          (
            <button
            type="submit"
            className="bg-indigo-600 w-fit text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-500 transition-all cursor-pointer"
            >
            Generate
          </button>
          )}
        </form>
        
        {error && (
          <div className="w-full flex flex-col gap-4 mt-4 items-center">
            <ShieldAlert className="w-8 h-8 text-rose-600 " />
            <p className="text-rose-600 text-cetnter">
              We are experiencing high traffic, Please try again.
            </p>
          </div>
        )}

        {posts && (
          <div className="w-full flex flex-col gap-2 mt-4">
            <div className="flex flex-row justify-between">
              <label className="text-gray-600 text-sm font-semibold">
              Response
              </label>
              {copied ? 
                    <ClipboardCheck className="z-10 text-indigo-600 cursor-pointer" size={20} onClick={copyText}/> :
                    <Clipboard className={`z-10 text-indigo-600 cursor-pointer ${clicked ? 'animate-pulse' : ''}`} size={20} onClick={copyText}/>
            }
            </div>
          
          <textarea
            className="w-full border border-gray-200 shadow-md rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            rows={7}
            name="description"
            id="description"
            placeholder="Enter a Description"
            value={posts}
            readOnly
          />
          <div className="flex flex-row justify-between">
                <div></div>
                <p className="text-gray-600 text-sm">Total Characters: {characterCount}</p>
            </div>
        </div>
        )}
        
      </section>
    </section>
  );
});