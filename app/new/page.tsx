"use client";

import { Length } from "@/data/length";
import { Social } from "@/data/social";
import { Tones } from "@/data/tone";

import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { Loader2, ShieldAlert } from "lucide-react";
import React from "react";

export default withPageAuthRequired(function New() {
  const [post, setPost] = React.useState<Post | null>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = React.useState(false);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const [postPrompt, setPostPrompt] = React.useState<PostPrompt>({
    title: "",
    description: "",
    keywords: "",
    length: "",
    social: "",
    tone: "",
  });
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //reset all the flags
    setHasSubmitted(true);
    setError(false);
    setSuccess(false);
    setIsWaitingForResponse(true);
    console.log(postPrompt);
    //const res = await generatePost(postPrompt);
    //console.log(res);
    /*if (res) {
      setIsWaitingForResponse(false);
      setHasSubmitted(false);
      setSuccess(true);
      console.log(res);
      setPost(res);
    } else {
      setIsWaitingForResponse(false);
      setHasSubmitted(false);
      setError(true);
      console.log("error");
    }
  }*/
    /*await res
      .json()
      .then((data) => {
        setIsWaitingForResponse(false);
        setHasSubmitted(false);
        setSuccess(true);
        console.log(data);
        setPost(data.post);
      })
      .catch((err) => {
        setIsWaitingForResponse(false);
        setHasSubmitted(false);
        setError(true);
      });
      */
  }

  return (
    <section className="w-full flex flex-col items-center">
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
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, title: e.target.value })
              }
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
              onChange={(e) =>
                setPostPrompt({ ...postPrompt, description: e.target.value })
              }
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
          <button
            type="submit"
            className="bg-indigo-600 w-fit text-white px-4 py-2 rounded-md mt-4 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Generate
          </button>
        </form>
        {isWaitingForResponse && hasSubmitted && (
          <div className="w-full flex flex-col gap-4 mt-4 items-center">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
          </div>
        )}
        {error && (
          <div className="w-full flex flex-col gap-4 mt-4 items-center">
            <ShieldAlert className="w-8 h-8 text-rose-600 " />
            <p className="text-rose-600 text-cetnter">
              Something went wrong! Please try again
            </p>
          </div>
        )}
        {success && post && (
          <div className="w-full flex flex-col gap-4 mt-4">
            <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
            <p className="text-gray-600">{post.content}</p>
          </div>
        )}
      </section>
    </section>
  );
});
