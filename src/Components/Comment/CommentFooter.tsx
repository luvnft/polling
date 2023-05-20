import React, { useState } from 'react'
import CommentSection from "./CommentSection";
import CommentModal from "./CommentButton";
import { FaHeart, FaShare } from "react-icons/fa";
import MajorityPoll from "../PostPoll/MajorityPoll";
import { SimplePool } from 'nostr-tools';

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

export default function CommentFooter({ content, user, created_at, hashtags, pool, event }: Props) {

   const [liked, setLiked] = useState(false);
   const curUser = {
      name: user.name,
      image: user.image,
      date: new Date(created_at * 1000).toISOString().split("T")[0],
   }
   
   return (
      <div className="flex justify-center border border-t">
         <div>
            <MajorityPoll event={event} pool={pool} />
         </div>
         <div className="flex justify-start items-start align-left">
            <CommentModal event={event} pool={pool} content={content} user={curUser} />
            <button className="text-black hover:text-red-300 py-2 px-4 rounded" onClick={() => setLiked(!liked)}>
               <FaHeart color={`${liked ? "red" : ""}`} />
            </button>
            <button className="text-black hover:text-gray-200 py-2 px-4 rounded">
               <FaShare />
            </button>
         </div>
      </div>
   )
}
