import { EventTemplate, getEventHash, SimplePool, Event } from "nostr-tools";
import { useState } from "react";
import { RELAYS } from "../App";

// the reply takes in an event in order to reply to it
interface Props {
   pool: SimplePool;
   event: {
      id: string;
      pubkey: string;
   };
   toggleMenu: (show: boolean) => void;
}

export default function ReplyPoll({ event, pool, toggleMenu }: Props) {

   const [pollReply, setPollReply] = useState("");

   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!window.nostr) {
         alert("Nostr extension not found");
         return;
      }
      const _baseEvent = {
         content: pollReply,
         created_at: Math.round(Date.now() / 1000),
         kind: 1,
         tags: [
            [
               "e",
               event.id,
               "",
               "root"
            ],
            [
               "p",
               event.pubkey,
            ]
         ]
      } as EventTemplate;

      try {

         const pubkey = await window.nostr.getPublicKey();

         const sig = (await window.nostr.signEvent(_baseEvent)).sig;

         const event: Event = {
            ..._baseEvent,
            sig,
            pubkey,
            id: getEventHash({ ..._baseEvent, pubkey }),
         };

         const pubs = pool.publish(RELAYS, event);

         let clearedInput = false;

         pubs.on("ok", () => {
            if (clearedInput) return;

            clearedInput = true;
            setPollReply("");
         });

      } catch (error) {
         console.log(error)
         alert("User rejected operation");
      }
      toggleMenu(false);
   }

   return (
      <div>
         <form onSubmit={onSubmit}>
            <textarea
               placeholder="Write your note here..."
               className="border border-gray-300 rounded-lg w-full p-2 mb-4"
               value={pollReply}
               onChange={(e) => setPollReply(e.target.value)}
               rows={6} />
            <button className="bg-blue-500 text-white py-2 px-4 rounded">
               Reply
            </button>
         </form>
      </div>
   )
}
