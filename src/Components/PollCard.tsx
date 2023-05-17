import { SimplePool } from "nostr-tools";
import { FaHeart, FaShare } from "react-icons/fa";
// components
import CommentSection from "./Comment/CommentSection";
import CommentModal from "./Comment/CommentButton";
import { useState } from "react";
import MajorityPoll from "./PostPoll/MajorityPoll";

interface Props {
   pool: SimplePool;
   event: {
      id: string;
      pubkey: string;
   };
   content: string;
   user: {
      name: string;
      image: string;
      pubkey: string;
   }
   created_at: number;
   hashtags: string[]
}

export default function PollCard({ content, user, created_at, hashtags, pool, event }: Props) {

   const allowedTypes = ["file.png"];
   const [liked, setLiked] = useState(false);
   const curUser = {
      name: user.name,
      image: user.image,
      date: new Date(created_at * 1000).toISOString().split("T")[0],
   }

   function displayContent(content: string) {
      // make string into an array of words
      const words = content.split(" ");
      const pictures: string[] = [];
      const text: string[] = [];

      console.log("Words: ", words)

      // loop through each word and see if it is a picture
      words.map((word) => {
         allowedTypes.map((type) => {word.includes(type) ? 
            pictures.push(word) :
            text.push(word)})
      })

      console.log("Pictures: ", pictures)
      console.log("Text: ", text)

      // if there are pictures, display them
      if (pictures.length > 0) {
         return (
            <div className="flex flex-col">
               <p className="text-white text-md h-full w-full">
                  {text.join(" ")}
               </p>
               <div className="flex flex-row justify-center">
                  {pictures.map((picture) => (
                     <img src={picture} alt="Poll Picture" className="h-1/2 w-1/2" />
                  ))}
               </div>
            </div>
         )
      } else {
         return (
            <p className="text-white text-md h-full w-full">
               {content}
            </p>
         )
      }
   }

   return (
      <div className="flex flex-row">
         <div className="flex flex-col border rounded-md w-1/2 p-4">
            <div className="flex user-info items-center mb-4">
               <img src={user.image} alt="User Avatar" className="h-8 w-8 rounded-full" />
               <a
                  href={`https://nostr.guru/p/${user.pubkey}`}
                  className="text-body3 text-white overflow-hidden text-ellipsis"
                  target="_blank"
                  rel="noreferrer"
               >
                  <p className="ml-2 font-semibold text-gray-700 text-sm">{user.name}</p>
               </a>
               <p className="ml-2 font-semibold text-xs text-gray-400">
                  {new Date(created_at * 1000).toISOString().split("T")[0]}
               </p>
            </div>
            <p className="text-white text-md h-full w-full">
               {displayContent(content)}
            </p>
            {/* <ul className="flex flex-wrap gap-4">
            {hashtags
               .filter((t) => hashtags.indexOf(t) === hashtags.lastIndexOf(t))
               .map((hashtag) => (
                  <li
                     key={hashtag}
                     className="bg-gray-300 text-gray-900 text-sm rounded-md p-2"
                  >
                     #{hashtag}
                  </li>
               ))}
         </ul> */}
            <div className="flex flex-row justify-start mt-auto">
               <div>
                  <MajorityPoll event={event} pool={pool} />
               </div>
               <div className="flex justify-start items-start align-left">
                  <CommentModal event={event} pool={pool} content={content} user={curUser} />
                  <button className="text-white hover:text-red-300 py-2 px-4 rounded" onClick={() => setLiked(!liked)}>
                     <FaHeart color={`${liked ? "red" : ""}`} />
                  </button>
                  <button className="text-white hover:text-black py-2 px-4 rounded">
                     <FaShare />
                  </button>
               </div>
            </div>
         </div >
         <CommentSection event={event} pool={pool} />
      </div>
   )
}