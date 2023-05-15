import { SimplePool, Event, getEventHash, EventTemplate } from 'nostr-tools';
import React, { useEffect, useState } from 'react'
import { RELAYS } from "../App"
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';


interface Props {
   event: {
      id: string;
      pubkey: string;
   }
   pool: SimplePool;
}
export default function MajorityPoll({ event, pool }: Props) {
   const [agreeCount, setAgreeCount] = useState(0);
   const [disagreeCount, setDisagreeCount] = useState(0);

   const totalVotes = agreeCount + disagreeCount;
   const agreePercent = totalVotes === 0 ? 0 : Math.round((agreeCount / totalVotes) * 100);
   const disagreePercent = totalVotes === 0 ? 0 : Math.round((disagreeCount / totalVotes) * 100);


   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!window.nostr) {
         alert("Nostr extension not found");
         return;
      }

      const _baseEvent = {
         content: `${agreeCount},${disagreeCount}`,
         created_at: Math.round(Date.now() / 1000),
         kind: 30078,
         tags: [["d", event.id]],
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

         console.log("published event", event);

         pubs.on("ok", () => {
            if (clearedInput) return;
            clearedInput = true;
         });

      } catch (error) {
         console.log(error)
         alert("User rejected operation");
      }
   }

   // when component is mounted
   useEffect(() => {
      if (!pool) return;
      // subscribe to the events that have the d tag as the event sig
      const sub = pool.sub(RELAYS, [{
         kinds: [30078],
         limit: 100,
         "#d": [event.id],
      }]);

      // on subscrition set the results
      sub.on("event", (event: Event) => {
         console.log("MajorityPoll -> event", event)
         const pollValues = event.content.split(",").map(Number);
         setAgreeCount(pollValues[0]);
         setDisagreeCount(pollValues[1]);
         console.log("MajorityPoll -> pollValues", pollValues)
      })

      return () => {
         sub.unsub();
      }

   }, [])


   return (
      <div className="w-72">
         <div className="flex flex-row justify-between items-center px-1 gap-1">
            <form onSubmit={onSubmit}>
               <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => setAgreeCount((prevCount) => prevCount + 1)}
               >
                  <FaThumbsUp />
               </button>
            </form>
            <div className='flex flex-col w-full'>
               <p className='text-xs font-medium text-gray-900'>{agreePercent}% Agree {disagreePercent}% Disagree</p>
               <div className='h-3 rounded-full w-full bg-red-600'>
                  <div
                     style={{ width: `${agreePercent}%` }}
                     className={`h-full rounded-full bg-green-600`}>
                  </div>
               </div>
            </div>
            <form onSubmit={onSubmit}>
               <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => setDisagreeCount((prevCount) => prevCount + 1)}
               >
                  <FaThumbsDown />
               </button>
            </form>
         </div>
         <div className="p-2">
            <h2 className="text-sm font-medium items-center text-gray-900">Do you agree?</h2>
         </div>
      </div>
   );
}
