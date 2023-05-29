import { useState } from 'react'
import CommentSection from "./CommentSection";
import { FaHeart, FaShare, FaComment } from "react-icons/fa";

import MajorityPoll from "../PostPoll/MajorityPoll";
import { SimplePool, Event } from 'nostr-tools';

interface Props {
   pool: SimplePool;
   event: Event;
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

   const [commentOpen, setCommentOpen] = useState(false);
   const [liked, setLiked] = useState(false);
   const curUser = {
      name: user.name,
      image: user.image,
      date: new Date(created_at * 1000).toISOString().split("T")[0],
   }

   return (
      <div className="flex flex-col border border-t">
         <div className="flex w-full justify-center items-center p-3">
            <MajorityPoll event={event} pool={pool} />
            <FaComment className='text-black mb-6 ml-20 hover:text-gray-300 cursor-pointer' onClick={() => setCommentOpen(!commentOpen)} />
            {/* <CommentModal event={event} pool={pool} content={content} user={curUser} /> */}
         </div>
         {
            commentOpen ?
               <CommentSection event={event} pool={pool} /> :
               null
         }
      </div>
   )
}
