import { useState } from "react";
import { EventTemplate, Event, getEventHash, SimplePool } from "nostr-tools";
import { Metadata, RELAYS } from "../App";

interface Props {
   pool: SimplePool;
   events: Event[];
   metadata: Record<string, Metadata>;
}

export default function CreatePoll({ pool, events, metadata }: Props) {
   const [input, setInput] = useState("");


   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!window.nostr) {
         alert("Nostr extension not found");
         return;
      }

      // Construct the event object
      const _baseEvent = {
         content: input,
         created_at: Math.round(Date.now() / 1000),
         kind: 1,
         tags: [["t", "aitc/polling/v1"], ["t", "poll"]],
      } as EventTemplate;

      // Sign this event (allow the user to sign it with their private key)
      // // check if the user has a nostr extension
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
            setInput("");
         });
      } catch (error) {
         console.log(error)
         alert("User rejected operation");
      }
   };

   return (
      <div className="bg-white shadow-md p-6 rounded-lg">
         <form onSubmit={onSubmit}>
            <textarea
               placeholder="What's on your mind?"
               className="w-full resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2 text-gray-700 leading-tight"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               rows={5}
            />
            <div className="flex justify-end mt-4">
               <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium">
                  Post
               </button>
            </div>
         </form>
      </div>
   );
}