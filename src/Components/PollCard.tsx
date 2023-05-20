import { SimplePool } from "nostr-tools";
// components
import CommentFooter from "./Comment/CommentFooter";


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

   function displayContent(content: string) {
      // make string into an array of words
      const words = content.split(" ");
      const pictures: string[] = [];
      const text: string[] = [];

      // loop through each word and see if it is a picture
      words.map((word) => {
         allowedTypes.map((type) => {
            word.includes(type) ?
            pictures.push(word) :
            text.push(word)
         })
      })

      // if there are pictures, display them
      if (pictures.length > 0) {
         return (
            <div className="flex flex-col gap-3">
               <p className="text-black text-md h-full w-full">
                  {text.join(" ")}
               </p>
               <div className="flex flex-row justify-center">
                  {pictures.map((picture) => (
                     <img src={picture} alt="Poll Picture" className="scale-25" />
                  ))}
               </div>
            </div>
         )
      } else {
         return (
            <p className="text-black text-md h-full w-full">
               {content}
            </p>
         )
      }
   }

   return (
      <div className="border justify-center rounded-sm shadow-md">
         <div className="flex w-1/2 border border-[#C5E0F6] bg-[#F4F7FA] user-info items-center rounded-b-lg p-2 mb-4">
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
         <CommentFooter event={event} pool={pool} content={content} user={user} created_at={created_at} hashtags={hashtags} />
      </div >
   )
}