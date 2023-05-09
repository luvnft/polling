import { SimplePool } from "nostr-tools";
import { FaHeart, FaShare } from "react-icons/fa";
// components
import PollCardReplyTemp from "./PollCardReplyTemp";
import CommentModal from "./CommentButton";
import { useState } from "react";
import MajorityPoll from "./MajorityPoll";

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

   const [liked, setLiked] = useState(false);
   const curUser = {
      name: user.name,
      image: user.image,
      date: new Date(created_at * 1000).toISOString().split("T")[0],
   }

   return (
      <div className="p-4 border-t-2 border-b-2 border-white">
         <div className="user-info flex items-center mb-4">
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
         <p className="text-black text-md">
            {content}
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
         <div className="flex flex-row justify-start mt-4">
            <div className="gap-1">
               <CommentModal event={event} pool={pool} content={content} user={curUser} />
               <button className="text-white hover:text-red-300 py-2 px-4 rounded" onClick={() => setLiked(!liked)}>
                  <FaHeart color={`${liked ? "red" : ""}`} />
               </button>
               <button className="text-white hover:text-black py-2 px-4 rounded">
                  <FaShare />
               </button>
            </div>
            <div>
               <MajorityPoll event={event} pool={pool} />
            </div>
         </div>
         {/* buttons that we need to have at the end of this is like, comment, share, golden rule agree disagree bar */}
         <PollCardReplyTemp event={event} pool={pool} />
      </div >
   )
}