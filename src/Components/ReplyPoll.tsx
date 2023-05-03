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
}

export default function ReplyPoll({ event, pool }: Props) {

   const [pollReply, setPollReply] = useState("");
   const [pressed, setPressed] = useState(false);

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
            setPressed(false);
         });

      } catch (error) {
         console.log(error)
         alert("User rejected operation");
      }
   }

   return (
      <div>
         {!pressed ?
            (
               <button className="bg-violet-500 px-16 py-4 rounded-md font-bold hover:bg-violet-600 active:scale-90" onClick={() => setPressed(true)}>
                  Reply
               </button>
            )
            :
            (
               <div>
                  <h2 className="text-h3 text-white mb-12">What's In Your Mind??</h2><form onSubmit={onSubmit}>
                     <textarea
                        placeholder="Write your note here..."
                        className="w-full p-12 rounded-md"
                        value={pollReply}
                        onChange={(e) => setPollReply(e.target.value)}
                        rows={6} />
                     <div className="flex justify-end">
                        <button className="bg-violet-500 px-16 py-4 rounded-md font-bold hover:bg-violet-600 active:scale-90">
                           Reply
                        </button>
                     </div>
                  </form>
               </div>
            )
         }
      </div>
   )
}
