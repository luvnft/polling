import { useState } from 'react'
import CommentSection from "./CommentSection";
import { FaHeart, FaShare, FaComment } from "react-icons/fa";

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

   const [commentOpen, setCommentOpen] = useState(false);
   const [liked, setLiked] = useState(false);
   const curUser = {
      name: user.name,
      image: user.image,
      date: new Date(created_at * 1000).toISOString().split("T")[0],
   }

   return (
      <div className="flex flex-col border border-t">
         <div className="flex flex-row">
            <div>
               <MajorityPoll event={event} pool={pool} />
            </div>
            <div className="flex w-full justify-between items-center p-3">
               {/* <CommentModal event={event} pool={pool} content={content} user={curUser} /> */}
               <FaComment className='text-black hover:text-gray-300' onClick={() => setCommentOpen(!commentOpen)} />
               <FaHeart className='text-black hover:text-red-300' onClick={() => setLiked(!liked)} />
               <FaShare className='text-black hover:text-gray-300' />
            </div>
         </div>
         {
            commentOpen ?
               <CommentSection event={event} pool={pool} /> :
               null
         }
      </div>
   )
}
