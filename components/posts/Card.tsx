import { Clipboard, ClipboardCheck, ClipboardX } from 'lucide-react';
import React from 'react'
interface Props {
    post: PostWithId;
    handleDeletePost: (_id: string) => void;
}

export default function Post({post, handleDeletePost}: Props) {
    const [copied, setCopied] = React.useState(false);
    const [clicked, setClicked] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const copyText = () => {
        setClicked(true);
        window.focus();
        navigator.clipboard.writeText(post.content).then(
            () => {
                setTimeout(() => {setCopied(true)}, 1000);
                setTimeout(() => {setCopied(false),setClicked(false)}, 3000);
            }
        )
      }
      function deletePost() { //this is new fucntion that is being called in this page
        if (window.confirm("Are you sure you want to delete this post?")){
            handleDeletePost(post._id);
        }
      }
  return (
    <div className='w-full flex flex-col gap-4 shadow-sm p-4 rounded-xl bg-white'>
        <div className='flex flex-row justify-between'>
            <h1 className='text-xl font-bold text-gray-800'>{post.title}</h1>
            <div className='flex flex-row gap-2'>
                {copied ? 
                        <ClipboardCheck className="z-10 text-indigo-600 cursor-pointer" size={20} onClick={copyText}/> :
                        <Clipboard className={`z-10 text-indigo-600 cursor-pointer ${clicked ? 'animate-pulse' : ''}`} size={20} onClick={copyText}/>
                }
                <ClipboardX className={`z-10 text-red-600 cursor-pointer ${loading ? 'animate-pulse' : ''}`} size={20}  onClick={deletePost}/>
            </div>
        </div>
        {typeof post.content === 'string' && <p className='text-gray-600'>{post.content}</p>}
    </div>
  )
}


