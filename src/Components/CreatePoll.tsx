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
         tags: [["t", "aitc/polling/v1"]],
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
         <div>
            <h2 className="text-h3 text-white mb-12">What's In Your Mind??</h2>
            <form onSubmit={onSubmit}>
               <textarea
                  placeholder="Write your note here..."
                  className="w-full p-12 rounded-md"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={6}
               />
               <div className="flex justify-end">
                  <button className="bg-violet-500 px-16 py-4 rounded-md font-bold hover:bg-violet-600 active:scale-90">
                     Publish
                  </button>
               </div>
            </form>
         </div>
      );
   }